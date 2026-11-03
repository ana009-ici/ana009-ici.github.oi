import { useState } from "react";
import { useRascunho } from "../hooks/useRascunho";
import IconePicker from "./IconePicker";
export default function FormCatalogo({ tipo, inicial, comAno, onSubmit, onCancel }) {
  const [v, setV, acoes, restaurado] = useRascunho(`catalogo:${tipo}:${inicial.id || "novo"}`, { nome: inicial.nome || "", descricao: inicial.descricao || "", icone: inicial.icone || "", ano: inicial.ano || new Date().getFullYear() });
  const [erro, setErro] = useState("");
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  async function enviar(e) {
    e.preventDefault(); setErro(""); acoes.limpar();
    try { await onSubmit({ nome: v.nome, descricao: v.descricao, icone: v.icone || null, ...(comAno ? { ano: Number(v.ano) || null } : {}) }); } catch (x) { acoes.regravar(); setErro(x.message); }
  }
  return (<form className="card" onSubmit={enviar}>
    {restaurado && <p className="mudo">Rascunho restaurado automaticamente.</p>}
    <label>Título</label><input required value={v.nome} onChange={set("nome")} />
    <label>Subtítulo</label><input value={v.descricao} onChange={set("descricao")} />
    {comAno && <><label>Ano</label><input type="number" value={v.ano} onChange={set("ano")} /></>}
    <IconePicker valor={v.icone} onChange={(i) => setV({ ...v, icone: i })} />
    {erro && <p className="erro">{erro}</p>}
    <p><button className="btn">Salvar</button> <button type="button" className="btn sec" onClick={() => { acoes.limpar(); onCancel(); }}>Cancelar</button></p>
  </form>);
}
