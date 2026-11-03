const supabase = require("../config/supabase");
const anon = require("../config/supabaseAnon");
const { bloqueado } = require("../config/dominio");
const ROLES = { aluno: "student", professor: "teacher", administrador: "admin" };
const erro = (status, message, details) => Object.assign(new Error(message), { status, details });
module.exports = {
  // POST /api/auth/login — encaminha a autenticação ao Supabase Auth (a senha nunca fica na nossa tabela)
  async login({ email, password, senha }) {
    password = password || senha;
    const det = [];
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) det.push({ field: "email", message: "Informe um e-mail válido." });
    if (!password) det.push({ field: "password", message: "A senha é obrigatória." });
    if (det.length) throw erro(400, "Dados inválidos", det);
    if (!process.env.SUPABASE_ANON_KEY) throw erro(500, "Servidor sem SUPABASE_ANON_KEY configurada.");
    const { data, error } = await anon().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.session) throw erro(401, "Credenciais inválidas: e-mail ou senha incorretos.");
    const u = data.user;
    let { data: usuario } = await supabase.from("usuarios").select("*").eq("id", u.id).maybeSingle();
    if (!usuario) ({ data: usuario } = await supabase.from("usuarios").insert({ id: u.id, nome: u.user_metadata?.nome || u.email, email: u.email, tipo: "aluno" }).select().single());
    if (bloqueado(usuario)) throw erro(403, "Use o e-mail @aluno para acessar.");   // RN04
    return { token: data.session.access_token, user: { id: usuario.id, name: usuario.nome, email: usuario.email, role: ROLES[usuario.tipo] } };
  },
};
