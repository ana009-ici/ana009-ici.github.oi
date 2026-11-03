import Anexo from "./Anexo";
// Uma página do portfólio SESI (seção anual ou bimestral), com os campos definidos no POP
export default function PaginaResumo({ pagina, secoes, acoes }) {
  const s = secoes.find((x) => x.id === pagina.secao);
  if (!s) return null;
  return (<article className="doc">
    <h3>{s.id}. {s.nome}</h3>
    <span className="chip">{s.periodo === "anual" ? "Anual" : `${pagina.bimestre}º bimestre`}</span>
    <dl>{s.campos.filter(([k]) => pagina.conteudo?.[k]).map(([k, l]) => <div key={k}><dt>{l}</dt><dd>{pagina.conteudo[k]}</dd></div>)}</dl>
    {pagina.ev?.length > 0 && <div><dt>Evidências visuais</dt>{pagina.ev.map((e) => <Anexo key={e.id} ev={e} />)}</div>}
    {acoes && acoes("pagina", pagina)}
  </article>);
}
export const ordenar = (l) => [...l].sort((a, b) => a.secao - b.secao || (a.bimestre || 0) - (b.bimestre || 0));
