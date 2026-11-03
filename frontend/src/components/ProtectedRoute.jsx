import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function ProtectedRoute({ tipo, children }) {
  const { session, usuario, carregando } = useAuth(), { pathname } = useLocation();
  if (carregando) return <p style={{ padding: 24 }}>Carregando…</p>;
  if (!session || !usuario) return <Navigate to={pathname === "/" ? "/publico" : "/login"} replace />;   // visitante cai no painel público
  if (tipo && ![].concat(tipo).includes(usuario.tipo)) return <Navigate to={usuario.tipo === "professor" ? "/professor" : "/"} replace />;
  return children;
}
