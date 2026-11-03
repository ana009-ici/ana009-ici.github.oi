import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useSecoes } from "../../hooks/useSecoes";
import Header from "../../components/Header";
// As 7 seções do portfólio de uma área do conhecimento
export default function Secoes() {
  const { areaId } = useParams(), secoes = useSecoes(), [area, setArea] = useState(null), [pgs, setPgs] = useState([]);
  useEffect(() => { api(`/sesi/areas/${areaId}`).then(setArea); api(`/sesi/paginas?area_id=${areaId}`).then(setPgs); }, [areaId]);
  if (!area || !secoes) return <p>Carregando…</p>;
  return (<div><Header titulo={area.nome} subtitulo="Escolha a seção do portfólio" voltar={<Link to="/sesi">← Áreas</Link>} /><div className="grid" style={{ marginTop: 16 }}>
    {secoes.map((s) => { const total = s.periodo === "bimestral" ? 4 : 1, n = pgs.filter((p) => p.secao === s.id).length;
      return (<Link className="card" key={s.id} to={`/sesi/${areaId}/${s.id}`}><h3>{s.id}. {s.nome}</h3>
        <span className="chip">{s.periodo === "anual" ? "Anual" : "Bimestral"}</span><span className="chip">{n}/{total} página(s)</span></Link>); })}</div></div>);
}
