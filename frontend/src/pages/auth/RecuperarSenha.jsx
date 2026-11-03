import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
export default function RecuperarSenha() {
  const { recuperar } = useAuth(), [email, setE] = useState(""), [msg, setMsg] = useState("");
  async function enviar(e) { e.preventDefault(); const { error } = await recuperar(email); setMsg(error ? error.message : "Se o e-mail existir, você receberá um link para redefinir a senha."); }
  return (<form onSubmit={enviar}><label>E-mail<input type="email" required value={email} onChange={(e) => setE(e.target.value)} /></label>
    {msg && <p>{msg}</p>}<p><button className="btn">Enviar link</button> <Link to="/login">Voltar</Link></p></form>);
}
