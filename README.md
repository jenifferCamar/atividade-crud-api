# Atividade CRUD Notas API

API REST com Express implementando as quatro operações CRUD (Create, Read, Update, Delete) para gerenciamento de notas. Projeto da **Atividade 01 da Aula 05 — Criando APIs para o front-end**.

## Deploy

**[Acessar API](https://atividade-crud-api.onrender.com)** (Render)

## Tecnologias

- Express.js
- CORS
- Node.js

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Informações básicas da API |
| `GET` | `/api/saude` | Health check |
| `GET` | `/api/notas` | Lista todas as notas |
| `GET` | `/api/notas/:id` | Busca uma nota por ID |
| `POST` | `/api/notas` | Cria uma nova nota |
| `PUT` | `/api/notas/:id` | Atualiza uma nota |
| `DELETE` | `/api/notas/:id` | Remove uma nota |

### Exemplo de requisição — POST /api/notas

```json
{
  "titulo": "Nova nota",
  "concluido": false
}
```

### Exemplo de resposta — GET /api/notas

```json
[
  { "id": 1, "titulo": "Criar repositório Git", "concluido": false },
  { "id": 2, "titulo": "Desenvolver API com rotas CRUD", "concluido": true }
]
```

## Executar localmente

```bash
npm install
npm start
```

Acesse `http://localhost:3000`.

## Coleção Postman

A coleção Postman está em `postman/crud-api.postman_collection.json` e documenta as quatro operações CRUD.

## Deploy no Render

1. Envie este diretório para um repositório no GitHub (`atividade-crud-api`).
2. No Render, escolha **New > Web Service** e conecte o repositório.
3. Configure `npm install` como build e `npm start` como start command.
4. Configure `CORS_ORIGIN` com a URL do front-end na Vercel.
