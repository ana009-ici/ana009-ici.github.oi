import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/Header";
export default function Configuracoes() {
  const { sair } = useAuth(), [lista, setLista] = useState([]), [email, setEmail] = useState(""), [senha, setSenha] = useState(""), [msg, setMsg] = useState(null), [msgSenha, setMsgSenha] = useState(null);
  const carregar = () => api("/professor/compartilhamentos").then(setLista).catch((e) => setMsg({ erro: e.message }));
  useEffect(() => { carregar(); }, []);
  async function autorizar() {
    if (!email.trim()) return setMsg({ erro: "Informe o e-mail do professor." });
    try { await api("/professor/compartilhamentos", { method: "POST", body: { email_professor: email } }); setEmail(""); setMsg({ ok: "Professor autorizado e salvo." }); carregar(); } catch (e) { setMsg({ erro: e.message }); }
  }
  async function remover(id) { try { await api(`/professor/compartilhamentos/${id}`, { method: "DELETE" }); setMsg({ ok: "Autorização removida." }); carregar(); } catch (e) { setMsg({ erro: e.message }); } }
  async function trocarSenha() {
    if (senha.length < 6) return setMsgSenha({ erro: "Mínimo de 6 caracteres." });
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) setMsgSenha({ erro: error.message }); else { setSenha(""); setMsgSenha({ ok: "Senha atualizada." }); }
  }
  const aviso = (m) => m && <p className={m.erro ? "erro" : "ok"}>{m.erro || m.ok}</p>;
  const ativos = lista.filter((s) => s.ativo);
  return (<div><Header titulo="Configurações" subtitulo="Conta, segurança e compartilhamento" />
    <div className="card"><h3>Compartilhar com professor</h3><p className="mudo">O professor precisa ter conta no site com perfil de professor. Ele só vê o que você autorizar.</p>
      <label>E-mail do professor</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && autorizar()} />
      <p><button className="btn" onClick={autorizar}>Autorizar</button></p>{aviso(msg)}
      <h3>Professores autorizados</h3>
      {ativos.length === 0 && <p className="mudo">Nenhum professor autorizado ainda.</p>}
      {ativos.map((s) => <div className="linha" key={s.id}><div><b>{s.professor?.nome}</b><br /><small className="mudo">{s.professor?.email}</small></div><button className="btn sec" onClick={() => remover(s.id)}>Remover</button></div>)}</div>
    <div className="card"><h3>Alterar senha</h3><label>Nova senha</label><input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <p><button className="btn" onClick={trocarSenha}>Atualizar senha</button></p>{aviso(msgSenha)}</div>
    <button className="btn sec" onClick={sair}>Encerrar sessão</button></div>);
}
