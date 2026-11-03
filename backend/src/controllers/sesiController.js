const { crud, h } = require("./crudController");
const s = require("../services/sesiService");
const pg = require("../services/paginasService");
const e = require("../services/entregaService");
module.exports = {
  areas: crud(s.areas), registros: crud(s.registros), evidencias: crud(s.evidencias),
  paginas: crud(pg.paginas), paginasEv: crud(pg.evidencias),
  secoes: h(async (req, res) => res.json(await pg.secoes.listar())),
  entrega: h(async (req, res) => res.json(await e.buscar(req.usuario.id))),
  entregar: h(async (req, res) => res.status(201).json(await e.entregar(req.usuario.id))),
};
