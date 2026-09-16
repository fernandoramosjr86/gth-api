# Frontend

O projeto Angular oficial da aplicacao fica em `gth-front`.

O diretorio `themeforest-egret-angular` contem o template Egret comprado e deve ser tratado como base de referencia visual e estrutural. As evolucoes da aplicacao devem acontecer em `gth-front`.

## Comandos

```bash
cd frontend/gth-front
npm install
npm run start:local
npm run build
npm run test:ci
```

O `start:local` sobe o Angular com proxy para a API em `http://localhost:8080`.

## Docker

O frontend tambem faz parte do ecossistema Docker principal do projeto.

```bash
docker compose up --build -d
```

Com o Compose, o frontend fica disponivel em `http://localhost:4200` e faz proxy de `/api` e `/actuator` para o backend.
