const h = (fn) => async (req, res, next) => { try { await fn(req, res); } catch (e) { next(e); } };
const crud = (s) => ({
  listar: h(async (req, res) => res.json(await s.listar(req.usuario.id, req.query))),
  buscar: h(async (req, res) => res.json(await s.buscar(req.usuario.id, req.params.id))),
  criar: h(async (req, res) => res.status(201).json(await s.criar(req.usuario.id, req.body))),
  atualizar: h(async (req, res) => res.json(await s.atualizar(req.usuario.id, req.params.id, req.body))),
  excluir: h(async (req, res) => { await s.excluir(req.usuario.id, req.params.id); res.status(204).end(); }),
});
module.exports = { h, crud };
