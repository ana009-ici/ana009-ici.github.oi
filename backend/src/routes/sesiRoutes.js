const r = require("express").Router();
const c = require("../controllers/sesiController");
const montar = require("./montar");
const { soAdmin } = require("../middleware/soAdmin");
r.get("/areas", c.areas.listar);
r.get("/areas/:id", c.areas.buscar);
r.post("/areas", soAdmin, c.areas.criar);
r.put("/areas/:id", soAdmin, c.areas.atualizar);
r.delete("/areas/:id", soAdmin, c.areas.excluir);
r.get("/bimestres", (req, res) => res.json([1, 2, 3, 4]));
montar(r, "/registros", c.registros);
montar(r, "/evidencias", c.evidencias);
// POP Portfólio EM 2025: 7 seções por área (anuais = 1 página; bimestrais = 4)
r.get("/secoes", c.secoes);
montar(r, "/paginas", c.paginas);
montar(r, "/pagina-evidencias", c.paginasEv);
r.route("/entrega").get(c.entrega).post(c.entregar);
module.exports = r;
