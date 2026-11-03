import { useState } from "react";
import { Calendar, FileText, Box } from "lucide-react";
import Vazio from "../../components/Vazio";
import { usePublico } from "../../hooks/usePublico";
import { iconeDe } from "../../components/icones";
import Header from "../../components/Header";
import RegistroResumo from "../../components/RegistroResumo";
export default function PublicoSenai() {
  const { d, erro } = usePublico(), [un, setUn] = useState(null);
  if (erro) return <Vazio texto={erro} />;
  if (!d) return <p>Carregando…</p>;
  if (!un) return (<div><Header titulo="SENAI" subtitulo="Unidades curriculares" /><div className="grid">
    {d.unidades.map((u) => { const I = iconeDe(u.nome, u.icone); return (<button className="card" key={u.id} onClick={() => setUn(u)}>
      <div className="topo"><div className="ico"><I size={30} /></div><h3>{u.nome}</h3></div><p className="mudo">{u.descricao}</p>
      <span className="chip"><Calendar size={15} />{u.ano}</span><span className="chip"><FileText size={15} />{d.senai.filter((r) => r.unidade_id === u.id).length} registro(s)</span>
      <span className="chip"><Box size={15} />{d.projetos.filter((r) => r.unidade_id === u.id).length} projeto(s)</span></button>); })}</div></div>);
  const rs = d.senai.filter((r) => r.unidade_id === un.id), ps = d.projetos.filter((r) => r.unidade_id === un.id);
  return (<div><button className="btn sec" onClick={() => setUn(null)}>← Unidades</button><Header titulo={un.nome} subtitulo={un.descricao} />
    {rs.length + ps.length === 0 && <p className="mudo">Nada publicado nesta unidade.</p>}
    {ps.length > 0 && <h3>Projetos e trabalhos</h3>}{ps.map((r) => <RegistroResumo key={r.id} tipo="projeto" item={r} />)}
    {rs.length > 0 && <h3>Registros</h3>}{rs.map((r) => <RegistroResumo key={r.id} tipo="senai" item={r} />)}</div>);
}
