
BEGIN
  -- Imposta a false il campo status nella tabella activities
  UPDATE activities SET status = false WHERE id = p_activity_id;

  -- Elimina tutte le righe nella tabella activity_collaborator con activity_id uguale all'ID dell'activity
  DELETE FROM activity_collaborator WHERE activity_id = p_activity_id;
END;
