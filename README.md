# GTH

Projeto dividido em backend Java/Spring Boot e frontend Angular, com o ecossistema local orquestrado por Docker Compose.

## Estrutura

- `backend`: API `gth-api` em Java 21 com Spring Boot, PostgreSQL, Flyway, Swagger/OpenAPI, Actuator e testes com JaCoCo.
- `frontend/gth-front`: aplicacao Angular `gth-front`, baseada no template Egret.
- `frontend/themeforest-egret-angular`: template Egret comprado, preservado como referencia visual e estrutural.
- `docker-compose.yml`: sobe PostgreSQL, backend e frontend. PgAdmin fica em profile separado.

## Subir todo o ecossistema

```bash
docker compose up --build -d
```

Servicos principais:

- Frontend: http://localhost:4200
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Health check: http://localhost:8080/actuator/health
- PostgreSQL: `localhost:5432`

Credenciais do banco:

- Database: `gth_db`
- Usuario: `gth_user`
- Senha: `gth_pass`

Para subir tambem o PgAdmin:

```bash
docker compose --profile tools up -d pgadmin
```

PgAdmin:

- URL: http://localhost:5050
- Email: `admin@gth.local`
- Senha: `admin`

## Desenvolvimento local

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend/gth-front
npm install
npm run start:local
```

No desenvolvimento local, o Angular usa proxy para a API em `http://localhost:8080`.

## Virtual Threads

O backend esta preparado para usar Virtual Threads do Java 21. O recurso fica desligado por padrao e pode ser ativado por variavel de ambiente:

```bash
SPRING_THREADS_VIRTUAL_ENABLED=true docker compose up --build -d
```

No Windows PowerShell:

```powershell
$env:SPRING_THREADS_VIRTUAL_ENABLED = "true"
docker compose up --build -d
```

Use Virtual Threads para cenarios com muitas requisicoes concorrentes e tempo relevante de espera em I/O, como acesso ao PostgreSQL. O ganho real tambem depende do pool de conexoes, indices e consultas do banco.

## Testes e cobertura

Backend:

```bash
cd backend
mvn -B verify
```

Relatorio JaCoCo:

```text
backend/target/site/jacoco/index.html
```

Frontend:

```bash
cd frontend/gth-front
npm run test:ci
```

Relatorio de cobertura:

```text
frontend/gth-front/coverage/gth-front/index.html
```

## Parar o ambiente

```bash
docker compose down
```

Para remover tambem o volume do PostgreSQL:

```bash
docker compose down -v
```
