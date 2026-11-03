const { supabase, ok, portfolio, fabrica, evidencias, catalogo } = require("./crud");
const ev = evidencias("evidencias_sesi", "registros_sesi", "registro_id");
const listarDoRegistro = ev.listar.bind(ev);
// GET /api/sesi/evidencias sem filtro: todas as evidências do aluno autenticado (Passo 4, RF05)
ev.listar = async (uid, q = {}) => {
  if (q.registro_id) return listarDoRegistro(uid, q);
  const p = await portfolio(uid);
  const [antigas, novas] = [
    ok(await supabase.from("evidencias_sesi").select("*, registro:registros_sesi!inner(portfolio_id, area:areas_conhecimento(nome))").eq("registro.portfolio_id", p.id)),
    ok(await supabase.from("evidencias_paginas").select("*, registro:paginas_portfolio!inner(portfolio_id, area:areas_conhecimento(nome))").eq("registro.portfolio_id", p.id))];
  const linhas = [...antigas, ...novas].sort((x, y) => new Date(y.data_postagem) - new Date(x.data_postagem));
  return Promise.all(linhas.map(async (e) => ({
    id: e.id, titulo: e.titulo, area_conhecimento: e.registro.area?.nome, descricao: e.descricao, data_postagem: e.data_postagem,
    arquivo_url: (await supabase.storage.from("evidencias").createSignedUrl(e.arquivo_path, 3600)).data?.signedUrl,
  })));
};
module.exports = {
  areas: catalogo("areas_conhecimento", ["nome", "descricao", "icone"]),
  registros: fabrica({ table: "registros_sesi", embed: "*, ev:evidencias_sesi(*)", filtros: ["area_id", "bimestre"], modelo: require("../models/RegistroSESI") }),
  evidencias: ev,
};
