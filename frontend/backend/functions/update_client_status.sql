BEGIN
  -- Raggruppa le righe per client_id
  WITH payments_grouped AS (
    SELECT
      client_id,
      ARRAY_AGG(DISTINCT status) AS statuses  -- Converti status in testo
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
          AND statuses @> ARRAY[FALSE]
      ) > 0
      THEN
        1
      ELSE
        0
    END
  WHERE
    id = NEW.client_id
    AND status != 2; -- Rimuovi questa riga per evitare l'errore di sintassi
    
  RETURN NEW; -- Aggiungi questa riga per specificare il valore di ritorno
END;