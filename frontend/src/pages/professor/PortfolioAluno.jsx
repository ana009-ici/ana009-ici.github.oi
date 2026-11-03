import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../../components/Header";
import PortfolioView from "../../components/PortfolioView";
function Comentar({ shareId, tipo, item }) {
  const [txt, setTxt] = useState(""), [lista, setLista] = useState([]), [erro, setErro] = useState("");
  const carregar = () => api(`/professor/comentarios?registro_id=${item.id}`).then(setLista).catch(() => {});
  useEffect(() => { carregar(); }, []);
  async function enviar() { try { await api("/professor/comentarios", { method: "POST", body: { compartilhamento_id: shareId, registro_id: item.id, tipo_registro: tipo, conteudo: txt } }); setTxt(""); setErro(""); carregar(); } catch (e) { setErro(e.message); } }
  return (<div className="nao-imprimir"><hr />{lista.map((c) => <p key={c.id}>💬 {c.conteudo}</p>)}
    <textarea placeholder="Comentário sobre este registro" value={txt} onChange={(e) => setTxt(e.target.value)} />{erro && <p className="erro">{erro}</p>}<button className="btn" onClick={enviar}>Comentar</button></div>);
}
export default function PortfolioAluno() {
  const { id } = useParams(), [d, setD] = useState(null), [erro, setErro] = useState("");
  useEffect(() => { api(`/professor/alunos/${id}/portfolio`).then(setD).catch((e) => setErro(e.message)); }, [id]);
  if (!d) return <p>{erro || "Carregando…"}</p>;
  return (<div><Header titulo="Portfólio do aluno" voltar={<Link to="/professor/alunos">← Alunos</Link>} />
    <p><Link className="btn" to={`/professor/alunos/${id}/avaliacao`}>Registrar avaliação</Link></p>
    <p className="mudo">{d.entrega ? `Portfólio entregue em ${new Date(d.entrega.entregue_em).toLocaleString("pt-BR")}.` : "Portfólio ainda não entregue."}</p>
    <PortfolioView dados={d} acoes={(tipo, item) => <Comentar shareId={d.compartilhamento_id} tipo={tipo} item={item} />} /></div>);
}
