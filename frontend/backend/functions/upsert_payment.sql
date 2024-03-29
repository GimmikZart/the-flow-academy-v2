create
or replace function upsert_payment (payment_data jsonb) returns VOID as $$

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


$$ language plpgsql;