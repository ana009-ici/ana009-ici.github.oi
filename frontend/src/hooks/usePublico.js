import { useEffect, useState } from "react";
import { apiPublica } from "../services/api";
// Sempre busca o dado mais recente: ao abrir, a cada 20 s e quando a aba volta ao foco
export function usePublico() {
  const [d, setD] = useState(null), [erro, setErro] = useState("");
  useEffect(() => {
    let vivo = true, carregado = false;
    const ler = () => apiPublica("/publico/portfolio").then((x) => { if (vivo) { carregado = true; setD(x); setErro(""); } }).catch((e) => { if (vivo && !carregado) setErro(e.message); });
    ler();
    const t = setInterval(ler, 20000), foco = () => document.visibilityState === "visible" && ler();
    document.addEventListener("visibilitychange", foco); window.addEventListener("focus", ler);
    return () => { vivo = false; clearInterval(t); document.removeEventListener("visibilitychange", foco); window.removeEventListener("focus", ler); };
  }, []);
  return { d, erro };
}
