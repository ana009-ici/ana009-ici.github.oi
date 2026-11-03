import { NavLink, Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import ListaRegistros from "../../components/ListaRegistros";
export default function Registros() {
  const { unidadeId } = useParams();
  return (<div><Header titulo="Registros da unidade" subtitulo="Registros: anotações do que você estudou e fez nas aulas desta unidade" voltar={<Link to="/senai">← Unidades</Link>} />
    <p className="abas"><NavLink className="btn" to={`/senai/${unidadeId}`} end>Registros</NavLink><NavLink className="btn sec" to={`/senai/${unidadeId}/projetos`}>Projetos e trabalhos</NavLink></p>
    <ListaRegistros tipo="senai" filtro={{ unidade_id: unidadeId }} /></div>);
}
