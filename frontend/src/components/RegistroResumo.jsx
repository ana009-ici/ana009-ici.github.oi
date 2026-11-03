import DOMPurify from "dompurify";
import { CFG } from "../config/campos";
import Anexo from "./Anexo";
export default function RegistroResumo({ tipo, item, semEv, acoes }) {
  return (<article className="doc">
    <h3>{item.titulo}</h3>
    {item.tags?.map((t) => <span className="chip" key={t}>{t}</span>)}
    <dl>{CFG[tipo].campos.filter(([k]) => k !== "titulo" && k !== "tags" && item[k]).map(([k, l, t]) => (
      <div key={k}><dt>{l}</dt>{t === "r" ? <dd dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item[k]) }} /> : <dd>{item[k]}</dd>}</div>))}</dl>
    {!semEv && item.ev?.length > 0 && <div><dt>Evidências</dt>{item.ev.map((e) => <Anexo key={e.id} ev={e} />)}</div>}
    {acoes && acoes(tipo, item)}
  </article>);
}
