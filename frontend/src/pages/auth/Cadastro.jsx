import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
const DOM = (import.meta.env.VITE_DOMINIO_ALUNO || "").trim().toLowerCase().replace(/^@/, "");
const emailOk = (e) => { if (!DOM) return true; const d = e.trim().toLowerCase().split("@")[1] || ""; return d === DOM || d.startsWith(DOM + ".") || d.endsWith("." + DOM); };
export default function Cadastro() {
  const { cadastrar } = useAuth(), nav = useNavigate(), [f, setF] = useState({ nome: "", email: "", senha: "", conf: "", termos: false }), [erro, setErro] = useState(""), [ok, setOk] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  async function enviar(e) {
    e.preventDefault(); setErro("");
    if (!emailOk(f.email)) return setErro("Use o e-mail @aluno fornecido pela escola.");
    if (f.senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");
    if (f.senha !== f.conf) return setErro("As senhas não coincidem.");
    if (!f.termos) return setErro("Aceite os termos de utilização.");
    const { data, error } = await cadastrar(f.nome.trim(), f.email.trim(), f.senha);
    if (error) return setErro(error.message);
    data.session ? nav("/") : setOk(true);
  }
  if (ok) return <p>Conta criada! Confirme o e-mail enviado e depois <Link to="/login">entre</Link>.</p>;
  return (<form onSubmit={enviar}>
    <label>Nome completo<input required value={f.nome} onChange={set("nome")} /></label>
    <label>E-mail<input type="email" required value={f.email} onChange={set("email")} /></label>
    <label>Senha<input type="password" required value={f.senha} onChange={set("senha")} /></label>
    <label>Confirmação de senha<input type="password" required value={f.conf} onChange={set("conf")} /></label>
    <label className="inline"><input type="checkbox" checked={f.termos} onChange={set("termos")} /> Aceito os termos de utilização</label>
    {erro && <p className="erro">{erro}</p>}
    <p><button className="btn" style={{ width: "100%" }}>Cadastrar</button></p><p style={{ textAlign: "center" }}><Link to="/login">Já tenho conta</Link></p>
  </form>);
}
