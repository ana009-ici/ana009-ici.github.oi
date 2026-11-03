import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
export default function TemaToggle() {
  const [tema, setTema] = useState(() => localStorage.getItem("tema") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  useEffect(() => { document.documentElement.dataset.theme = tema; localStorage.setItem("tema", tema); }, [tema]);
  return (<div className="tema nao-imprimir"><Sun size={18} /><button aria-label="Alternar tema" onClick={() => setTema(tema === "dark" ? "light" : "dark")}><i /></button><Moon size={18} /></div>);
}
