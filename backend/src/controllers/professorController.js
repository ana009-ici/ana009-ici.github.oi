const { h } = require("./crudController");
const s = require("../services/professorService");
module.exports = {
  alunos: h(async (req, res) => res.json(await s.alunos(req.usuario))),
  portfolio: h(async (req, res) => res.json(await s.portfolio(req.usuario, req.params.id))),
  compartilhamentos: h(async (req, res) => res.json(await s.compartilhamentos(req.usuario))),
  compartilhar: h(async (req, res) => res.status(201).json(await s.compartilhar(req.usuario, req.body))),
  revogar: h(async (req, res) => { await s.revogar(req.usuario, req.params.id); res.status(204).end(); }),
  listarComentarios: h(async (req, res) => res.json(await s.listar("comentarios", req.usuario, req.query))),
  comentar: h(async (req, res) => res.status(201).json(await s.registrar("comentarios", req.usuario, req.body, ["registro_id", "tipo_registro", "conteudo"], "conteudo"))),
  listarAvaliacoes: h(async (req, res) => res.json(await s.listar("avaliacoes", req.usuario, req.query))),
  avaliar: h(async (req, res) => res.status(201).json(await s.registrar("avaliacoes", req.usuario, req.body, ["criterio", "nota", "observacao"], "criterio"))),
};
