
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
