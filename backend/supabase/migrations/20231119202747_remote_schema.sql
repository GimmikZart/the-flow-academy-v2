
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."create_activity_instance"("p_instance" "jsonb", "p_collaborators" bigint[], "p_activities" bigint[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  p_instance_id bigint;
BEGIN
  -- Inserisci una nuova riga nella tabella 'instances' e recupera l'instance_id
  INSERT INTO instances (name, level) VALUES (p_instance->>'name', p_instance->>'level') RETURNING id INTO p_instance_id;

  -- Chiama la funzione per aggiornare la tabella 'collaborator_instance'
  PERFORM update_collaborator_and_activities_instance(p_collaborators, p_activities, p_instance_id);
END;
$$;

ALTER FUNCTION "public"."create_activity_instance"("p_instance" "jsonb", "p_collaborators" bigint[], "p_activities" bigint[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."deactivate_activity"("p_activity_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Imposta a false il campo status nella tabella activities
  UPDATE activities SET status = false WHERE id = p_activity_id;

  -- Elimina tutte le righe nella tabella activity_collaborator con activity_id uguale all'ID dell'activity
  DELETE FROM activity_collaborator WHERE activity_id = p_activity_id;
END;
$$;

ALTER FUNCTION "public"."deactivate_activity"("p_activity_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_activities"() RETURNS TABLE("id" bigint, "name" character varying, "image" character varying, "category" character varying, "intern" boolean, "color" character varying, "status" boolean, "collaborators" bigint, "instances" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.image,
    c.name AS category,
    a.intern,
    a.color,
    a.status, -- Aggiungere il campo status
    (
      SELECT COUNT(*) FROM activity_collaborator ac WHERE ac.activity_id = a.id
    ) AS collaborators,
    (
      SELECT COUNT(*) FROM instance_activities ia WHERE ia.activity_id = a.id
    ) AS instances
  FROM activities a
  LEFT JOIN categories c ON a.category_id = c.id;
END;
$$;

ALTER FUNCTION "public"."get_activities"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_activity_for_edit"("p_activity_id" bigint) RETURNS TABLE("id" bigint, "image" character varying, "intern" boolean, "name" character varying, "status" boolean, "color" character varying, "description" "text", "category_id" bigint, "collaborators" bigint[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.image,
    a.intern,
    a.name,
    a.status,
    a.color,
    a.description,
    a.category_id,
    CASE WHEN count(ac.collaborator_id) > 0 THEN array_agg(ac.collaborator_id) ELSE ARRAY[]::bigint[] END AS collaborators
  FROM activities a
  LEFT JOIN activity_collaborator ac ON a.id = ac.activity_id
  WHERE a.id = p_activity_id
  GROUP BY a.id;
END;
$$;

ALTER FUNCTION "public"."get_activity_for_edit"("p_activity_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_incomplete_payments"("client_id_param" bigint) RETURNS TABLE("id" bigint, "client_id" bigint, "date" "date", "amount" smallint, "amount_required" smallint, "notes" "text", "instance_name" character varying, "instance_level" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.client_id, p.date, p.amount, p.amount_required, p.notes, i.name AS instance_name, i.level AS instance_level
    FROM payments p
    INNER JOIN instances i ON p.instance_id = i.id
    WHERE p.client_id = client_id_param
      AND p.amount < p.amount_required;
END;
$$;

ALTER FUNCTION "public"."get_incomplete_payments"("client_id_param" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_instances_data"() RETURNS TABLE("name" character varying, "level" "text", "activities" "jsonb", "collaborators" "jsonb", "clients" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.name,
    i.level,
    (
      SELECT jsonb_agg(a.name ORDER BY a.id)
      FROM activities a
      INNER JOIN instance_activities ia ON a.id = ia.activity_id
      WHERE ia.instance_id = i.id
    ) AS activities,
    (
      SELECT jsonb_agg(jsonb_build_object('name', c.name, 'surname', c.surname, 'avatar', c.avatar) ORDER BY c.id)
      FROM collaborators c
      INNER JOIN collaborator_instance ci ON c.id = ci.collaborator_id
      WHERE ci.instance_id = i.id
    ) AS collaborators,
    (
      SELECT jsonb_agg(cl.* ORDER BY cl.id)
      FROM clients cl
      INNER JOIN client_instance cli ON cl.id = cli.client_id
      WHERE cli.instance_id = i.id
    ) AS clients
  FROM instances i;
END;
$$;

ALTER FUNCTION "public"."get_instances_data"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_activity_collaborators"("p_activity_id" bigint, "p_collaborator_ids" bigint[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    deleted_count integer;
BEGIN
    -- Elimina le righe con collaborator_id non presenti nell'array
    DELETE FROM activity_collaborator ac
    WHERE ac.activity_id = p_activity_id
    AND ac.collaborator_id NOT IN (SELECT UNNEST(p_collaborator_ids));

    -- Conta quante righe sono state eliminate
    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Aggiungi le righe con collaborator_id presenti nell'array ma non nella tabella
    INSERT INTO activity_collaborator (activity_id, collaborator_id)
    SELECT p_activity_id, collaborator_id
    FROM UNNEST(p_collaborator_ids) collaborator_id
    WHERE collaborator_id NOT IN (
        SELECT collaborator_id FROM activity_collaborator WHERE activity_id = p_activity_id
    );

    -- Restituisci il numero di righe eliminate e aggiunte
    RAISE NOTICE 'Righe eliminate: %', deleted_count;
    RAISE NOTICE 'Righe aggiunte: %', array_length(p_collaborator_ids, 1) - deleted_count;
END;
$$;

ALTER FUNCTION "public"."update_activity_collaborators"("p_activity_id" bigint, "p_collaborator_ids" bigint[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_client_status_v2"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Raggruppa le righe per client_id
  WITH payments_grouped AS (
    SELECT
      client_id,
      ARRAY_AGG(DISTINCT status) AS statuses  -- Converti status in testo
    FROM
      payments
    GROUP BY
      client_id
  )

  -- Controlla ogni gruppo per client_id condiviso
  UPDATE
    clients
  SET
    status = CASE
      WHEN (
        SELECT
          count(*)
        FROM
          payments_grouped
        WHERE
          client_id = NEW.client_id
          AND statuses @> ARRAY[FALSE]
      ) > 0
      THEN
        1
      ELSE
        0
    END
  WHERE
    id = NEW.client_id
    AND status != 2; -- Rimuovi questa riga per evitare l'errore di sintassi
    
  RETURN NEW; -- Aggiungi questa riga per specificare il valore di ritorno
END;$$;

ALTER FUNCTION "public"."update_client_status_v2"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_collaborator_and_activities_instance"("p_collaborators" bigint[], "p_activities" bigint[], "p_instance_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  existing_collaborators bigint[];
  existing_activities bigint[];
  collaborator_id bigint;
  activity_id bigint;
BEGIN
  -- Seleziona gli ID dei collaboratori esistenti per l'instance specificato
  SELECT array_agg(ci.collaborator_id)
  INTO existing_collaborators
  FROM collaborator_instance ci
  WHERE ci.instance_id = p_instance_id;

  -- Inserisci i nuovi collaboratori che non sono già presenti
  FOR collaborator_id IN SELECT unnest(p_collaborators)
  LOOP
    IF collaborator_id IS NOT NULL AND collaborator_id NOT IN (SELECT unnest(existing_collaborators)) THEN
      INSERT INTO collaborator_instance (collaborator_id, instance_id) VALUES (collaborator_id, p_instance_id);
    END IF;
  END LOOP;

  -- Elimina le righe per i collaboratori che non sono più nell'array
  DELETE FROM collaborator_instance ci
  WHERE ci.instance_id = p_instance_id AND ci.collaborator_id NOT IN (SELECT unnest(p_collaborators));

  -- Seleziona gli ID delle attività esistenti per l'instance specificato
  SELECT array_agg(ia.activity_id)
  INTO existing_activities
  FROM instance_activities ia
  WHERE ia.instance_id = p_instance_id;

  -- Inserisci le nuove attività che non sono già presenti
  FOR activity_id IN SELECT unnest(p_activities)
  LOOP
    IF activity_id IS NOT NULL AND activity_id NOT IN (SELECT unnest(existing_activities)) THEN
      INSERT INTO instance_activities (activity_id, instance_id) VALUES (activity_id, p_instance_id);
    END IF;
  END LOOP;

  -- Elimina le righe per le attività che non sono più nell'array
  DELETE FROM instance_activities ia
  WHERE ia.instance_id = p_instance_id AND ia.activity_id NOT IN (SELECT unnest(p_activities));
END;
$$;

ALTER FUNCTION "public"."update_collaborator_and_activities_instance"("p_collaborators" bigint[], "p_activities" bigint[], "p_instance_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_collaborator_instance"("p_collaborators" bigint[], "p_instance_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  existing_collaborators bigint[];
  collaborator_id bigint;
BEGIN
  -- Seleziona gli ID dei collaboratori esistenti per l'instance specificato
  SELECT array_agg(ci.collaborator_id)
  INTO existing_collaborators
  FROM collaborator_instance ci
  WHERE ci.instance_id = p_instance_id;

  -- Inserisci i nuovi collaboratori che non sono già presenti
  FOR collaborator_id IN SELECT unnest(p_collaborators)
  LOOP
    IF collaborator_id IS NOT NULL AND collaborator_id NOT IN (SELECT unnest(existing_collaborators)) THEN
      INSERT INTO collaborator_instance (collaborator_id, instance_id) VALUES (collaborator_id, p_instance_id);
    END IF;
  END LOOP;

  -- Elimina le righe per i collaboratori che non sono più nell'array
  DELETE FROM collaborator_instance ci
  WHERE ci.instance_id = p_instance_id AND ci.collaborator_id NOT IN (SELECT unnest(p_collaborators));
END;
$$;

ALTER FUNCTION "public"."update_collaborator_instance"("p_collaborators" bigint[], "p_instance_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_payments_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Se "amount_required" è maggiore di "amount" (e non è null), setta lo status a false
    IF NEW.amount_required IS NOT NULL AND NEW.amount_required > NEW.amount THEN
        NEW.status := false;
    -- Se "amount_required" è null o uguale a "amount", setta lo status a true
    ELSE
        NEW.status := true;
    END IF;

    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_payments_status"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."upsert_payment"("payment_data" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    payment_id bigint;
BEGIN
    -- Estrai i valori dall'oggetto JSONB
    payment_id = (payment_data->>'id')::bigint;
    -- Altri campi da estrarre dall'oggetto JSONB

    -- Se payment_id non è nullo, cerca il pagamento esistente e aggiorna i valori
    IF payment_id IS NOT NULL THEN
        UPDATE payments
        SET
            amount = (payment_data->>'amount')::smallint,
            amount_required = (payment_data->>'amount_required')::smallint,
            date = (payment_data->>'date')::date,
            paid_in_date = (payment_data->>'paid_in_date')::date,
            notes = (payment_data->>'notes')::text
        WHERE id = payment_id;
    ELSE
        -- Altrimenti, crea una nuova riga nella tabella payments
        INSERT INTO payments (amount, paid_in_date, date, notes, client_id, instance_id, collaborator_id, status, type)
        VALUES (
            (payment_data->>'amount')::smallint,
            (payment_data->>'paid_in_date')::date,
            (payment_data->>'date')::date,
            (payment_data->>'notes')::text,
            (payment_data->>'client_id')::bigint,
            (payment_data->>'instance_id')::bigint,
            (payment_data->>'collaborator_id')::bigint,
            (payment_data->>'status')::boolean,
            (payment_data->>'type')::smallint
        );
    END IF;
END;
$$;

ALTER FUNCTION "public"."upsert_payment"("payment_data" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."activities" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "category_id" bigint,
    "color" character varying,
    "description" "text",
    "image" character varying,
    "intern" boolean NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."activities" OWNER TO "postgres";

ALTER TABLE "public"."activities" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."activities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."instances" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "level" "text" NOT NULL,
    "cost" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "public"."instances" OWNER TO "postgres";

ALTER TABLE "public"."instances" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."activityOpen_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."activity_collaborator" (
    "id" bigint NOT NULL,
    "activity_id" bigint NOT NULL,
    "collaborator_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."activity_collaborator" OWNER TO "postgres";

ALTER TABLE "public"."activity_collaborator" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."actvity_collaborator_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "name" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" bigint NOT NULL,
    "avatar" character varying,
    "name" character varying NOT NULL,
    "surname" character varying NOT NULL,
    "gender" boolean NOT NULL,
    "email" character varying,
    "telephone" character varying,
    "dateOfBirth" "date",
    "address" character varying,
    "firstContact" "date",
    "sizes" "jsonb",
    "status" smallint,
    "notes" "text"
);

ALTER TABLE "public"."clients" OWNER TO "postgres";

ALTER TABLE "public"."clients" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."client_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."client_instance" (
    "id" bigint NOT NULL,
    "client_id" bigint,
    "instance_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" boolean NOT NULL
);

ALTER TABLE "public"."client_instance" OWNER TO "postgres";

ALTER TABLE "public"."client_instance" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."client_instance_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."collaborator_instance" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "collaborator_id" bigint NOT NULL,
    "instance_id" bigint NOT NULL
);

ALTER TABLE "public"."collaborator_instance" OWNER TO "postgres";

ALTER TABLE "public"."collaborator_instance" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."collaborator_istance_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."collaborators" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar" character varying,
    "name" character varying NOT NULL,
    "surname" character varying NOT NULL,
    "gender" boolean,
    "email" character varying,
    "telephone" character varying,
    "dateOfBirth" "date",
    "address" character varying,
    "sizes" "jsonb" DEFAULT '{"head": "", "pants": "", "shirt": "", "shoes": ""}'::"jsonb",
    "firstContact" "date",
    "status" smallint NOT NULL,
    "description" "text",
    "color" character varying,
    "linkSocial" "jsonb" DEFAULT '{"fb": "", "ig": "", "ln": "", "tk": "", "web": ""}'::"jsonb",
    "notes" "text"
);

ALTER TABLE "public"."collaborators" OWNER TO "postgres";

ALTER TABLE "public"."collaborators" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."collaborators_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."instance_activities" (
    "id" bigint NOT NULL,
    "instance_id" bigint NOT NULL,
    "activity_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."instance_activities" OWNER TO "postgres";

ALTER TABLE "public"."instance_activities" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."instance_activities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" bigint NOT NULL,
    "type" smallint NOT NULL,
    "amount" smallint DEFAULT '0'::smallint NOT NULL,
    "date" "date",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "client_id" bigint,
    "collaborator_id" bigint,
    "instance_id" bigint,
    "amount_required" smallint,
    "paid_in_date" "date",
    "status" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."payments" OWNER TO "postgres";

ALTER TABLE "public"."payments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "activityOpen_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."activity_collaborator"
    ADD CONSTRAINT "actvity_collaborator_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."client_instance"
    ADD CONSTRAINT "client_instance_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "client_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."collaborator_instance"
    ADD CONSTRAINT "collaborator_istance_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."collaborators"
    ADD CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."instance_activities"
    ADD CONSTRAINT "instance_activities_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "payments_amount_trigger" BEFORE INSERT OR UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_payments_status"();

CREATE OR REPLACE TRIGGER "payments_trigger_for_clients_status_v2" AFTER INSERT OR DELETE OR UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_client_status_v2"();

ALTER TABLE ONLY "public"."activities"
    ADD CONSTRAINT "activities_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."activity_collaborator"
    ADD CONSTRAINT "activity_collaborator_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."activity_collaborator"
    ADD CONSTRAINT "activity_collaborator_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "public"."collaborators"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."client_instance"
    ADD CONSTRAINT "client_instance_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."client_instance"
    ADD CONSTRAINT "client_instance_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."collaborator_instance"
    ADD CONSTRAINT "collaborator_instance_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "public"."collaborators"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."collaborator_instance"
    ADD CONSTRAINT "collaborator_instance_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."instance_activities"
    ADD CONSTRAINT "instance_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."instance_activities"
    ADD CONSTRAINT "instance_activities_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "public"."collaborators"("id") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "public"."instances"("id") ON DELETE RESTRICT;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_activity_instance"("p_instance" "jsonb", "p_collaborators" bigint[], "p_activities" bigint[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_activity_instance"("p_instance" "jsonb", "p_collaborators" bigint[], "p_activities" bigint[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_activity_instance"("p_instance" "jsonb", "p_collaborators" bigint[], "p_activities" bigint[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."deactivate_activity"("p_activity_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."deactivate_activity"("p_activity_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."deactivate_activity"("p_activity_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_activities"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_activities"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_activities"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_activity_for_edit"("p_activity_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_activity_for_edit"("p_activity_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_activity_for_edit"("p_activity_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_incomplete_payments"("client_id_param" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_incomplete_payments"("client_id_param" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_incomplete_payments"("client_id_param" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_instances_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_instances_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_instances_data"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_activity_collaborators"("p_activity_id" bigint, "p_collaborator_ids" bigint[]) TO "anon";
GRANT ALL ON FUNCTION "public"."update_activity_collaborators"("p_activity_id" bigint, "p_collaborator_ids" bigint[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_activity_collaborators"("p_activity_id" bigint, "p_collaborator_ids" bigint[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_client_status_v2"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_client_status_v2"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_client_status_v2"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_collaborator_and_activities_instance"("p_collaborators" bigint[], "p_activities" bigint[], "p_instance_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."update_collaborator_and_activities_instance"("p_collaborators" bigint[], "p_activities" bigint[], "p_instance_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_collaborator_and_activities_instance"("p_collaborators" bigint[], "p_activities" bigint[], "p_instance_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_collaborator_instance"("p_collaborators" bigint[], "p_instance_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."update_collaborator_instance"("p_collaborators" bigint[], "p_instance_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_collaborator_instance"("p_collaborators" bigint[], "p_instance_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."update_payments_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_payments_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_payments_status"() TO "service_role";

GRANT ALL ON FUNCTION "public"."upsert_payment"("payment_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_payment"("payment_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_payment"("payment_data" "jsonb") TO "service_role";

GRANT ALL ON TABLE "public"."activities" TO "anon";
GRANT ALL ON TABLE "public"."activities" TO "authenticated";
GRANT ALL ON TABLE "public"."activities" TO "service_role";

GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activities_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."instances" TO "anon";
GRANT ALL ON TABLE "public"."instances" TO "authenticated";
GRANT ALL ON TABLE "public"."instances" TO "service_role";

GRANT ALL ON SEQUENCE "public"."activityOpen_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activityOpen_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activityOpen_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."activity_collaborator" TO "anon";
GRANT ALL ON TABLE "public"."activity_collaborator" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_collaborator" TO "service_role";

GRANT ALL ON SEQUENCE "public"."actvity_collaborator_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."actvity_collaborator_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."actvity_collaborator_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";

GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."client_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."client_instance" TO "anon";
GRANT ALL ON TABLE "public"."client_instance" TO "authenticated";
GRANT ALL ON TABLE "public"."client_instance" TO "service_role";

GRANT ALL ON SEQUENCE "public"."client_instance_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."client_instance_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."client_instance_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."collaborator_instance" TO "anon";
GRANT ALL ON TABLE "public"."collaborator_instance" TO "authenticated";
GRANT ALL ON TABLE "public"."collaborator_instance" TO "service_role";

GRANT ALL ON SEQUENCE "public"."collaborator_istance_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."collaborator_istance_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."collaborator_istance_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."collaborators" TO "anon";
GRANT ALL ON TABLE "public"."collaborators" TO "authenticated";
GRANT ALL ON TABLE "public"."collaborators" TO "service_role";

GRANT ALL ON SEQUENCE "public"."collaborators_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."collaborators_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."collaborators_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."instance_activities" TO "anon";
GRANT ALL ON TABLE "public"."instance_activities" TO "authenticated";
GRANT ALL ON TABLE "public"."instance_activities" TO "service_role";

GRANT ALL ON SEQUENCE "public"."instance_activities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."instance_activities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."instance_activities_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";

GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
