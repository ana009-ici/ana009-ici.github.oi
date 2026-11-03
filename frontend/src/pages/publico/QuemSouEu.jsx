import { GraduationCap, Users, Laptop, Calendar, ClipboardList } from "lucide-react";
import Vazio from "../../components/Vazio";
import { usePublico } from "../../hooks/usePublico";
import { REFL } from "../../config/reflexao";
import Header from "../../components/Header";
import Anexo from "../../components/Anexo";
export default function PublicoPerfil() {
  const { d, erro } = usePublico();
  if (erro) return <Vazio texto={erro} />;
  if (!d) return <p>Carregando…</p>;
  const p = d.perfil;
  if (!p) return <div><Header titulo="Quem Sou Eu?" /><p className="mudo">Perfil ainda não preenchido.</p></div>;
  return (<div><Header titulo="Quem Sou Eu?" subtitulo="Identificação e reflexão pessoal" />
    <div className="card perfil-topo"><div className="foto-wrap"><Anexo img ev={{ url: p.foto }} /></div>
      <div><h2>{p.nome_completo}</h2><span className="chip"><GraduationCap size={16} />{p.serie}</span><span className="chip"><Users size={16} />Turma {p.turma}</span>
        <span className="chip"><Laptop size={16} />{p.itinerario_formativo}</span><span className="chip"><Calendar size={16} />{p.ano_letivo}</span></div></div>
    <div className="card"><span className="secao"><ClipboardList size={22} />Reflexão pessoal</span>
      {REFL.map(([k, l, I]) => <div className="reflexao" key={k}><I size={26} /><div><b>{l}</b><span className="mudo">{p[k] || "—"}</span></div></div>)}</div></div>);
}
