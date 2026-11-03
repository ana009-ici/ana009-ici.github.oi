import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
// Salva o que está sendo digitado no navegador, a cada pausa e ao sair da página, e restaura na volta.
// Retorna [valor, setValor, { limpar, regravar }, existiaRascunho]
export function useRascunho(chave, inicial) {
  const { session } = useAuth(), k = `rascunho:${session?.user?.id}:${chave}`;
  const [existe] = useState(() => { try { return localStorage.getItem(k) !== null; } catch { return false; } });
  const [v, setV] = useState(() => { const base = typeof inicial === "function" ? inicial() : inicial; try { const r = localStorage.getItem(k); return r ? { ...base, ...JSON.parse(r) } : base; } catch { return base; } });
  const primeira = useRef(true), sujo = useRef(false), limpo = useRef(false), ult = useRef(v);
  ult.current = v;
  const grava = () => { if (sujo.current && !limpo.current) try { localStorage.setItem(k, JSON.stringify(ult.current)); } catch {} };
  useEffect(() => { if (primeira.current) { primeira.current = false; return; } sujo.current = true; const t = setTimeout(grava, 400); return () => clearTimeout(t); }, [v]);
  useEffect(() => { window.addEventListener("pagehide", grava); return () => { window.removeEventListener("pagehide", grava); grava(); }; }, []);
  const limpar = () => { limpo.current = true; try { localStorage.removeItem(k); } catch {} };
  const regravar = () => { limpo.current = false; sujo.current = true; grava(); };
  return [v, setV, { limpar, regravar }, existe];
}
