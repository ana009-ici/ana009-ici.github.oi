const modelo = require("./base");
// RN02: bimestre de 1 a 4
module.exports = modelo(
  ["area_id","bimestre","titulo","conteudo","fundamentos_teoricos","participacao_sala","conceitos","principais_teorias","metodologia","reflexao_critica","conexoes_interdisciplinares","aprendizados","data_registro"],
  ["area_id","bimestre","titulo"],
  (d, det) => { if (d.bimestre !== undefined && ![1,2,3,4].includes(Number(d.bimestre))) det.push({ field: "bimestre", message: "O bimestre deve ser 1, 2, 3 ou 4." }); }
);
