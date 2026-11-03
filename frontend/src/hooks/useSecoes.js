import { useEffect, useState } from "react";
import { api } from "../services/api";
// As 7 seções do POP vêm da API (fonte única no backend). Guardadas em memória após a 1ª leitura.
let cache = null;
export function useSecoes() {
  const [s, setS] = useState(cache);
  useEffect(() => { if (!cache) api("/sesi/secoes").then((x) => { cache = x; setS(x); }).catch(() => {}); }, []);
  return s;
}
