// RN04: o aluno entra com e-mail @aluno. DOMINIO_ALUNO="aluno" aceita @aluno e @aluno.qualquer.coisa; vazio = sem restrição.
const { ehAdmin } = require("../middleware/soAdmin");
const norm = () => (process.env.DOMINIO_ALUNO || "").trim().toLowerCase().replace(/^@/, "");
function emailPermitido(email = "") {
  const d = norm(); if (!d) return true;
  const dom = String(email).toLowerCase().split("@")[1] || "";
  return dom === d || dom.startsWith(d + ".") || dom.endsWith("." + d);
}
// Só alunos são restringidos; professor e administrador entram com o e-mail que tiverem.
const bloqueado = (usuario) => usuario.tipo === "aluno" && !ehAdmin(usuario) && !emailPermitido(usuario.email);
module.exports = { emailPermitido, bloqueado };
