const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "notas.json");

const NOTAS_PADRAO = [
  { id: 1, titulo: "Criar repositório Git", concluido: false },
  { id: 2, titulo: "Desenvolver API com rotas CRUD", concluido: true },
  { id: 3, titulo: "Documentar coleção no Postman", concluido: false },
];

let notas = NOTAS_PADRAO.map((n) => ({ ...n }));

function carregarNotas() {
  try {
    const conteudo = fs.readFileSync(DATA_FILE, "utf-8");
    const dados = JSON.parse(conteudo);
    if (Array.isArray(dados) && dados.length > 0) {
      notas = dados;
    }
  } catch (erro) {
    if (erro.code !== "ENOENT") {
      console.warn("Arquivo de dados não pôde ser lido, usando memória:", erro.code);
    }
  }
}

function salvarNotas() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(notas, null, 2), "utf-8");
  } catch (erro) {
    console.warn("Persistência em arquivo indisponível, mantendo em memória:", erro.code);
  }
}

function gerarId() {
  return notas.length > 0 ? Math.max(...notas.map((n) => n.id)) + 1 : 1;
}

carregarNotas();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/api/notas", (_req, res) => {
  res.json(notas);
});

app.get("/api/saude", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/notas/:id", (req, res) => {
  const id = Number(req.params.id);
  const nota = notas.find((n) => n.id === id);
  if (!nota) {
    return res.status(404).json({ erro: "Nota não encontrada" });
  }
  res.json(nota);
});

app.post("/api/notas", (req, res) => {
  const { titulo, concluido = false } = req.body;
  if (!titulo) {
    return res.status(400).json({ erro: "O campo titulo é obrigatório" });
  }
  const novaNota = { id: gerarId(), titulo, concluido };
  notas.push(novaNota);
  salvarNotas();
  res.status(201).json(novaNota);
});

app.put("/api/notas/:id", (req, res) => {
  const id = Number(req.params.id);
  const nota = notas.find((n) => n.id === id);
  if (!nota) {
    return res.status(404).json({ erro: "Nota não encontrada" });
  }
  const { titulo, concluido } = req.body;
  if (titulo !== undefined) nota.titulo = titulo;
  if (concluido !== undefined) nota.concluido = concluido;
  salvarNotas();
  res.json(nota);
});

app.delete("/api/notas/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = notas.findIndex((n) => n.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Nota não encontrada" });
  }
  const removida = notas.splice(indice, 1)[0];
  salvarNotas();
  res.json({ mensagem: "Nota removida", nota: removida });
});

module.exports = app;
