// Monta o CRUD padrão (GET, POST, PUT, DELETE) de um recurso
module.exports = (r, caminho, c, { leitura = true } = {}) => {
  r.route(caminho).get(c.listar).post(c.criar);
  if (c.atualizar) r.route(caminho + "/:id").get(c.buscar).put(c.atualizar).delete(c.excluir);
  else r.delete(caminho + "/:id", c.excluir);
};
