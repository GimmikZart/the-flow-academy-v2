
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
