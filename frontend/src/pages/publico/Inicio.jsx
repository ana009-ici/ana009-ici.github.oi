import { Link } from "react-router-dom";
import { GraduationCap, Users, Laptop, Calendar, Landmark } from "lucide-react";
import Vazio from "../../components/Vazio";
import { usePublico } from "../../hooks/usePublico";
import Anexo from "../../components/Anexo";
export default function PublicoInicio() {
  const { d, erro } = usePublico();
  if (erro) return <Vazio texto={erro} />;
  if (!d) return <p>Carregando…</p>;
  const p = d.perfil;
  return (<div>
    <section className="card hero">
      <p className="eyebrow">Portfólio Integrado · SESI + SENAI</p>
      {p ? <Anexo img ev={{ url: p.foto }} /> : <div className="avatar" />}
      {p ? <><h2>{p.nome_completo}</h2><div className="chips">
        <span className="chip"><GraduationCap size={16} />{p.serie}</span><span className="chip"><Users size={16} />Turma {p.turma}</span>
        <span className="chip"><Laptop size={16} />{p.itinerario_formativo}</span><span className="chip"><Calendar size={16} />{p.ano_letivo}</span></div></>
        : <p className="mudo">O estudante ainda não preencheu o perfil.</p>}
      <p className="mudo">Minha trajetória acadêmica{d.ano_letivo ? ` · ${d.ano_letivo}` : ""}</p>
      <div className="acoes"><Link className="btn" to="/publico/quem-sou-eu">Quem Sou Eu?</Link><Link className="btn sec" to="/publico/sesi">SESI</Link><Link className="btn sec" to="/publico/senai">SENAI</Link></div>
    </section>
    <div className="grid">
      <Link className="card" to="/publico/sesi"><div className="topo"><div className="ico"><Landmark size={30} /></div><h3>SESI</h3></div><p className="mudo">{d.paginas.length} página(s) nas áreas do conhecimento</p></Link>
      <Link className="card" to="/publico/senai"><div className="topo"><div className="ico"><Landmark size={30} /></div><h3>SENAI</h3></div><p className="mudo">{d.senai.length} registro(s) · {d.projetos.length} projeto(s)</p></Link></div>
  </div>);
}
