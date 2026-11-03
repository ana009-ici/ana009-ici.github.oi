import { Outlet } from "react-router-dom";
import { Home, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TemaToggle from "../components/TemaToggle";
const ITENS = [["/professor", "Painel", Home, true], ["/professor/alunos", "Alunos autorizados", Users]];
export default function ProfessorLayout() { return <div className="layout"><Sidebar itens={ITENS} /><TemaToggle /><main className="conteudo"><Outlet /></main></div>; }
