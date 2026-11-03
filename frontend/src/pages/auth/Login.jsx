import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
export default function Login() {
  const { entrar, sair, session, usuario } = useAuth(), [email, setE] = useState(""), [senha, setS] = useState(""), [ver, setV] = useState(false), [erro, setErro] = useState(""), [entrando, setEntrando] = useState(false);
  if (session && usuario) return <Navigate to="/" replace />;   // vai direto ao painel assim que o login termina
  async function enviar(e) {
    e.preventDefault(); setErro(""); setEntrando(true);
    const { error } = await entrar(email, senha);
    if (error) { setErro("E-mail ou senha incorretos."); setEntrando(false); }
  }
  if (session && usuario === null) return (<div><p className="erro">Login feito, mas o servidor (backend) não respondeu. Confira se ele está rodando e tente de novo.</p><button className="btn sec" style={{ width: "100%" }} onClick={sair}>Voltar</button></div>);
  return (<form onSubmit={enviar}>
    <label>E-mail<input type="email" required value={email} onChange={(e) => setE(e.target.value)} /></label>
    <label>Senha<input type={ver ? "text" : "password"} required value={senha} onChange={(e) => setS(e.target.value)} /></label>
    <label className="inline"><input type="checkbox" checked={ver} onChange={(e) => setV(e.target.checked)} /> Mostrar senha</label>
    {erro && <p className="erro">{erro}</p>}
    <p><button className="btn" style={{ width: "100%" }} disabled={entrando}>{entrando ? "Entrando…" : "Entrar"}</button></p>
    <p style={{ textAlign: "center" }}><Link to="/recuperar-senha">Esqueci minha senha</Link> · <Link to="/cadastro">Criar conta</Link> · <Link to="/publico">Ver portfólio</Link></p>
  </form>);
}
