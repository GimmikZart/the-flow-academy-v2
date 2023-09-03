
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
