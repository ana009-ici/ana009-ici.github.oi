const { supabase, erro, ok, portfolio } = require("./crud");
const { SECOES } = require("../config/secoes");
const EMB = { sesi: "*, ev:evidencias_paginas(*)", senai: "*", proj: "*, ev:evidencias_senai(*)" };
async function assinar(lista) {
  for (const i of lista || []) for (const e of i.ev || []) {
    const { data } = await supabase.storage.from("evidencias").createSignedUrl(e.arquivo_path, 3600);
    e.url = data?.signedUrl;
  }
  return lista;
}
module.exports = {
  // ----- compartilhamento (RN08) -----
  async compartilhar(aluno, { email_professor }) {
    if (!email_professor) throw erro(400, "Informe o e-mail do professor.");
    const prof = ok(await supabase.from("usuarios").select("id").eq("email", email_professor.trim().toLowerCase()).eq("tipo", "professor").maybeSingle());
    if (!prof) throw erro(404, "Professor não encontrado.");
    const p = await portfolio(aluno.id);
    return ok(await supabase.from("compartilhamentos").upsert({ portfolio_id: p.id, professor_id: prof.id, ativo: true }, { onConflict: "portfolio_id,professor_id" }).select().single());
  },
  async compartilhamentos(u) {
    if (u.tipo === "professor") return ok(await supabase.from("compartilhamentos").select("*").eq("professor_id", u.id));
    const p = await portfolio(u.id);
    return ok(await supabase.from("compartilhamentos").select("*, professor:usuarios!professor_id(nome,email)").eq("portfolio_id", p.id));
  },
  async revogar(aluno, id) {
    const p = await portfolio(aluno.id);
    const { data } = await supabase.from("compartilhamentos").update({ ativo: false }).eq("id", id).eq("portfolio_id", p.id).select();
    if (!data?.length) throw erro(404, "Compartilhamento não encontrado.");
  },
  // ----- visão do professor -----
  async alunos(prof) {
    return ok(await supabase.from("compartilhamentos").select("id, portfolio:portfolios!inner(id, ano_letivo, aluno:usuarios!aluno_id(id,nome,email), entrega:entregas(entregue_em))").eq("professor_id", prof.id).eq("ativo", true));
  },
  async portfolio(prof, alunoId) {
    const s = ok(await supabase.from("compartilhamentos").select("id, portfolio:portfolios!inner(id,aluno_id)").eq("professor_id", prof.id).eq("ativo", true).eq("portfolio.aluno_id", alunoId));
    if (!s.length) throw erro(403, "Portfólio não compartilhado com você.");
    const pid = s[0].portfolio.id;
    const [perfil, areas, unidades, sesi, senai, projetos, entrega] = await Promise.all([
      supabase.from("perfis_alunos").select("*").eq("usuario_id", alunoId).maybeSingle(),
      supabase.from("areas_conhecimento").select("*"), supabase.from("unidades_curriculares").select("*"),
      supabase.from("paginas_portfolio").select(EMB.sesi).eq("portfolio_id", pid),
      supabase.from("registros_senai").select(EMB.senai).eq("portfolio_id", pid),
      supabase.from("projetos_senai").select(EMB.proj).eq("portfolio_id", pid),
      supabase.from("entregas").select("entregue_em").eq("portfolio_id", pid).maybeSingle()]);
    return { compartilhamento_id: s[0].id, perfil: perfil.data, areas: areas.data, unidades: unidades.data, secoes: SECOES, paginas: await assinar(sesi.data), entrega: entrega.data || null, senai: senai.data, projetos: await assinar(projetos.data) };
  },
  // ----- comentários e avaliações (RN11: o professor nunca altera o registro) -----
  async ids(u) {
    if (u.tipo === "professor") return ok(await supabase.from("compartilhamentos").select("id").eq("professor_id", u.id)).map((x) => x.id);
    const p = await portfolio(u.id);
    return ok(await supabase.from("compartilhamentos").select("id").eq("portfolio_id", p.id)).map((x) => x.id);
  },
  async listar(tabela, u, q = {}) {
    let s = supabase.from(tabela).select("*").in("compartilhamento_id", await this.ids(u)).order("criado_em", { ascending: false });
    if (q.registro_id) s = s.eq("registro_id", q.registro_id);
    return ok(await s);
  },
  async registrar(tabela, prof, body, campos, obrigatorio) {
    if (!String(body[obrigatorio] || "").trim()) throw erro(400, `O campo ${obrigatorio} é obrigatório.`);
    const sh = ok(await supabase.from("compartilhamentos").select("id").eq("id", body.compartilhamento_id).eq("professor_id", prof.id).eq("ativo", true).maybeSingle());
    if (!sh) throw erro(403, "Sem autorização para este portfólio.");
    const d = { compartilhamento_id: sh.id, professor_id: prof.id };
    campos.forEach((c) => { d[c] = body[c]; });
    return ok(await supabase.from(tabela).insert(d).select().single());
  },
};
