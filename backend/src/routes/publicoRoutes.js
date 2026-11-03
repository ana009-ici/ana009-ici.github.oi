const r = require("express").Router();
const s = require("../services/publicoService");
r.get("/portfolio", async (req, res, next) => {            // GET apenas: o painel público nunca altera dados
  try { res.set("Cache-Control", "no-store"); res.json(await s.portfolio()); } catch (e) { next(e); }
});
module.exports = r;
