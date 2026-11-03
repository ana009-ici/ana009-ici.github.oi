import RegistroResumo from "./RegistroResumo";
import PaginaResumo, { ordenar } from "./PaginaResumo";
import Anexo from "./Anexo";
// Apresentação organizada do portfólio (aluno e professor)
export default function PortfolioView({ dados, acoes }) {
  const { perfil: p, areas, unidades, secoes = [], paginas = [], senai, projetos } = dados;
  return (<div>
    <section className="doc">
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>{p?.foto_url && <Anexo img ev={{ arquivo_path: p.foto_url }} />}
        <div><h2>{p?.nome_completo || "Aluno"}</h2>{p && <p>{p.serie} · Turma {p.turma} · {p.itinerario_formativo} · {p.ano_letivo}</p>}</div></div>
      {p && [["Expectativas para o ano","expectativas_ano"],["Objetivos pessoais","objetivos_pessoais"],["Objetivos acadêmicos","objetivos_academicos"],["Objetivos profissionais","objetivos_profissionais"],["Expectativas para a formação","expectativas_formacao"]].filter(([,k])=>p[k]).map(([l,k])=><p key={k}><b>{l}:</b> {p[k]}</p>)}
    </section>
    <h2>SESI</h2>
    {areas.map((a) => { const rs = ordenar(paginas.filter((r) => r.area_id === a.id)); return rs.length > 0 && (<div key={a.id}><h3>{a.nome}</h3>
      {rs.map((r) => <PaginaResumo key={r.id} pagina={r} secoes={secoes} acoes={acoes} />)}</div>); })}
    {paginas.length === 0 && <p className="mudo">Sem páginas do SESI.</p>}
    <h2>SENAI</h2>
    {unidades.map((u) => { const a = senai.filter((r) => r.unidade_id === u.id), b = projetos.filter((r) => r.unidade_id === u.id); return (a.length > 0 || b.length > 0) && (<div key={u.id}><h3>{u.nome}</h3>
      {a.map((r) => <RegistroResumo key={r.id} tipo="senai" item={r} acoes={acoes} />)}{b.map((r) => <RegistroResumo key={r.id} tipo="projeto" item={r} acoes={acoes} />)}</div>); })}
    {senai.length + projetos.length === 0 && <p className="mudo">Sem registros do SENAI.</p>}
  </div>);
}
