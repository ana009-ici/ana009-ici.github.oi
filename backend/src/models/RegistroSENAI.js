const modelo = require("./base");
module.exports = modelo(
  ["unidade_id","competencias","autoavaliacao","titulo","descricao","conteudo","conhecimentos_tecnicos","atividades","resultados","tags","ano"],
  ["unidade_id","titulo"]
);
