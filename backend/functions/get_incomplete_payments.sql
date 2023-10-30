CREATE OR REPLACE FUNCTION get_incomplete_payments(client_id_param bigint)
RETURNS TABLE (
    id bigint,
    client_id bigint,
    date date,
    amount smallint,
    amount_required smallint,
    notes text,
    instance_name character varying,
    instance_level text
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.client_id, p.date, p.amount, p.amount_required, p.notes, i.name AS instance_name, i.level AS instance_level
    FROM payments p
    INNER JOIN instances i ON p.instance_id = i.id
    WHERE p.client_id = client_id_param
      AND p.amount < p.amount_required;
END;
$$
LANGUAGE plpgsql;