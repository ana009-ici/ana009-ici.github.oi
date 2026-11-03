const { supabase, erro, ok } = require("./crud");
const { SECOES } = require("../config/secoes");
// Portfólio público = o da conta definida em PORTFOLIO_PUBLICO_EMAIL. Somente leitura, sem login.
async function assinar(lista) {
  for (const i of lista || []) for (const e of i.ev || []) {
    const { data } = await supabase.storage.from("evidencias").createSignedUrl(e.arquivo_path, 3600);
    e.url = data?.signedUrl; delete e.arquivo_path;
  }
  return lista || [];
}
module.exports = {
  async portfolio() {
    const email = (process.env.PORTFOLIO_PUBLICO_EMAIL || "").trim().toLowerCase();
    if (!email) throw erro(404, "Portfólio público ainda não configurado.");
    const u = ok(await supabase.from("usuarios").select("id").eq("email", email).maybeSingle());
    if (!u) throw erro(404, "Portfólio público não encontrado.");
    const pf = ok(await supabase.from("portfolios").select("id, ano_letivo").eq("aluno_id", u.id).order("ano_letivo", { ascending: false }).limit(1).maybeSingle());
    const pid = pf?.id, vazio = Promise.resolve({ data: [] });
    const q = (t, emb) => (pid ? supabase.from(t).select(emb).eq("portfolio_id", pid) : vazio);
    const [perfil, areas, unidades, sesi, senai, projetos] = await Promise.all([
      supabase.from("perfis_alunos").select("*").eq("usuario_id", u.id).maybeSingle(),
      supabase.from("areas_conhecimento").select("*").eq("ativo", true), supabase.from("unidades_curriculares").select("*").eq("ativo", true),
      q("paginas_portfolio", "*, ev:evidencias_paginas(*)"), q("registros_senai", "*"), q("projetos_senai", "*, ev:evidencias_senai(*)")]);
    let p = perfil.data, foto;
    if (p?.foto_url) foto = (await supabase.storage.from("evidencias").createSignedUrl(p.foto_url, 3600)).data?.signedUrl;
    // só campos próprios para exibição pública (sem matrícula nem ids internos)
    p = p && { nome_completo: p.nome_completo, serie: p.serie, turma: p.turma, itinerario_formativo: p.itinerario_formativo, ano_letivo: p.ano_letivo, foto,
      expectativas_ano: p.expectativas_ano, objetivos_pessoais: p.objetivos_pessoais, objetivos_academicos: p.objetivos_academicos,
      objetivos_profissionais: p.objetivos_profissionais, expectativas_formacao: p.expectativas_formacao };
    return { ano_letivo: pf?.ano_letivo, perfil: p, areas: areas.data, unidades: unidades.data, secoes: SECOES, paginas: await assinar(sesi.data), senai: senai.data || [], projetos: await assinar(projetos.data) };
  },
};
