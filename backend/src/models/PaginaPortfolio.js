// Entidade independente de HTTP: valida uma página do portfólio conforme as 7 seções do POP.
const { secao } = require("../config/secoes");
const campo = (c) => ({ k: c[0], obrig: !!c[4] });
module.exports = {
  // parcial = true na atualização (área, seção e bimestre não mudam)
  validar(body = {}, parcial = false) {
    const det = [], s = secao(body.secao);
    if (!parcial) {
      if (!body.area_id) det.push({ field: "area_id", message: "A área do conhecimento é obrigatória." });
      if (!s) det.push({ field: "secao", message: "A seção deve ser um número de 1 a 7." });
    }
    if (s && !parcial) {
      const b = body.bimestre;
      if (s.periodo === "bimestral" && ![1, 2, 3, 4].includes(Number(b))) det.push({ field: "bimestre", message: "Seção bimestral: informe o bimestre (1, 2, 3 ou 4)." });
      if (s.periodo === "anual" && b !== undefined && b !== null && b !== "") det.push({ field: "bimestre", message: "Seção anual tem apenas uma página; não informe bimestre." });
    }
    const alvo = s || secao(body._secao);
    const conteudo = {};
    if (alvo) {
      alvo.campos.map(campo).forEach(({ k, obrig }) => {
        const v = typeof body.conteudo?.[k] === "string" ? body.conteudo[k].trim() : "";
        if (v) conteudo[k] = v; else if (obrig) det.push({ field: k, message: `O campo ${k} é obrigatório.` });
      });
    }
    if (det.length) throw Object.assign(new Error("Dados inválidos"), { status: 400, details: det });
    return { area_id: body.area_id, secao: s?.id, bimestre: s?.periodo === "bimestral" ? Number(body.bimestre) : null, conteudo };
  },
};
