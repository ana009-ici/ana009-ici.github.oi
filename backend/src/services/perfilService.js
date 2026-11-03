const { supabase, erro, ok } = require("./crud");
const modelo = require("../models/PerfilAluno");
const buscar = async (uid) => {
  const d = ok(await supabase.from("perfis_alunos").select("*").eq("usuario_id", uid).maybeSingle());
  if (!d) throw erro(404, "Perfil não encontrado.");
  return d;
};
module.exports = {
  buscar,
  async criar(uid, body) {
    const ex = ok(await supabase.from("perfis_alunos").select("id").eq("usuario_id", uid).maybeSingle());
    if (ex) throw erro(409, "O perfil já existe.");
    return ok(await supabase.from("perfis_alunos").insert({ ...modelo.validar(body), usuario_id: uid }).select().single());
  },
  async atualizar(uid, body) {
    await buscar(uid);
    return ok(await supabase.from("perfis_alunos").update({ ...modelo.validar(body), atualizado_em: new Date() }).eq("usuario_id", uid).select().single());
  },
  async excluir(uid) { await buscar(uid); ok(await supabase.from("perfis_alunos").delete().eq("usuario_id", uid)); },
};
