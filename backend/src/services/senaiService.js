const { supabase, fabrica, evidencias, catalogo, erro } = require("./crud");
const evidenciasSenai = evidencias("evidencias_senai", "projetos_senai", "projeto_id");
const projetos = fabrica({ table: "projetos_senai", embed: "*, ev:evidencias_senai(*)", filtros: ["unidade_id"], modelo: require("../models/ProjetoSENAI") });
const criarProjeto = projetos.criar.bind(projetos);
// RN03: projeto só é criado com pelo menos uma evidência
projetos.criar = async (uid, body) => {
  if (body.unidade_curricular && !body.unidade_id) {      // Passo 4 envia o nome da unidade
    const { data: u } = await supabase.from("unidades_curriculares").select("id").ilike("nome", body.unidade_curricular.trim()).maybeSingle();
    if (!u) throw Object.assign(erro(400, "Dados inválidos"), { details: [{ field: "unidade_curricular", message: "Unidade curricular não encontrada." }] });
    body = { ...body, unidade_id: u.id };
  }
  if (!Array.isArray(body.evidencias) || !body.evidencias.length) throw erro(400, "Projetos e trabalhos exigem pelo menos uma evidência (RN03).");
  const proj = await criarProjeto(uid, body);
  for (const e of body.evidencias) await evidenciasSenai.criar(uid, { ...e, projeto_id: proj.id });
  return proj;
};
module.exports = {
  unidades: catalogo("unidades_curriculares", ["nome", "descricao", "icone", "ano"]),
  registros: fabrica({ table: "registros_senai", filtros: ["unidade_id"], modelo: require("../models/RegistroSENAI") }),
  projetos,
  evidencias: evidenciasSenai,
};
