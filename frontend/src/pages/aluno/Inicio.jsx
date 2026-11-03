import { useEffect, useState } from "react";
import { Star, Target, GraduationCap, Briefcase, Heart, Pencil, Trash2, Users, Laptop, Calendar, ClipboardList } from "lucide-react";
import { useRascunho } from "../../hooks/useRascunho";
import { api } from "../../services/api";
import { supabase } from "../../services/supabase";
import Header from "../../components/Header";
import Anexo from "../../components/Anexo";
const IDENT = [["nome_completo","Nome"],["serie","Série"],["turma","Turma"],["itinerario_formativo","Itinerário formativo"],["ano_letivo","Ano letivo","number"]];
const REFL = [["expectativas_ano","Expectativas para o ano",Star],["objetivos_pessoais","Objetivos pessoais",Target],["objetivos_academicos","Objetivos acadêmicos",GraduationCap],["objetivos_profissionais","Objetivos profissionais",Briefcase],["expectativas_formacao","Expectativas em relação à formação",Heart]];
const novaFoto = async (file) => {
  const { data } = await supabase.auth.getUser(), path = `${data.user.id}/foto-${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("evidencias").upload(path, file);
  if (error) throw error; return path;
};
export default function Inicio() {
  const [f, setF, rasc, restaurado] = useRascunho("perfil", { ano_letivo: new Date().getFullYear() });
  const [perfil, setPerfil] = useState(undefined), [edit, setEdit] = useState(restaurado), [msg, setMsg] = useState(""), [erro, setErro] = useState(""), [conf, setConf] = useState(false);
  useEffect(() => { api("/perfil-aluno").then(setPerfil).catch(() => setPerfil(null)); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function salvar(e) {
    e.preventDefault(); setErro("");
    try { const hab = typeof f.habilidades === "string" ? f.habilidades.split(",").map((x) => x.trim()).filter(Boolean) : (f.habilidades || []); const r = await api("/perfil-aluno", { method: perfil ? "PUT" : "POST", body: { ...f, habilidades: hab, ano_letivo: Number(f.ano_letivo) } }); rasc.limpar(); setPerfil(r.perfil); setMsg(r.message); setEdit(false); } catch (x) { setErro(x.message); }
  }
  async function foto(e) { const file = e.target.files[0]; if (file) try { setF({ ...f, foto_url: await novaFoto(file) }); } catch (x) { setErro(x.message); } }
  async function trocarFoto(e) {
    const file = e.target.files[0]; if (!file) return;
    try { const r = await api("/perfil-aluno", { method: "PUT", body: { ...perfil, foto_url: await novaFoto(file) } }); setPerfil(r.perfil); setMsg(r.message); } catch (x) { setErro(x.message); }
  }
  async function excluir() { await api("/perfil-aluno", { method: "DELETE" }); setPerfil(null); setF({ ano_letivo: new Date().getFullYear() }); setConf(false); }
  if (perfil === undefined) return <p>Carregando…</p>;
  if (!perfil || edit) return (<form onSubmit={salvar}><Header titulo="Quem Sou Eu?" subtitulo="Identificação e reflexão pessoal" />
    {restaurado && <p className="mudo">Rascunho restaurado automaticamente.</p>}
    <div className="card"><h3>Identificação</h3><div className="f2">
      {IDENT.map(([k, l, t]) => <div key={k}><label>{l}</label><input required type={t || "text"} value={f[k] || ""} onChange={set(k)} /></div>)}
      {[["matricula","Matrícula (opcional)"],["unidade","Unidade (opcional)"],["curso","Curso (opcional)"]].map(([k, l]) => <div key={k}><label>{l}</label><input value={f[k] || ""} onChange={set(k)} /></div>)}
      <div><label>Habilidades (separadas por vírgula)</label><input value={Array.isArray(f.habilidades) ? f.habilidades.join(", ") : f.habilidades || ""} onChange={set("habilidades")} /></div>
      <div><label>Foto de perfil</label><input type="file" accept="image/*" onChange={foto} /></div></div></div>
    <div className="card"><h3>Reflexão pessoal</h3>{REFL.map(([k, l]) => <div key={k}><label>{l}</label><textarea value={f[k] || ""} onChange={set(k)} /></div>)}</div>
    {erro && <p className="erro">{erro}</p>}
    <button className="btn">Salvar alterações</button> {perfil && <button type="button" className="btn sec" onClick={() => { rasc.limpar(); setEdit(false); }}>Cancelar edição</button>}</form>);
  return (<div><Header titulo="Quem Sou Eu?" subtitulo="Identificação e reflexão pessoal" />
    {msg && <p className="card">{msg}</p>}
    <div className="card perfil-topo">
      <div className="foto-wrap">{perfil.foto_url ? <Anexo img ev={{ arquivo_path: perfil.foto_url }} /> : <div className="avatar" />}
        <label className="lapis" title="Trocar foto"><Pencil size={17} /><input type="file" accept="image/*" hidden onChange={trocarFoto} /></label></div>
      <div><h2>{perfil.nome_completo}</h2>
        <span className="chip"><GraduationCap size={16} />{perfil.serie}</span><span className="chip"><Users size={16} />Turma {perfil.turma}</span>
        <span className="chip"><Laptop size={16} />{perfil.itinerario_formativo}</span><span className="chip"><Calendar size={16} />{perfil.ano_letivo}</span>{perfil.curso && <span className="chip">{perfil.curso}</span>}{perfil.habilidades?.map((h) => <span className="chip" key={h}>{h}</span>)}</div></div>
    <div className="card"><span className="secao"><ClipboardList size={22} />Reflexão pessoal</span>
      {REFL.map(([k, l, I]) => <div className="reflexao" key={k}><I size={26} /><div><b>{l}</b><span className="mudo">{perfil[k] || "—"}</span></div></div>)}</div>
    {erro && <p className="erro">{erro}</p>}
    <button className="btn" onClick={() => { setF(perfil); setMsg(""); setEdit(true); }}><Pencil size={17} />Editar</button>{" "}
    {conf ? <><button className="btn perigo" onClick={excluir}>Confirmar exclusão</button> <button className="btn sec" onClick={() => setConf(false)}>Cancelar</button></>
      : <button className="btn sec" onClick={() => setConf(true)}><Trash2 size={17} />Excluir</button>}
  </div>);
}
