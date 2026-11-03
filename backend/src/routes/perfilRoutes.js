const r = require("express").Router();
const c = require("../controllers/perfilController");
const s = require("../services/perfilService");
// /api/perfil-aluno (Passo 4) e /api/perfil-aluno/:id (Passo 2): o :id precisa ser o do perfil do próprio aluno
const conferirId = async (req, res, next) => {
  try { const p = await s.buscar(req.usuario.id); if (p.id !== req.params.id) return res.status(404).json({ message: "Perfil não encontrado." }); next(); } catch (e) { next(e); }
};
r.route("/").get(c.buscar).post(c.criar).put(c.atualizar).delete(c.excluir);
r.route("/:id").all(conferirId).get(c.buscar).put(c.atualizar).delete(c.excluir);
module.exports = r;
