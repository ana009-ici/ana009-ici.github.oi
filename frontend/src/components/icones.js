import { FlaskConical, Globe, BookOpen, Calculator, Database, Code2, Laptop, Monitor, Landmark, Atom, Palette, Cpu, Wrench } from "lucide-react";
// Ícones disponíveis no site (os mesmos usados nos cards de áreas e unidades)
export const ICONES = { flask: FlaskConical, globe: Globe, livro: BookOpen, calculadora: Calculator, banco: Database, codigo: Code2, notebook: Laptop, monitor: Monitor, predio: Landmark, atomo: Atom, arte: Palette, chip: Cpu, ferramenta: Wrench };
const MAPA = [["natureza", FlaskConical], ["humanas", Globe], ["linguagens", BookOpen], ["matem", Calculator], ["banco", Database], ["web", Code2], ["fundamentos", Laptop], ["programa", Monitor]];
export const iconeDe = (nome = "", chave) => ICONES[chave] || (MAPA.find(([k]) => nome.toLowerCase().includes(k)) || [0, Landmark])[1];
