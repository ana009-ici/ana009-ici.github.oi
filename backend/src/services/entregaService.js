const { supabase, erro, ok, portfolio } = require("./crud");
// "Entregar" a Avaliação de Portfólio. O prazo é opcional (PRAZO_ENTREGA no .env, ex.: 2025-11-29T23:59:00-03:00).
const prazo = () => process.env.PRAZO_ENTREGA || null;
module.exports = {
  async buscar(uid) {
    const p = await portfolio(uid);
    const e = ok(await supabase.from("entregas").select("*").eq("portfolio_id", p.id).maybeSingle());
    return { entregue_em: e?.entregue_em || null, prazo: prazo() };
  },
  async entregar(uid) {
    const p = await portfolio(uid);
    const { count } = await supabase.from("compartilhamentos").select("id", { count: "exact", head: true }).eq("portfolio_id", p.id).eq("ativo", true);
    if (!count) throw erro(400, "Compartilhe o portfólio com o professor (Configurações) antes de entregar.");
    const e = ok(await supabase.from("entregas").upsert({ portfolio_id: p.id, entregue_em: new Date() }, { onConflict: "portfolio_id" }).select().single());
    return { message: "Portfólio entregue com sucesso.", entregue_em: e.entregue_em, prazo: prazo() };
  },
};
