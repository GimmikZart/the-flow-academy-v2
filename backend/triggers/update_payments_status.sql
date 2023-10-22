CREATE OR REPLACE FUNCTION update_payments_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Se "amount_required" è maggiore di "amount" (e non è null), setta lo status a false
    IF NEW.amount_required IS NOT NULL AND NEW.amount_required > NEW.amount THEN
        NEW.status := false;
    -- Se "amount_required" è null o uguale a "amount", setta lo status a true
    ELSE
        NEW.status := true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crea il trigger per attivare la funzione solo sulle righe modificate o aggiunte
CREATE TRIGGER payments_amount_trigger
BEFORE INSERT OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_payments_status();