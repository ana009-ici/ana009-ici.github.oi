const { supabase, erro, ok, portfolio, evidencias } = require("./crud");
const modelo = require("../models/PaginaPortfolio");
const { SECOES } = require("../config/secoes");
const EMB = "*, ev:evidencias_paginas(*)";
async function buscarDoAluno(uid, id) {
  const p = await portfolio(uid);
  const d = ok(await supabase.from("paginas_portfolio").select(EMB).eq("id", id).eq("portfolio_id", p.id).maybeSingle());
  if (!d) throw erro(404, "Página não encontrada.");
  return d;
}
const paginas = {
  async listar(uid, q = {}) {
    const p = await portfolio(uid);
    let s = supabase.from("paginas_portfolio").select(EMB).eq("portfolio_id", p.id).order("secao").order("bimestre");
    ["area_id", "secao", "bimestre"].forEach((f) => { if (q[f]) s = s.eq(f, q[f]); });
    return ok(await s);
  },
  buscar: buscarDoAluno,
  async criar(uid, body) {
    const d = modelo.validar(body), p = await portfolio(uid);
    let s = supabase.from("paginas_portfolio").select("id").eq("portfolio_id", p.id).eq("area_id", d.area_id).eq("secao", d.secao);
    s = d.bimestre ? s.eq("bimestre", d.bimestre) : s.is("bimestre", null);
    if (ok(await s.maybeSingle())) throw erro(409, d.bimestre ? "Já existe a página deste bimestre. Edite a existente." : "Esta seção anual já tem sua única página. Edite a existente.");
    return ok(await supabase.from("paginas_portfolio").insert({ ...d, portfolio_id: p.id }).select().single());
  },
  async atualizar(uid, id, body) {
    const atual = await buscarDoAluno(uid, id);
    const d = modelo.validar({ ...body, _secao: atual.secao }, true);
    return ok(await supabase.from("paginas_portfolio").update({ conteudo: d.conteudo, atualizado_em: new Date() }).eq("id", id).select().single());
  },
  async excluir(uid, id) { await buscarDoAluno(uid, id); ok(await supabase.from("paginas_portfolio").delete().eq("id", id)); },
};
const secoes = { async listar() { return SECOES; } };
module.exports = { paginas, secoes, evidencias: evidencias("evidencias_paginas", "paginas_portfolio", "pagina_id") };
