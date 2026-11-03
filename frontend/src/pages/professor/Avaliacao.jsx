import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import Header from "../../components/Header";
export default function Avaliacao() {
  const { id } = useParams(), [shareId, setShareId] = useState(null), [lista, setLista] = useState([]), [f, setF] = useState({ criterio: "", nota: "", observacao: "" }), [erro, setErro] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const carregar = (sid) => api("/professor/avaliacoes").then((l) => setLista(l.filter((a) => a.compartilhamento_id === sid)));
  useEffect(() => { api(`/professor/alunos/${id}/portfolio`).then((d) => { setShareId(d.compartilhamento_id); carregar(d.compartilhamento_id); }).catch((e) => setErro(e.message)); }, [id]);
  async function salvar(e) {
    e.preventDefault(); setErro("");
    try { await api("/professor/avaliacoes", { method: "POST", body: { compartilhamento_id: shareId, criterio: f.criterio, nota: f.nota === "" ? null : Number(f.nota), observacao: f.observacao } }); setF({ criterio: "", nota: "", observacao: "" }); carregar(shareId); } catch (x) { setErro(x.message); }
  }
  return (<div><Header titulo="Avaliação" subtitulo="A escala de notas ainda não foi definida; o campo nota é opcional." voltar={<Link to={`/professor/alunos/${id}`}>← Portfólio</Link>} />
    <form className="card" onSubmit={salvar}><label>Critério<input required value={f.criterio} onChange={set("criterio")} /></label><label>Nota (opcional)<input type="number" step="0.1" value={f.nota} onChange={set("nota")} /></label>
      <label>Observação<textarea value={f.observacao} onChange={set("observacao")} /></label>{erro && <p className="erro">{erro}</p>}<p><button className="btn">Registrar avaliação</button></p></form>
    <h3>Histórico de acompanhamento</h3>{lista.length === 0 && <p className="mudo">Nenhuma avaliação registrada.</p>}
    {lista.map((a) => <div className="card" key={a.id}><b>{a.criterio}</b> {a.nota != null && <span className="chip">Nota {a.nota}</span>}<p>{a.observacao}</p><small className="mudo">{new Date(a.criado_em).toLocaleDateString("pt-BR")}</small></div>)}</div>);
}
