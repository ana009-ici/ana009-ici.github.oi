import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, enviarArquivos } from "../services/api";
import { CFG } from "../config/campos";
import RegistroResumo from "./RegistroResumo";
import UploadEvidencia from "./UploadEvidencia";
import Anexo from "./Anexo";
export default function DetalheRegistro({ tipo }) {
  const { id } = useParams(), cfg = CFG[tipo], [item, setItem] = useState(null), [coment, setComent] = useState([]), [novos, setNovos] = useState([]), [erro, setErro] = useState("");
  const carregar = () => api(`${cfg.rota}/${id}`).then(setItem).catch((e) => setErro(e.message));
  useEffect(() => { carregar(); api(`/professor/comentarios?registro_id=${id}`).then(setComent).catch(() => {}); }, [id]);
  async function enviar() {
    try { for (const e of await enviarArquivos(novos)) await api(cfg.ev, { method: "POST", body: { ...e, [cfg.fk]: id } }); setNovos([]); carregar(); } catch (x) { setErro(x.message); }
  }
  async function anexar(lista) { try { for (const e of lista) await api(cfg.ev, { method: "POST", body: { ...e, [cfg.fk]: id } }); carregar(); } catch (x) { setErro(x.message); } }
  async function removerEv(evId) { try { await api(`${cfg.ev}/${evId}`, { method: "DELETE" }); carregar(); } catch (x) { setErro(x.message); } }
  if (!item) return <p>{erro || "Carregando…"}</p>;
  return (<div>
    <Link to={-1} onClick={(e) => { e.preventDefault(); history.back(); }}>← Voltar</Link>
    <RegistroResumo tipo={tipo} item={item} semEv />
    {cfg.ev && <div className="card"><h3>Evidências</h3>
      {item.ev.map((e) => <div className="linha" key={e.id}><Anexo ev={e} /><button className="btn sec" onClick={() => removerEv(e.id)}>Excluir</button></div>)}
      <UploadEvidencia arquivos={[]} onChange={anexar} /></div>}
    {erro && <p className="erro">{erro}</p>}
    {coment.length > 0 && <div className="card"><h3>Comentários do professor</h3>{coment.map((c) => <p key={c.id}>{c.conteudo}<br /><small className="mudo">{new Date(c.criado_em).toLocaleDateString("pt-BR")}</small></p>)}</div>}
  </div>);
}
