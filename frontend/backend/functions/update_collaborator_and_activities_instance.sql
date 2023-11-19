
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
