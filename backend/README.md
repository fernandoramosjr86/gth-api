# GTH API

API REST para cadastro de pessoas e calculo de peso ideal, criada para o desafio de Desenvolvedor Java.

## Arquitetura

Fluxo principal:

```text
Controller -> Service -> Task -> Repository -> PostgreSQL
```

Pacotes principais:

```text
controller  Recebe chamadas HTTP e responde JSON
service     Coordena as regras da aplicacao
task        Executa operacoes objetivas de negocio e persistencia
repository  Acesso ao banco com Spring Data JPA
domain      Entidades e enums
dto         Contratos de entrada e saida da API
mapper      Conversao entre DTO e entidade
exception   Padrao de erros da API
```

## Endpoints iniciais

```text
POST   /api/pessoas
GET    /api/pessoas?page=0&size=10
GET    /api/pessoas?cpf={cpf}
GET    /api/pessoas/cpf/{cpf}
GET    /api/pessoas/{id}
PUT    /api/pessoas/{id}
DELETE /api/pessoas/{id}
GET    /api/pessoas/{id}/peso-ideal
POST   /api/pessoas/{id}/peso-ideal
```

## Exemplo de payload

```json
{
  "nome": "Maria Silva",
  "dataNascimento": "1990-05-10",
  "cpf": "12345678901",
  "sexo": "F",
  "altura": 168,
  "peso": 62.50
}
```

A altura deve ser informada em centimetros.

## Executando com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Servicos principais:

```text
API:     http://localhost:8080
Swagger: http://localhost:8080/swagger-ui.html
Health:  http://localhost:8080/actuator/health
Banco:   localhost:5432
```

Para subir tambem o pgAdmin:

```bash
docker compose --profile tools up --build
```

pgAdmin:

```text
URL:      http://localhost:5050
E-mail:   admin@gth.local
Senha:    admin
Servidor: postgres
Usuario:  gth_user
Senha:    gth_pass
Banco:    gth_db
```

## Variaveis de ambiente

```text
DB_URL
DB_USERNAME
DB_PASSWORD
SERVER_PORT
SPRING_THREADS_VIRTUAL_ENABLED
SPRING_MAIN_KEEP_ALIVE
```

## Virtual Threads

A API esta pronta para Virtual Threads com Java 21.

Por padrao, o recurso fica desligado:

```text
SPRING_THREADS_VIRTUAL_ENABLED=false
```

Para ativar no Docker Compose:

```bash
SPRING_THREADS_VIRTUAL_ENABLED=true docker compose up --build -d
```

No Windows PowerShell:

```powershell
$env:SPRING_THREADS_VIRTUAL_ENABLED = "true"
docker compose up --build -d
```

Tambem mantemos `SPRING_MAIN_KEEP_ALIVE=true`, recomendado para evitar que a JVM finalize quando componentes internos usam apenas threads daemon.

## Etapas do projeto

```text
Etapa 1 - Estrutura inicial do backend
Etapa 2 - Docker e ecossistema com PostgreSQL
Etapa 3 - CRUD completo de Pessoa - concluida
Etapa 4 - Calculo de peso ideal no servidor - concluida
Etapa 5 - Cobertura de testes - concluida
Etapa 6 - Frontend Angular
```

## Escopo da cobertura de testes

```text
Testes unitarios:
- PessoaTask
- PessoaService
- calculo de peso ideal
- regras de CPF duplicado

Testes de integracao:
- PessoaController
- CRUD completo via HTTP
- validacoes de payload
- migracao Flyway com PostgreSQL de teste
```

## Executando os testes

```bash
mvn verify
```

O `verify` tambem executa testes de integracao com Testcontainers e PostgreSQL real. Para isso, o Docker precisa estar disponivel no ambiente.

Relatorio de cobertura:

```text
target/site/jacoco/index.html
```

Resumo atual validado no build Docker:

```text
Testes unitarios/web no build Docker: 21
Testes de integracao: PessoaApiIT com PostgreSQL via Testcontainers
Status: sucesso
```
