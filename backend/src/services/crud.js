const supabase = require("../config/supabase");
const erro = (status, message) => Object.assign(new Error(message), { status });
const ok = (r) => { if (r.error) throw erro(500, r.error.message); return r.data; };

// Portfólio do aluno no ano letivo (RN06 e RN10)
async function portfolio(uid, ano = new Date().getFullYear()) {
  const ex = ok(await supabase.from("portfolios").select("*").eq("aluno_id", uid).eq("ano_letivo", ano).maybeSingle());
  if (ex) return ex;
  return ok(await supabase.from("portfolios").insert({ aluno_id: uid, ano_letivo: ano }).select().single());
}

// CRUD dos registros do aluno; sempre filtra pelo portfólio dele (RN07 e RN13)
const fabrica = ({ table, embed = "*", filtros = [], modelo }) => ({
  async listar(uid, q = {}) {
    const p = await portfolio(uid);
    let s = supabase.from(table).select(embed).eq("portfolio_id", p.id).order("criado_em", { ascending: false });
    filtros.forEach((f) => { if (q[f]) s = s.eq(f, q[f]); });
    return ok(await s);
  },
  async buscar(uid, id) {
    const p = await portfolio(uid);
    const d = ok(await supabase.from(table).select(embed).eq("id", id).eq("portfolio_id", p.id).maybeSingle());
    if (!d) throw erro(404, "Registro não encontrado.");
    return d;
  },
  async criar(uid, body) {
    const p = await portfolio(uid);
    return ok(await supabase.from(table).insert({ ...modelo.validar(body), portfolio_id: p.id }).select().single());
  },
  async atualizar(uid, id, body) {
    await this.buscar(uid, id);
    return ok(await supabase.from(table).update({ ...modelo.validar(body), atualizado_em: new Date() }).eq("id", id).select().single());
  },
  async excluir(uid, id) {
    await this.buscar(uid, id);
    ok(await supabase.from(table).delete().eq("id", id));
  },
});

// Evidências: o pai precisa pertencer ao aluno e o arquivo precisa estar na pasta dele no Storage (RN12)
const evidencias = (table, pai, fk) => ({
  async checarPai(uid, id) {
    const p = await portfolio(uid);
    const d = ok(await supabase.from(pai).select("id").eq("id", id).eq("portfolio_id", p.id).maybeSingle());
    if (!d) throw erro(404, "Registro não encontrado.");
  },
  async listar(uid, q) { await this.checarPai(uid, q[fk]); return ok(await supabase.from(table).select("*").eq(fk, q[fk])); },
  async criar(uid, b) {
    await this.checarPai(uid, b[fk]);
    if (!b.titulo || !b.arquivo_path) throw erro(400, "Título e arquivo são obrigatórios.");
    if (!b.arquivo_path.startsWith(uid + "/")) throw erro(403, "Arquivo fora da sua pasta.");
    return ok(await supabase.from(table).insert({ [fk]: b[fk], titulo: b.titulo, descricao: b.descricao, arquivo_path: b.arquivo_path, tipo_arquivo: b.tipo_arquivo }).select().single());
  },
  async excluir(uid, id) {
    const ev = ok(await supabase.from(table).select("*").eq("id", id).maybeSingle());
    if (!ev) throw erro(404, "Evidência não encontrada.");
    await this.checarPai(uid, ev[fk]);
    if (table === "evidencias_senai") { // RN03: o projeto mantém ao menos uma evidência
      const { count } = await supabase.from(table).select("id", { count: "exact", head: true }).eq(fk, ev[fk]);
      if (count <= 1) throw erro(400, "O projeto precisa manter pelo menos uma evidência.");
    }
    await supabase.storage.from("evidencias").remove([ev.arquivo_path]);
    ok(await supabase.from(table).delete().eq("id", id));
  },
});

// Áreas (SESI) e unidades (SENAI): lidas por todos os alunos, alteradas só pelo administrador (rotas com soAdmin)
const catalogo = (table, campos = ["nome", "descricao"]) => {
  const dados = (body = {}) => {
    const d = {};
    campos.forEach((c) => { if (body[c] !== undefined) d[c] = typeof body[c] === "string" ? body[c].trim() : body[c]; });
    if (!d.nome) throw Object.assign(erro(400, "Dados inválidos"), { details: [{ field: "nome", message: "O título é obrigatório." }] });
    return d;
  };
  return {
    async listar() { return ok(await supabase.from(table).select("*").eq("ativo", true).order("nome")); },
    async buscar(_uid, id) { const d = ok(await supabase.from(table).select("*").eq("id", id).maybeSingle()); if (!d) throw erro(404, "Não encontrado."); return d; },
    async criar(_uid, body) { return ok(await supabase.from(table).insert(dados(body)).select().single()); },
    async atualizar(_uid, id, body) { await this.buscar(null, id); return ok(await supabase.from(table).update(dados(body)).eq("id", id).select().single()); },
    async excluir(_uid, id) {
      await this.buscar(null, id);
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error.code === "23503" ? erro(409, "Não é possível excluir: existem registros vinculados. Exclua os registros antes.") : erro(500, error.message);
    },
  };
};
module.exports = { supabase, erro, ok, portfolio, fabrica, evidencias, catalogo };
