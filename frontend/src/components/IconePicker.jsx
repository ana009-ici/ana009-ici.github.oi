import { ICONES } from "./icones";
export default function IconePicker({ valor, onChange }) {
  return (<div><label>Imagem do card</label><div className="icones">
    <button type="button" className={!valor ? "on" : ""} onClick={() => onChange("")} title="Automática">Auto</button>
    {Object.entries(ICONES).map(([k, I]) => <button type="button" key={k} className={valor === k ? "on" : ""} onClick={() => onChange(k)} title={k}><I /></button>)}
  </div></div>);
}
