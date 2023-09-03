
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
