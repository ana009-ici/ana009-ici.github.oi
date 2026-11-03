import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, LogOut, ShieldCheck, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
export default function Sidebar({ itens, loginAdmin, semSair }) {
  const { session, sair } = useAuth(), nav = useNavigate(), [aberto, setAberto] = useState(false);
  return (<>
    <button className="menu-btn btn sec" onClick={() => setAberto(!aberto)} aria-label="Menu"><Menu size={20} /></button>
    <aside className={"sidebar" + (aberto ? " aberto" : "")} onClick={() => setAberto(false)}>
      <div className="logo"><BookOpen size={46} strokeWidth={1.6} /><Sparkles size={16} style={{ verticalAlign: "top" }} /><b>Portfólio Integrado</b></div>
      {itens.map(([to, nome, Icone, end, sep]) => (<span key={to} style={{ display: "contents" }}>{sep && <hr />}<NavLink to={to} end={end}><Icone size={22} />{nome}</NavLink></span>))}
      {!semSair && <button className="item" onClick={sair}><LogOut size={22} />Sair</button>}
      {loginAdmin && <button className="item admin" onClick={() => nav(session ? "/" : "/login")}><ShieldCheck size={22} />{session ? "Painel do Administrador" : "Login do Administrador"}</button>}
    </aside>
  </>);
}
