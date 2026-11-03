import { NavLink, Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import ListaRegistros from "../../components/ListaRegistros";
export default function Projetos() {
  const { unidadeId } = useParams();
  return (<div><Header titulo="Projetos e trabalhos" subtitulo="Entregas concretas, com relatório técnico e ao menos uma evidência (foto, vídeo ou arquivo)" voltar={<Link to="/senai">← Unidades</Link>} />
    <p className="abas"><NavLink className="btn sec" to={`/senai/${unidadeId}`} end>Registros</NavLink><NavLink className="btn" to={`/senai/${unidadeId}/projetos`}>Projetos e trabalhos</NavLink></p>
    <ListaRegistros tipo="projeto" filtro={{ unidade_id: unidadeId }} /></div>);
}
