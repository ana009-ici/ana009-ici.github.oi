import { useEffect, useState } from "react";
import { BarChart3, Landmark } from "lucide-react";
import { api } from "../../services/api";
import Header from "../../components/Header";
const Barra = ({ l, v, t }) => (<div><p style={{ display: "flex", justifyContent: "space-between", margin: "12px 0 6px" }}><span>{l}</span><b>{v}/{t}</b></p><div className="trilho"><i style={{ width: `${t ? Math.round((v / t) * 100) : 0}%` }} /></div></div>);
const Bloco = ({ titulo, icone: I, children }) => (<div className="card"><div className="topo"><div className="ico"><I size={28} /></div><h2 style={{ margin: 0 }}>{titulo}</h2></div>{children}</div>);
export default function Progresso() {
  const [d, setD] = useState(null);
  useEffect(() => { Promise.all([api("/sesi/areas"), api("/senai/unidades"), api("/sesi/paginas"), api("/sesi/secoes"), api("/senai/registros"), api("/senai/projetos"), api("/perfil-aluno").catch(() => null)])
    .then(([areas, unidades, sesi, secoes, senai, projetos, perfil]) => setD({ areas, unidades, sesi, secoes, senai, projetos, perfil })); }, []);
  if (!d) return <p>Carregando…</p>;
  const { areas, unidades, sesi, secoes, senai, projetos, perfil } = d, porArea = secoes.reduce((n, s) => n + (s.periodo === "bimestral" ? 4 : 1), 0), ev = (l) => l.reduce((n, r) => n + (r.ev?.length || 0), 0);
  const areasOk = areas.filter((a) => sesi.some((r) => r.area_id === a.id)).length;
  const uniOk = unidades.filter((u) => senai.some((r) => r.unidade_id === u.id) || projetos.some((r) => r.unidade_id === u.id)).length;
  return (<div><Header titulo="Meu progresso" subtitulo="SESI e SENAI acompanhados separadamente" icone={BarChart3} />
    <Bloco titulo="SESI" icone={Landmark}><Barra l="Áreas com páginas" v={areasOk} t={areas.length} /><Barra l="Páginas preenchidas" v={sesi.length} t={areas.length * porArea} />
      <p className="mudo">{sesi.length} página(s) · {ev(sesi)} evidência(s)</p></Bloco>
    <Bloco titulo="SENAI" icone={Landmark}><Barra l="Unidades com registros ou projetos" v={uniOk} t={unidades.length} />
      <p className="mudo">{senai.length} registro(s) · {projetos.length} projeto(s) · {ev(projetos)} evidência(s)</p></Bloco>
    <Bloco titulo="Visão geral" icone={BarChart3}><Barra l="Perfil preenchido" v={perfil ? 1 : 0} t={1} /><Barra l="Seções com conteúdo" v={areasOk + uniOk} t={areas.length + unidades.length} /></Bloco></div>);
}
