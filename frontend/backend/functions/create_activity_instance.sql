
DECLARE
  p_instance_id bigint;
BEGIN
  -- Inserisci una nuova riga nella tabella 'instances' e recupera l'instance_id
  INSERT INTO instances (name, level) VALUES (p_instance->>'name', p_instance->>'level') RETURNING id INTO p_instance_id;

  -- Chiama la funzione per aggiornare la tabella 'collaborator_instance'
  PERFORM update_collaborator_and_activities_instance(p_collaborators, p_activities, p_instance_id);
END;
