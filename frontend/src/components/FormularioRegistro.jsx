import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import UploadEvidencia from "./UploadEvidencia";
import { useRascunho } from "../hooks/useRascunho";
export default function FormularioRegistro({ chave, campos, inicial = {}, comEvidencia, exigeEv, onSubmit, onCancel }) {
  const [est, setEst, acoes, restaurado] = useRascunho("reg:" + chave, () => {
    const o = { ...inicial };
    campos.forEach(([k, , t]) => { if (t === "g") o[k] = (inicial[k] || []).join(", "); if (t === "n" && o[k] == null) o[k] = new Date().getFullYear(); });
    return { v: o, arquivos: [] };
  });
  const v = est.v, arquivos = est.arquivos, [erro, setErro] = useState(""), [enviando, setEnviando] = useState(false);
  const setV = (u) => setEst((e) => ({ ...e, v: typeof u === "function" ? u(e.v) : u }));
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  async function enviar(e) {
    e.preventDefault(); setErro("");
    if (exigeEv && !arquivos.length && !inicial.ev?.length) return setErro("Anexe pelo menos uma evidência (RN03).");
    const dados = { ...v };
    campos.forEach(([k, , t]) => { if (t === "g") dados[k] = v[k].split(",").map((x) => x.trim()).filter(Boolean); if (t === "n") dados[k] = Number(v[k]); });
    setEnviando(true); acoes.limpar();
    try { await onSubmit(dados, arquivos); } catch (x) { acoes.regravar(); setErro(x.message); setEnviando(false); }
  }
  return (<form className="card" onSubmit={enviar}>
    {restaurado && <p className="mudo">Rascunho restaurado automaticamente.</p>}
    {campos.map(([k, l, t]) => t === "r"
      ? <div key={k}><label>{l}</label><RichTextEditor value={v[k]} onChange={(h) => setV((p) => ({ ...p, [k]: h }))} /></div>
      : t === "a"
        ? <div key={k}><label>{l}</label><textarea value={v[k] || ""} onChange={set(k)} /></div>
        : <div key={k}><label>{l}</label><input type={t === "d" ? "date" : t === "n" ? "number" : "text"} value={v[k] || ""} onChange={set(k)} /></div>)}
    {comEvidencia && <UploadEvidencia arquivos={arquivos} onChange={(a) => setEst((e) => ({ ...e, arquivos: a }))} />}
    {erro && <p className="erro">{erro}</p>}
    <p><button className="btn" disabled={enviando}>{enviando ? "Salvando…" : "Salvar"}</button> <button type="button" className="btn sec" onClick={() => { acoes.limpar(); onCancel(); }}>Cancelar</button></p>
  </form>);
}
