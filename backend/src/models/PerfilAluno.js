const modelo = require("./base");
// RN01: identificação obrigatória. Aceita também os nomes dos Passos 2 e 4 (nome, objetivos, avatar_url).
const base = modelo(
  ["nome_completo","matricula","unidade","curso","habilidades","serie","turma","itinerario_formativo","ano_letivo","foto_url","expectativas_ano","objetivos_pessoais","objetivos_academicos","objetivos_profissionais","expectativas_formacao"],
  ["nome_completo","serie","turma","itinerario_formativo"],
  (d, det) => { if (d.habilidades !== undefined && !Array.isArray(d.habilidades)) det.push({ field: "habilidades", message: "As habilidades devem ser uma lista." }); }
);
module.exports = {
  validar(body = {}) {
    const b = { ...body };
    if (b.nome !== undefined && b.nome_completo === undefined) b.nome_completo = b.nome;
    if (b.objetivos !== undefined && b.objetivos_pessoais === undefined) b.objetivos_pessoais = b.objetivos;
    if (b.avatar_url !== undefined && b.foto_url === undefined) b.foto_url = b.avatar_url;
    const d = base.validar(b);
    if (!d.objetivos_pessoais) d.objetivos_pessoais = "Não informado";   // valor padrão, como no Passo 3
    if (!d.ano_letivo) d.ano_letivo = new Date().getFullYear();
    return d;
  },
};
