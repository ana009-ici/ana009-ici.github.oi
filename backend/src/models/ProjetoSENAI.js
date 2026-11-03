const modelo = require("./base");
module.exports = modelo(
  ["unidade_id","registro_id","competencias","autoavaliacao","titulo","descricao","tags","ano","relatorio_tecnico","reflexoes"],
  ["unidade_id","titulo"]
);
