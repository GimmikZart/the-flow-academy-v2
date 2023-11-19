CREATE OR REPLACE FUNCTION get_instances_data() RETURNS TABLE (
  name character varying,
  level text,
  activities bigint[],
  collaborators bigint[],
  clients bigint[]
) AS
$$
BEGIN
  RETURN QUERY
  SELECT
    i.name,
    i.level,
    ARRAY(
      SELECT a.id
      FROM activities a
      INNER JOIN instance_activities ia ON a.id = ia.activity_id
      WHERE ia.instance_id = i.id
    ) AS activities,
    ARRAY(
      SELECT c.id
      FROM collaborators c
      INNER JOIN collaborator_instance ci ON c.id = ci.collaborator_id
      WHERE ci.instance_id = i.id
    ) AS collaborators,
    ARRAY(
      SELECT cl.id
      FROM clients cl
      INNER JOIN client_instance cli ON cl.id = cli.client_id
      WHERE cli.instance_id = i.id
    ) AS clients
  FROM instances i;
END;
$$
LANGUAGE plpgsql;
