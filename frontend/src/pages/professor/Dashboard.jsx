import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../../components/Header";
export default function Dashboard() {
  const [alunos, setAlunos] = useState([]);
  useEffect(() => { api("/professor/alunos").then(setAlunos).catch(() => {}); }, []);
  return (<div><Header titulo="Painel do professor" subtitulo="Acompanhamento dos portfólios autorizados" />
    <div className="card"><h2>{alunos.length}</h2><p>aluno(s) compartilharam o portfólio com você.</p><Link className="btn" to="/professor/alunos">Ver alunos</Link></div>
    <p className="mudo">Você pode visualizar, comentar e avaliar; os registros originais do aluno não podem ser alterados.</p></div>);
}
