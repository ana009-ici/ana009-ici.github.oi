import { Outlet } from "react-router-dom";
import { Home, Landmark, BarChart3, FolderOpen, UserCircle, Settings, Images, Globe } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TemaToggle from "../components/TemaToggle";
const ITENS = [["/", "Início — Quem Sou Eu?", Home, true], ["/sesi", "SESI", Landmark], ["/senai", "SENAI", Landmark], ["/midias", "Mídias", Images],
  ["/progresso", "Meu progresso", BarChart3, false, true], ["/portfolio", "Visualizar portfólio", FolderOpen], ["/publico", "Ver portfólio público", Globe], ["/perfil", "Meu perfil", UserCircle], ["/configuracoes", "Configurações", Settings]];
export default function AlunoLayout() { return <div className="layout"><Sidebar itens={ITENS} /><TemaToggle /><main className="conteudo"><Outlet /></main></div>; }
