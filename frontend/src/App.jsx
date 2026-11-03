import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import AlunoLayout from "./layouts/AlunoLayout";
import ProfessorLayout from "./layouts/ProfessorLayout";
import Login from "./pages/auth/Login";
import Cadastro from "./pages/auth/Cadastro";
import RecuperarSenha from "./pages/auth/RecuperarSenha";
import Inicio from "./pages/aluno/Inicio";
import Perfil from "./pages/aluno/Perfil";
import Progresso from "./pages/aluno/Progresso";
import VisualizarPortfolio from "./pages/aluno/VisualizarPortfolio";
import Configuracoes from "./pages/aluno/Configuracoes";
import Areas from "./pages/sesi/Areas";
import Secoes from "./pages/sesi/Secoes";
import Secao from "./pages/sesi/Secao";
import RegistroDetalhe from "./pages/sesi/RegistroDetalhe";
import Unidades from "./pages/senai/Unidades";
import RegistrosSENAI from "./pages/senai/Registros";
import Projetos from "./pages/senai/Projetos";
import ProjetoDetalhe from "./pages/senai/ProjetoDetalhe";
import Dashboard from "./pages/professor/Dashboard";
import Alunos from "./pages/professor/Alunos";
import PortfolioAluno from "./pages/professor/PortfolioAluno";
import Avaliacao from "./pages/professor/Avaliacao";

import PublicoLayout from "./layouts/PublicoLayout";
import PublicoInicio from "./pages/publico/Inicio";
import PublicoPerfil from "./pages/publico/QuemSouEu";
import PublicoSesi from "./pages/publico/Sesi";
import PublicoSenai from "./pages/publico/Senai";
import Midias from "./pages/aluno/Midias";

export default function App() {
  return (
    <Routes>
      <Route path="/publico" element={<PublicoLayout />}>
        <Route index element={<PublicoInicio />} />
        <Route path="quem-sou-eu" element={<PublicoPerfil />} />
        <Route path="sesi" element={<PublicoSesi />} />
        <Route path="senai" element={<PublicoSenai />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      </Route>
      <Route element={<ProtectedRoute tipo={["aluno", "administrador"]}><AlunoLayout /></ProtectedRoute>}>
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/progresso" element={<Progresso />} />
        <Route path="/portfolio" element={<VisualizarPortfolio />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/midias" element={<Midias />} />
        <Route path="/sesi" element={<Areas />} />
        <Route path="/sesi/:areaId" element={<Secoes />} />
        <Route path="/sesi/:areaId/:secao" element={<Secao />} />
        <Route path="/senai" element={<Unidades />} />
        <Route path="/senai/registro/:id" element={<RegistroDetalhe tipo="senai" />} />
        <Route path="/senai/projeto/:id" element={<ProjetoDetalhe />} />
        <Route path="/senai/:unidadeId" element={<RegistrosSENAI />} />
        <Route path="/senai/:unidadeId/projetos" element={<Projetos />} />
      </Route>
      <Route path="/professor" element={<ProtectedRoute tipo="professor"><ProfessorLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="alunos" element={<Alunos />} />
        <Route path="alunos/:id" element={<PortfolioAluno />} />
        <Route path="alunos/:id/avaliacao" element={<Avaliacao />} />
      </Route>
    </Routes>
  );
}
