import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../../components/Header";
export default function Alunos() {
  const [alunos, setAlunos] = useState([]), [q, setQ] = useState("");
  useEffect(() => { api("/professor/alunos").then(setAlunos).catch(() => {}); }, []);
  const lista = alunos.filter((s) => s.portfolio.aluno.nome.toLowerCase().includes(q.toLowerCase()));
  return (<div><Header titulo="Alunos autorizados" /><input placeholder="Pesquisar aluno" value={q} onChange={(e) => setQ(e.target.value)} />
    {lista.length === 0 && <p className="mudo">Nenhum aluno encontrado.</p>}
    {lista.map((s) => <div className="linha" key={s.id}><div><b>{s.portfolio.aluno.nome}</b><br /><small className="mudo">{s.portfolio.aluno.email} · {s.portfolio.ano_letivo} · {[].concat(s.portfolio.entrega || [])[0] ? `Entregue em ${new Date([].concat(s.portfolio.entrega)[0].entregue_em).toLocaleDateString("pt-BR")}` : "Não entregue"}</small></div>
      <div><Link className="btn" to={`/professor/alunos/${s.portfolio.aluno.id}`}>Abrir portfólio</Link> <Link className="btn sec" to={`/professor/alunos/${s.portfolio.aluno.id}/avaliacao`}>Avaliar</Link></div></div>)}</div>);
}
