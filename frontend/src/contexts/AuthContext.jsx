import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { api } from "../services/api";
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null), [pronto, setPronto] = useState(false), [usuario, setUsuario] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setPronto(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!pronto) return;
    if (!session) { setUsuario(null); return; }
    setUsuario(undefined);
    api("/me").then(setUsuario).catch(() => setUsuario(null));
  }, [session?.user?.id, pronto]);
  const valor = {
    session, usuario, carregando: !pronto || (!!session && usuario === undefined),
    entrar: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    cadastrar: (nome, email, password) => supabase.auth.signUp({ email, password, options: { data: { nome } } }),
    recuperar: (email) => supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/login" }),
    sair: () => supabase.auth.signOut(),
  };
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
