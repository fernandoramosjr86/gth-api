ALTER TABLE pessoas
    DROP CONSTRAINT IF EXISTS chk_pessoas_altura;

ALTER TABLE pessoas
    ALTER COLUMN altura TYPE NUMERIC(5, 2);

UPDATE pessoas
SET altura = altura * 100
WHERE altura < 3;

ALTER TABLE pessoas
    ADD CONSTRAINT chk_pessoas_altura CHECK (altura >= 50.00 AND altura <= 280.00);
