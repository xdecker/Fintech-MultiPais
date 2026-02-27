CREATE OR REPLACE FUNCTION notify_credit_status_changed()
RETURNS trigger AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM pg_notify(
      'credit_status_changed',
      json_build_object(
        'creditRequestId', NEW.id,
        'oldStatus', OLD.status,
        'newStatus', NEW.status
      )::text
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;