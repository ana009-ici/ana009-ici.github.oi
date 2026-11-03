import { useState } from "react";
import Vazio from "../../components/Vazio";
import { usePublico } from "../../hooks/usePublico";
import { iconeDe } from "../../components/icones";
import Header from "../../components/Header";
import PaginaResumo, { ordenar } from "../../components/PaginaResumo";
export default function PublicoSesi() {
  const { d, erro } = usePublico(), [area, setArea] = useState(null);
  if (erro) return <Vazio texto={erro} />;
  if (!d) return <p>Carregando…</p>;
  if (!area) return (<div><Header titulo="SESI" subtitulo="Áreas do conhecimento" /><div className="grid">
    {d.areas.map((a) => { const I = iconeDe(a.nome, a.icone); return (<button className="card" key={a.id} onClick={() => setArea(a)}>
      <div className="topo"><div className="ico"><I size={30} /></div><h3>{a.nome}</h3></div><p className="mudo">{a.descricao}</p>
      <span className="chip">{d.paginas.filter((r) => r.area_id === a.id).length} página(s)</span></button>); })}</div></div>);
  const rs = ordenar(d.paginas.filter((r) => r.area_id === area.id));
  return (<div><button className="btn sec" onClick={() => setArea(null)}>← Áreas</button><Header titulo={area.nome} subtitulo={area.descricao} />
    {rs.length === 0 && <p className="mudo">Nenhuma página publicada nesta área.</p>}
    {rs.map((r) => <PaginaResumo key={r.id} pagina={r} secoes={d.secoes} />)}</div>);
}
