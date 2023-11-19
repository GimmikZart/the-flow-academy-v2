CREATE OR REPLACE FUNCTION update_client_status()
RETURNS trigger
AS
$$
BEGIN
  -- Seleziona tutte le righe dalla tabella payments
  SELECT
    *
  FROM
    payments;

  -- Raggruppa le righe per client_id
  WITH payments_grouped AS (
    SELECT
      client_id,
      ARRAY_AGG(DISTINCT status) AS statuses
    FROM
      payments
    GROUP BY
      client_id
  )

  -- Controlla ogni gruppo per client_id condiviso
  UPDATE
    clients
  SET
    status = CASE
      WHEN (
        SELECT
          count(*)
        FROM
          payments_grouped
        WHERE
          client_id = NEW.client_id
          AND statuses @> ARRAY['FALSE']
      ) > 0
      THEN
        2
      ELSE
        1
    END
  WHERE
    id = NEW.client_id;

END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_client_status
AFTER UPDATE ON payments
FOR EACH ROW
EXECUTE PROCEDURE update_client_status();