const r = require("express").Router();
const c = require("../controllers/senaiController");
const montar = require("./montar");
const { soAdmin } = require("../middleware/soAdmin");
r.get("/unidades", c.unidades.listar);
r.get("/unidade", c.unidades.listar);   // nome usado no Passo 2
r.get("/unidades/:id", c.unidades.buscar);
r.post("/unidades", soAdmin, c.unidades.criar);
r.put("/unidades/:id", soAdmin, c.unidades.atualizar);
r.delete("/unidades/:id", soAdmin, c.unidades.excluir);
montar(r, "/registros", c.registros);
montar(r, "/projetos", c.projetos);
montar(r, "/evidencias", c.evidencias);
module.exports = r;
