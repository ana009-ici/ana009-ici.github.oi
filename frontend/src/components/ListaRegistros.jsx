import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, enviarArquivos } from "../services/api";
import { CFG } from "../config/campos";
import FormularioRegistro from "./FormularioRegistro";
// Lista + criar/editar/excluir de qualquer tipo de registro (sesi, senai, projeto)
export default function ListaRegistros({ tipo, filtro }) {
  const cfg = CFG[tipo], [itens, setItens] = useState(null), [form, setForm] = useState(null), [conf, setConf] = useState(null), [erro, setErro] = useState("");
  const qs = new URLSearchParams(filtro).toString();
  const carregar = () => api(`${cfg.rota}?${qs}`).then(setItens).catch((e) => setErro(e.message));
  useEffect(() => { carregar(); }, [qs]);
  async function salvar(dados, arquivos) {
    const evs = arquivos;   // já enviados ao Storage na hora da escolha
    const editando = form.id;
    if (editando) {
      await api(`${cfg.rota}/${editando}`, { method: "PUT", body: { ...form, ...dados } });
      if (cfg.ev) for (const e of evs) await api(cfg.ev, { method: "POST", body: { ...e, [cfg.fk]: editando } });
    } else {
      const body = { ...filtro, ...dados, evidencias: tipo === "projeto" ? evs : undefined };
      const novo = await api(cfg.rota, { method: "POST", body });
      if (tipo === "sesi") for (const e of evs) await api(cfg.ev, { method: "POST", body: { ...e, registro_id: novo.id } });
    }
    setForm(null); carregar();
  }
  async function excluir(id) { await api(`${cfg.rota}/${id}`, { method: "DELETE" }); setConf(null); carregar(); }
  if (form) return <FormularioRegistro chave={`${tipo}:${form.id || "novo"}:${qs}`} campos={cfg.campos} inicial={form.id ? form : {}} comEvidencia={!!cfg.ev} exigeEv={cfg.exigeEv && !form.id} onSubmit={salvar} onCancel={() => setForm(null)} />;
  return (<div>
    <button className="btn" onClick={() => setForm({})}>Novo {cfg.nome}</button>
    {erro && <p className="erro">{erro}</p>}
    {itens?.length === 0 && <p className="mudo">Nenhum {cfg.nome} cadastrado ainda.</p>}
    {itens?.map((i) => (<div className="linha" key={i.id}>
      <div><b>{i.titulo}</b><br /><small className="mudo">{i.data_registro || i.ano || ""} · {i.ev ? `${i.ev.length} evidência(s)` : ""}</small></div>
      <div>
        <Link className="btn sec" to={cfg.detalhe + i.id}>Ver</Link> <button className="btn sec" onClick={() => setForm(i)}>Editar</button>{" "}
        {conf === i.id ? <><button className="btn perigo" onClick={() => excluir(i.id)}>Confirmar</button> <button className="btn sec" onClick={() => setConf(null)}>Cancelar</button></>
          : <button className="btn sec" onClick={() => setConf(i.id)}>Excluir</button>}
      </div></div>))}
  </div>);
}
