const { h } = require("./crudController");
const s = require("../services/perfilService");
const saida = (p) => ({ ...p, nome: p.nome_completo, avatar_url: p.foto_url });   // nomes usados nos Passos 2 e 4
module.exports = {
  buscar: h(async (req, res) => res.json(saida(await s.buscar(req.usuario.id)))),
  criar: h(async (req, res) => res.status(201).json({ message: "Perfil cadastrado com sucesso.", mensagem: "Perfil cadastrado com sucesso!", perfil: saida(await s.criar(req.usuario.id, req.body)) })),
  atualizar: h(async (req, res) => res.json({ message: "Perfil atualizado com sucesso.", perfil: saida(await s.atualizar(req.usuario.id, req.body)) })),
  excluir: h(async (req, res) => { await s.excluir(req.usuario.id); res.status(204).end(); }),
};
