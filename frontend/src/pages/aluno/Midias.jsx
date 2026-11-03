import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Images } from "lucide-react";
import { api } from "../../services/api";
import { CFG } from "../../config/campos";
import Header from "../../components/Header";
import Anexo from "../../components/Anexo";
export default function Midias() {
  const [d, setD] = useState(null), [conf, setConf] = useState(null), [erro, setErro] = useState("");
  const carregar = () => Promise.all([api("/sesi/paginas"), api("/senai/projetos")]).then(([s, p]) => setD({ s, p }));
  useEffect(() => { carregar(); }, []);
  async function excluir(tipo, id) { try { await api(`${tipo === "sesi" ? "/sesi/pagina-evidencias" : CFG[tipo].ev}/${id}`, { method: "DELETE" }); setErro(""); setConf(null); carregar(); } catch (e) { setErro(e.message); setConf(null); } }
  if (!d) return <p>Carregando…</p>;
  const itens = [...d.s.flatMap((r) => (r.ev || []).map((e) => ({ e, r, tipo: "sesi" }))), ...d.p.flatMap((r) => (r.ev || []).map((e) => ({ e, r, tipo: "projeto" })))];
  return (<div><Header titulo="Mídias" subtitulo="Fotos, vídeos e arquivos anexados. Para enviar ou substituir, abra a página." icone={Images} />
    {erro && <p className="erro">{erro}</p>}{itens.length === 0 && <p className="mudo">Nenhuma mídia enviada ainda.</p>}
    {itens.map(({ e, r, tipo }) => (<div className="linha" key={e.id}><div><Anexo ev={e} /><br /><small className="mudo">{tipo === "sesi" ? "SESI" : "SENAI"} · {tipo === "sesi" ? `Seção ${r.secao}${r.bimestre ? ` · ${r.bimestre}º bimestre` : ""}` : r.titulo}</small></div>
      <div><Link className="btn sec" to={tipo === "sesi" ? `/sesi/${r.area_id}/${r.secao}` : CFG[tipo].detalhe + r.id}>Abrir página</Link>{" "}
        {conf === e.id ? <><button className="btn perigo" onClick={() => excluir(tipo, e.id)}>Confirmar</button> <button className="btn sec" onClick={() => setConf(null)}>Cancelar</button></> : <button className="btn sec" onClick={() => setConf(e.id)}>Excluir</button>}</div></div>))}</div>);
}
