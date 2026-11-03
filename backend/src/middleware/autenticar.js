const supabase = require("../config/supabase");
const { emailPermitido, bloqueado } = require("../config/dominio");
module.exports = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token não informado." });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ message: "Token inválido." });
    const u = data.user;
    let { data: usuario } = await supabase.from("usuarios").select("*").eq("id", u.id).maybeSingle();
    if (!usuario) {
      if (!emailPermitido(u.email)) return res.status(403).json({ message: "Use o e-mail @aluno para acessar." });
      ({ data: usuario } = await supabase.from("usuarios")
        .insert({ id: u.id, nome: u.user_metadata?.nome || u.email, email: u.email, tipo: "aluno" }).select().single());
    }
    if (bloqueado(usuario)) return res.status(403).json({ message: "Use o e-mail @aluno para acessar." });   // RN04
    req.usuario = usuario;
    next();
  } catch (e) { next(e); }
};
