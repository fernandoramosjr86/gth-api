INSERT INTO pessoas (nome, data_nascimento, cpf, sexo, altura, peso)
VALUES
    ('Ana Paula Souza', '1992-03-14', '10000000019', 'F', 165.00, 62.50),
    ('Bruno Henrique Lima', '1988-07-22', '10001379100', 'M', 178.00, 82.30),
    ('Carla Mendes Rocha', '1995-11-05', '10002758253', 'F', 160.00, 58.10),
    ('Daniel Oliveira Martins', '1983-01-19', '10004137302', 'M', 182.00, 88.40),
    ('Eduarda Cristina Alves', '1990-09-30', '10005516447', 'F', 170.00, 68.20),
    ('Felipe Augusto Pereira', '1998-04-11', '10006895573', 'M', 175.00, 76.00),
    ('Gabriela Nunes Costa', '1986-12-02', '10008274614', 'F', 158.00, 55.90),
    ('Henrique Barbosa Reis', '1991-06-25', '10009653767', 'M', 186.00, 92.70),
    ('Isabela Ferreira Gomes', '1997-08-17', '10011032898', 'F', 163.00, 60.40),
    ('Joao Pedro Carvalho', '1989-02-08', '10012411930', 'M', 172.00, 73.60),
    ('Karina Moreira Santos', '1993-05-28', '10013791010', 'F', 168.00, 64.80),
    ('Lucas Gabriel Ribeiro', '1985-10-13', '10015170160', 'M', 180.00, 84.10),
    ('Mariana Teixeira Lopes', '1999-01-07', '10016549279', 'F', 157.00, 54.30),
    ('Nicolas Fernandes Duarte', '1994-03-21', '10017928311', 'M', 177.00, 79.50),
    ('Olivia Martins Cardoso', '1987-07-04', '10019307462', 'F', 166.00, 61.70),
    ('Paulo Cesar Batista', '1982-11-26', '10020686579', 'M', 174.00, 81.20),
    ('Renata Almeida Freitas', '1996-09-09', '10022065610', 'F', 162.00, 59.60),
    ('Samuel Vieira Correia', '1990-12-18', '10023444762', 'M', 183.00, 87.90),
    ('Tatiane Campos Araujo', '1984-06-01', '10024823805', 'F', 169.00, 66.10),
    ('Victor Hugo Monteiro', '1992-10-29', '10026202956', 'M', 181.00, 85.40)
ON CONFLICT (cpf) DO NOTHING;
