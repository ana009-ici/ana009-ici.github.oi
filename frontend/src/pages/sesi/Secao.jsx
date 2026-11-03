import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useSecoes } from "../../hooks/useSecoes";
import { useRascunho } from "../../hooks/useRascunho";
import Header from "../../components/Header";
import UploadEvidencia from "../../components/UploadEvidencia";
import Anexo from "../../components/Anexo";

function FormPagina({ s, areaId, bimestre, pagina, prefill, comentarios, onMudou }) {
  const [est, setEst, acoes, restaurado] = useRascunho(`pagina:${areaId}:${s.id}:${bimestre || 0}`, () => ({ v: { ...prefill, ...(pagina?.conteudo || {}) }, arquivos: [] }));
  const [erro, setErro] = useState(""), [env, setEnv] = useState(false), [conf, setConf] = useState(false), [confEv, setConfEv] = useState(null);
  const set = (k) => (e) => setEst((x) => ({ ...x, v: { ...x.v, [k]: e.target.value } }));
  async function enviar(e) {
    e.preventDefault(); setErro(""); setEnv(true); acoes.limpar();
    try {
      let id = pagina?.id;
      if (id) await api(`/sesi/paginas/${id}`, { method: "PUT", body: { conteudo: est.v } });
      else id = (await api("/sesi/paginas", { method: "POST", body: { area_id: areaId, secao: s.id, bimestre, conteudo: est.v } })).id;
      for (const a of est.arquivos) await api("/sesi/pagina-evidencias", { method: "POST", body: { ...a, pagina_id: id } });
      onMudou("Página salva com sucesso.");
    } catch (x) { acoes.regravar(); setErro(x.message); setEnv(false); }
  }
  async function excluirPagina() { try { acoes.limpar(); await api(`/sesi/paginas/${pagina.id}`, { method: "DELETE" }); onMudou("Página excluída."); } catch (x) { setErro(x.message); setConf(false); } }
  async function excluirEv(id) { try { await api(`/sesi/pagina-evidencias/${id}`, { method: "DELETE" }); onMudou("Evidência excluída."); } catch (x) { setErro(x.message); setConfEv(null); } }
  return (<form className="card" onSubmit={enviar}>
    {restaurado && <p className="mudo">Rascunho restaurado automaticamente.</p>}
    {s.campos.map(([k, l, t, dica, obrig]) => (<div key={k}>
      {dica && <p className="mudo">{dica}</p>}<label>{l}{obrig ? " *" : ""}</label>
      {t === "a" ? <textarea value={est.v[k] || ""} onChange={set(k)} /> : <input type="text" required={!!obrig} value={est.v[k] || ""} onChange={set(k)} />}</div>))}
    {s.evidencias && <div><p className="mudo">Evidências visuais e materiais produzidos.</p>
      <UploadEvidencia arquivos={est.arquivos} onChange={(a) => setEst((x) => ({ ...x, arquivos: a }))} />
      {pagina?.ev?.map((e) => <p key={e.id}><Anexo ev={e} /> {confEv === e.id
        ? <><button type="button" className="btn perigo" onClick={() => excluirEv(e.id)}>Confirmar</button> <button type="button" className="btn sec" onClick={() => setConfEv(null)}>Cancelar</button></>
        : <button type="button" className="btn sec" onClick={() => setConfEv(e.id)}>Excluir</button>}</p>)}</div>}
    {comentarios.length > 0 && <div><hr />{comentarios.map((c) => <p key={c.id}>💬 {c.conteudo}</p>)}</div>}
    {erro && <p className="erro">{erro}</p>}
    <p><button className="btn" disabled={env}>{env ? "Salvando…" : "Salvar página"}</button>{" "}
      {pagina && (conf ? <><button type="button" className="btn perigo" onClick={excluirPagina}>Confirmar exclusão</button> <button type="button" className="btn sec" onClick={() => setConf(false)}>Cancelar</button></>
        : <button type="button" className="btn sec" onClick={() => setConf(true)}>Excluir página</button>)}</p>
  </form>);
}

export default function Secao() {
  const { areaId, secao } = useParams(), secoes = useSecoes(), [area, setArea] = useState(null), [pgs, setPgs] = useState(null), [perfil, setPerfil] = useState(undefined);
  const [bim, setBim] = useState(1), [msg, setMsg] = useState(""), [coment, setComent] = useState([]);
  const s = secoes?.find((x) => x.id === Number(secao));
  const carregar = () => api(`/sesi/paginas?area_id=${areaId}&secao=${secao}`).then(setPgs);
  useEffect(() => { setPgs(null); api(`/sesi/areas/${areaId}`).then(setArea); carregar(); if (Number(secao) === 1) api("/perfil-aluno").catch(() => null).then(setPerfil); else setPerfil(null); }, [areaId, secao]);
  const pagina = pgs?.find((p) => (s?.periodo === "anual" ? true : p.bimestre === bim));
  useEffect(() => { setComent([]); if (pagina) api(`/professor/comentarios?registro_id=${pagina.id}`).then(setComent).catch(() => {}); }, [pagina?.id]);
  if (!s || !area || !pgs || perfil === undefined) return <p>Carregando…</p>;
  const bimestral = s.periodo === "bimestral", b = bimestral ? bim : null;
  const prefill = perfil ? { nome: perfil.nome_completo, serie: perfil.serie, itinerario_formativo: perfil.itinerario_formativo, turma: perfil.turma } : {};
  const mudou = (m) => { setMsg(m); carregar(); };
  return (<div><Header titulo={`${s.id}. ${s.nome}`} subtitulo={`${area.nome} · ${bimestral ? "Seção bimestral: uma página por bimestre" : "Seção anual: uma única página"}`} voltar={<Link to={`/sesi/${areaId}`}>← Seções</Link>} />
    {bimestral && <p>{[1, 2, 3, 4].map((n) => <span key={n}><button className={n === bim ? "btn" : "btn sec"} onClick={() => { setBim(n); setMsg(""); }}>{n}º bimestre{pgs.some((p) => p.bimestre === n) ? " ✓" : ""}</button>{" "}</span>)}</p>}
    {msg && <p className="card">{msg}</p>}
    <FormPagina key={`${bimestral ? bim : 0}-${pagina?.id || "nova"}`} s={s} areaId={areaId} bimestre={b} pagina={pagina} prefill={prefill} comentarios={coment} onMudou={mudou} />
  </div>);
}
