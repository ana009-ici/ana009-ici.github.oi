import { Calendar, FileText, Box } from "lucide-react";
import ListaCatalogo from "../../components/ListaCatalogo";
export default function Unidades() {
  return <ListaCatalogo tipo="unidade" titulo="SENAI" subtitulo="Unidades curriculares" rota="/senai/unidades" filho="/senai/" extras={["/senai/registros", "/senai/projetos"]} comAno rotuloNovo="Nova unidade"
    chips={(u, [regs = [], projs = []]) => <><span className="chip"><Calendar size={15} />{u.ano}</span><span className="chip"><FileText size={15} />{regs.filter((r) => r.unidade_id === u.id).length} registro(s)</span><span className="chip"><Box size={15} />{projs.filter((r) => r.unidade_id === u.id).length} projeto(s)</span></>} />;
}
