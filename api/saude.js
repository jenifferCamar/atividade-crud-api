module.exports = (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.status(200).end(JSON.stringify({ status: "ok" }));
};
