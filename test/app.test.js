const app = require("../server.js");

if (require.main === module) {
  tests();
}

function tests() {
  let passed = 0;
  let total = 0;

  function assert(condicao, mensagem) {
    total++;
    if (condicao) {
      passed++;
      console.log(`  ✓ ${mensagem}`);
    } else {
      console.log(`  ✗ ${mensagem}`);
    }
  }

  const http = require("http");
  const porta = 3001;
  const server = app.listen(porta, async () => {
    console.log("Testes iniciados...\n");

    async function requisicao(method, path, body = null) {
      return new Promise((resolve) => {
        const data = body ? JSON.stringify(body) : null;
        const req = http.request(
          {
            hostname: "localhost",
            port: porta,
            path,
            method,
            headers: {
              "Content-Type": "application/json",
              "Content-Length": data ? Buffer.byteLength(data) : 0,
            },
          },
          (res) => {
            let chunks = "";
            res.on("data", (c) => (chunks += c));
            res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(chunks || "{}") }));
          }
        );
        if (data) req.write(data);
        req.end();
      });
    }

    try {
      const resGet = await requisicao("GET", "/api/notas");
      assert(resGet.status === 200, "GET /api/notas retorna 200");
      assert(Array.isArray(resGet.body), "Resposta é um array");

      const novaNota = { titulo: "Teste", concluido: false };
      const resPost = await requisicao("POST", "/api/notas", novaNota);
      assert(resPost.status === 201, "POST /api/notas retorna 201");
      assert(resPost.body.titulo === "Teste", "Nota criada com título correto");

      const idCriado = resPost.body.id;
      const resGetOne = await requisicao("GET", `/api/notas/${idCriado}`);
      assert(resGetOne.status === 200, "GET /api/notas/:id retorna 200");

      const resPut = await requisicao("PUT", `/api/notas/${idCriado}`, {
        titulo: "Nota atualizada",
        concluido: true,
      });
      assert(resPut.status === 200, "PUT /api/notas/:id retorna 200");
      assert(resPut.body.titulo === "Nota atualizada", "Nota atualizada");

      const resDel = await requisicao("DELETE", `/api/notas/${idCriado}`);
      assert(resDel.status === 200, "DELETE /api/notas/:id retorna 200");

      const res404 = await requisicao("GET", "/api/notas/9999");
      assert(res404.status === 404, "Nota inexistente retorna 404");

      console.log(`\n${passed}/${total} testes passaram.`);
    } catch (err) {
      console.error("Erro nos testes:", err.message);
    } finally {
      server.close();
    }
  });
}

module.exports = tests;
