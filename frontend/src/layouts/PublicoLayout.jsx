import { Outlet } from "react-router-dom";
import { Home, UserCircle, Landmark } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TemaToggle from "../components/TemaToggle";
const ITENS = [["/publico", "Início", Home, true], ["/publico/quem-sou-eu", "Quem Sou Eu?", UserCircle], ["/publico/sesi", "SESI", Landmark], ["/publico/senai", "SENAI", Landmark]];
export default function PublicoLayout() { return <div className="layout"><Sidebar itens={ITENS} loginAdmin semSair /><TemaToggle /><main className="conteudo"><Outlet /></main></div>; }
