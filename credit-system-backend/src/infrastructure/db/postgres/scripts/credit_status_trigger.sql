DROP TRIGGER IF EXISTS credit_status_trigger
ON public."CreditRequest";

CREATE TRIGGER credit_status_trigger
AFTER UPDATE ON public."CreditRequest"
FOR EACH ROW
EXECUTE FUNCTION notify_credit_status_changed();