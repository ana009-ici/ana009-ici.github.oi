// Modelo genérico: filtra campos permitidos, exige obrigatórios e aplica regras (independe de HTTP).
module.exports = (campos, obrigatorios, regras = () => {}) => ({
  validar(body = {}) {
    const d = {};
    campos.forEach((c) => { if (body[c] !== undefined) d[c] = typeof body[c] === "string" ? body[c].trim() : body[c]; });
    const det = obrigatorios
      .filter((c) => d[c] === undefined || d[c] === null || d[c] === "")
      .map((c) => ({ field: c, message: `O campo ${c} é obrigatório.` }));
    regras(d, det);
    if (det.length) throw Object.assign(new Error("Dados inválidos"), { status: 400, details: det });
    return d;
  },
});
