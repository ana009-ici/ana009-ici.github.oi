export default function Header({ titulo, subtitulo, voltar, icone: Icone }) {
  return (<header className="titulo">{voltar}<h1>{Icone && <Icone size={40} />}<span>{titulo}</span></h1>{subtitulo && <p>{subtitulo}</p>}</header>);
}
