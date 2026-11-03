import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
// Link (ou imagem) de uma evidência/arquivo privado; usa url já assinada quando vem da API do professor
export default function Anexo({ ev, img }) {
  const [url, setUrl] = useState(ev.url || "");
  useEffect(() => {
    if (ev.url || !ev.arquivo_path) return;
    supabase.storage.from("evidencias").createSignedUrl(ev.arquivo_path, 3600).then(({ data }) => setUrl(data?.signedUrl || ""));
  }, [ev.arquivo_path]);
  if (img) return url ? <img className="avatar" src={url} alt="Foto de perfil" /> : <div className="avatar" />;
  return <a className="chip" href={url} target="_blank" rel="noreferrer">📎 {ev.titulo}</a>;
}
