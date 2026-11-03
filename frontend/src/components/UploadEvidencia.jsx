import { useState } from "react";
import { supabase } from "../services/supabase";
import { enviarArquivos } from "../services/api";
// O arquivo é enviado assim que escolhido (fica guardado mesmo se você sair da página)
export default function UploadEvidencia({ arquivos, onChange }) {
  const [env, setEnv] = useState(false), [erro, setErro] = useState("");
  async function escolher(e) {
    const fs = [...e.target.files]; e.target.value = ""; setEnv(true); setErro("");
    try { onChange([...arquivos, ...(await enviarArquivos(fs))]); } catch (x) { setErro(x.message); }
    setEnv(false);
  }
  const remover = (a, i) => { supabase.storage.from("evidencias").remove([a.arquivo_path]); onChange(arquivos.filter((_, j) => j !== i)); };
  return (<div>
    <label>Evidências (imagens, vídeos, PDF, documentos)</label>
    <input type="file" multiple disabled={env} accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" onChange={escolher} />
    {env && <p className="mudo">Enviando arquivo…</p>}{erro && <p className="erro">{erro}</p>}
    {arquivos.map((a, i) => <span className="chip" key={a.arquivo_path}>{a.titulo} <button type="button" onClick={() => remover(a, i)}>×</button></span>)}
  </div>);
}
