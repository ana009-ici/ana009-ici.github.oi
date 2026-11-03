import { Outlet } from "react-router-dom";
export default function AuthLayout() { return <div className="auth-page"><div className="auth"><h1>Portfólio Integrado</h1><p className="mudo" style={{ textAlign: "center" }}>Minha trajetória acadêmica: SESI + SENAI</p><Outlet /></div></div>; }
