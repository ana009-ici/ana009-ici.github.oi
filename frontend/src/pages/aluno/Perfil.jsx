import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import Header from "../../components/Header";
export default function Perfil() {
  const { usuario } = useAuth(), [perfil, setPerfil] = useState(null);
  useEffect(() => { api("/perfil-aluno").then(setPerfil).catch(() => {}); }, []);
  return (<div><Header titulo="Meu perfil" subtitulo="Dados da conta" />
    <div className="card"><p><b>Nome:</b> {usuario.nome}<br /><b>E-mail:</b> {usuario.email}<br /><b>Tipo de conta:</b> {usuario.tipo}</p>
      {perfil ? <p><b>Perfil acadêmico:</b> {perfil.serie}, turma {perfil.turma}, {perfil.itinerario_formativo}</p> : <p className="mudo">Perfil acadêmico ainda não preenchido (veja “Quem Sou Eu?”).</p>}</div></div>);
}
