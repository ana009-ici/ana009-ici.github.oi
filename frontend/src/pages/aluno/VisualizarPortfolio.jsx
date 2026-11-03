import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../../components/Header";
import PortfolioView from "../../components/PortfolioView";
export default function VisualizarPortfolio() {
  const [d, setD] = useState(null), [ent, setEnt] = useState(null), [msg, setMsg] = useState("");
  useEffect(() => { Promise.all([api("/perfil-aluno").catch(() => null), api("/sesi/areas"), api("/senai/unidades"), api("/sesi/secoes"), api("/sesi/paginas"), api("/senai/registros"), api("/senai/projetos")])
    .then(([perfil, areas, unidades, secoes, paginas, senai, projetos]) => setD({ perfil, areas, unidades, secoes, paginas, senai, projetos })); api("/sesi/entrega").then(setEnt).catch(() => {}); }, []);
  async function entregar() { try { const r = await api("/sesi/entrega", { method: "POST" }); setMsg(r.message); setEnt({ entregue_em: r.entregue_em, prazo: r.prazo }); } catch (e) { setMsg(e.message); } }
  const fmt = (x) => new Date(x).toLocaleString("pt-BR");
  if (!d) return <p>Carregando…</p>;
  return (<div><Header titulo="Portfólio Integrado" subtitulo="Minha trajetória acadêmica: SESI + SENAI" />
    <p className="nao-imprimir"><button className="btn" onClick={() => window.print()}>Gerar PDF</button> <span className="mudo">Escolha “Salvar como PDF” na janela de impressão.</span></p>
    {ent && <div className="card nao-imprimir"><h3>Entrega do portfólio</h3>
      <p className="mudo">Antes de entregar, compartilhe o portfólio com o professor em <Link to="/configuracoes">Configurações</Link>.</p>
      <p>{ent.entregue_em ? `Entregue em ${fmt(ent.entregue_em)}.` : "Ainda não entregue."}{ent.prazo ? ` Prazo: ${fmt(ent.prazo)}.` : ""}</p>
      {msg && <p>{msg}</p>}<button className="btn" onClick={entregar}>{ent.entregue_em ? "Entregar novamente" : "Entregar"}</button></div>}
    <PortfolioView dados={d} /></div>);
}
