const { h } = require("./crudController");
const { crud } = require("./crudController");
const s = require("../services/senaiService");
module.exports = { unidades: crud(s.unidades), registros: crud(s.registros), projetos: { ...crud(s.projetos), criar: h(async (req, res) => {
    const projeto = await s.projetos.criar(req.usuario.id, req.body);
    res.status(201).json({ message: "Projeto cadastrado com sucesso no portfólio do SENAI.", projeto_id: projeto.id, projeto });
  }) }, evidencias: crud(s.evidencias) };
