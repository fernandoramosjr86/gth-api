CREATE TABLE pessoas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    sexo CHAR(1) NOT NULL,
    altura NUMERIC(4, 2) NOT NULL,
    peso NUMERIC(5, 2) NOT NULL,
    CONSTRAINT chk_pessoas_sexo CHECK (sexo IN ('M', 'F')),
    CONSTRAINT chk_pessoas_altura CHECK (altura >= 0.50 AND altura <= 2.80),
    CONSTRAINT chk_pessoas_peso CHECK (peso >= 1.00 AND peso <= 500.00)
);
