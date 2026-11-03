import ListaCatalogo from "../../components/ListaCatalogo";
export default function Areas() {
  return <ListaCatalogo tipo="area" titulo="SESI" subtitulo="Áreas do conhecimento" rota="/sesi/areas" filho="/sesi/" extras={["/sesi/paginas", "/sesi/secoes"]} rotuloNovo="Nova área"
    chips={(a, [pgs = [], secs = []]) => <span className="chip">{pgs.filter((p) => p.area_id === a.id).length}/{secs.reduce((n, s) => n + (s.periodo === "bimestral" ? 4 : 1), 0)} página(s)</span>} />;
}
