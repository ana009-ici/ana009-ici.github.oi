import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { iconeDe } from "./icones";
import Header from "./Header";
import FormCatalogo from "./FormCatalogo";
// Cards de áreas (SESI) ou unidades (SENAI). O administrador adiciona, edita e exclui; o aluno só consulta.
export default function ListaCatalogo({ tipo, titulo, subtitulo, rota, filho, extras = [], chips, comAno, rotuloNovo }) {
  const { usuario } = useAuth(), [itens, setItens] = useState(null), [ex, setEx] = useState([]), [form, setForm] = useState(null), [conf, setConf] = useState(null), [erro, setErro] = useState("");
  const carregar = () => { api(rota).then(setItens).catch((e) => setErro(e.message)); Promise.all(extras.map((u) => api(u))).then(setEx).catch(() => {}); };
  useEffect(() => { carregar(); }, []);
  async function salvar(d) { await api(form.id ? `${rota}/${form.id}` : rota, { method: form.id ? "PUT" : "POST", body: d }); setForm(null); carregar(); }
  async function excluir(id) { try { await api(`${rota}/${id}`, { method: "DELETE" }); setErro(""); } catch (e) { setErro(e.message); } setConf(null); carregar(); }
  if (form) return <div><Header titulo={form.id ? "Editar" : rotuloNovo} /><FormCatalogo tipo={tipo} inicial={form} comAno={comAno} onSubmit={salvar} onCancel={() => setForm(null)} /></div>;
  if (!itens) return <p>{erro || "Carregando…"}</p>;
  return (<div><Header titulo={titulo} subtitulo={subtitulo} />
    {usuario.admin && <button className="btn" onClick={() => setForm({})}><Plus size={18} />{rotuloNovo}</button>}
    {erro && <p className="erro">{erro}</p>}
    <div className="grid" style={{ marginTop: 16 }}>{itens.map((it) => { const I = iconeDe(it.nome, it.icone); return (<div key={it.id}>
      <Link className="card" to={filho + it.id}><div className="topo"><div className="ico"><I size={30} /></div><h3>{it.nome}</h3></div><p className="mudo">{it.descricao}</p>{chips(it, ex)}</Link>
      {usuario.admin && <div className="acoes-card"><button className="btn sec" onClick={() => setForm(it)}>Editar</button>
        {conf === it.id ? <><button className="btn perigo" onClick={() => excluir(it.id)}>Confirmar</button><button className="btn sec" onClick={() => setConf(null)}>Cancelar</button></> : <button className="btn sec" onClick={() => setConf(it.id)}>Excluir</button>}</div>}</div>); })}</div></div>);
}
