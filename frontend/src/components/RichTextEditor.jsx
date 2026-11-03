import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
export default function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.innerHTML = DOMPurify.sanitize(value || ""); }, []); // valor inicial
  const cmd = (c, v) => { ref.current.focus(); document.execCommand(c, false, v); onChange(ref.current.innerHTML); };
  const link = () => { const u = prompt("Endereço do link:"); if (u && /^https?:/i.test(u)) cmd("createLink", u); };
  return (<div>
    <div className="barra" onMouseDown={(e) => e.preventDefault()}>
      <button type="button" onClick={() => cmd("formatBlock", "h3")}>Título</button>
      <button type="button" onClick={() => cmd("bold")}><b>N</b></button>
      <button type="button" onClick={() => cmd("italic")}><i>I</i></button>
      <button type="button" onClick={() => cmd("insertUnorderedList")}>• Lista</button>
      <button type="button" onClick={link}>Link</button>
    </div>
    <div className="rte" ref={ref} contentEditable suppressContentEditableWarning onInput={() => onChange(ref.current.innerHTML)} />
  </div>);
}
