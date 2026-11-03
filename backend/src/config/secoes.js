// As 7 seções do POP "Portfólio Ensino Médio 2025". Fonte única: o frontend lê isto em GET /api/sesi/secoes.
// campo = [chave, rótulo, tipo ("t" texto curto, "a" texto longo), orientação opcional, obrigatório?]
const SECOES = [
  { id: 1, nome: "Quem Sou Eu?", periodo: "anual", campos: [
    ["nome", "Nome", "t", "Identificação", true], ["serie", "Série", "t", null, true],
    ["itinerario_formativo", "Itinerário formativo", "t", null, true], ["turma", "Turma", "t", null, true],
    ["reflexao_pessoal", "Reflexão pessoal", "a", "Breve reflexão sobre expectativas e objetivos pessoais."]] },
  { id: 2, nome: "Fundamentos Teóricos", periodo: "bimestral", campos: [
    ["resumo_teorico", "Resumo teórico", "a", "Resumo das principais teorias, conceitos e metodologias aprendidas."]] },
  { id: 3, nome: "Participação em Sala de Aula", periodo: "bimestral", campos: [
    ["registro_atividades", "Registro de atividades", "a", "Registro das discussões, atividades e principais temas abordados."],
    ["reflexao_pratica", "Reflexão prática", "a", "Reflexão sobre um conceito aprendido e sua aplicação na prática."],
    ["autoavaliacao", "Autoavaliação", "a", "Autoavaliação do engajamento nas aulas."],
    ["temas_discutidos", "Resuma os principais temas discutidos em sala de aula.", "a", "Instruções adicionais"],
    ["mais_chamou_atencao", "O que mais chamou sua atenção?", "a"],
    ["atividade_que_ajudou", "Mencione alguma atividade, discussão ou exemplo apresentado pelo professor ou colegas que tenha ajudado no seu aprendizado.", "a"],
    ["conceito_cotidiano", "Explique um conceito aprendido e como ele pode ser aplicado no seu cotidiano.", "a"]] },
  { id: 4, nome: "Projetos e Trabalhos Desenvolvidos", periodo: "bimestral", evidencias: true, campos: [
    ["descricao_atividades", "Descrição de atividades", "a", "Descrição de atividades práticas, trabalhos e pesquisas realizadas. Em Evidências visuais, anexe os materiais produzidos."]] },
  { id: 5, nome: "Reflexão Crítica", periodo: "anual", campos: [
    ["aprendizado_academico", "Aprendizado acadêmico", "a", "O que aprendeu com as experiências acadêmicas?"],
    ["aplicacao_pratica", "Aplicação prática", "a", "Como esse conhecimento pode ser aplicado na vida real?"],
    ["melhorias_necessarias", "Melhorias necessárias", "a", "Em quais pontos ainda preciso melhorar?"],
    ["sugestao_adicional", "Sugestão adicional", "a", "Relembre momentos desafiadores ao longo da sua trajetória escolar e reflita sobre como essas experiências fortaleceram sua resiliência, paciência e capacidade de solucionar problemas."]] },
  { id: 6, nome: "Conexões Interdisciplinares", periodo: "anual", campos: [
    ["relacoes_interdisciplinares", "Relações interdisciplinares", "a", "Como os conteúdos vistos em sala se relacionam com outras disciplinas ou áreas do conhecimento?"]] },
  { id: 7, nome: "Aprendizados da Escola para a Vida?", periodo: "anual", campos: [
    ["reflexao_experiencias", "Reflexão sobre experiências", "a", "Reflexão sobre como as experiências vividas na escola contribuirão para a vida em sociedade."],
    ["aplicacao_conhecimentos", "Aplicação dos conhecimentos", "a", "Como os conhecimentos adquiridos e as situações enfrentadas no ambiente escolar auxiliarão na resolução de problemas e na convivência com diferentes pessoas."],
    ["escola_influenciou", "Como a escola influenciou minha forma de pensar e agir?", "a", "Direcionamentos sugeridos"],
    ["habilidades_desenvolvidas", "Que habilidades desenvolvi que serão úteis no meu futuro pessoal e profissional?", "a"],
    ["desafios_superados", "Como os desafios superados na escola me prepararam para novas etapas da vida?", "a"]] },
];
module.exports = { SECOES, secao: (id) => SECOES.find((s) => s.id === Number(id)) };
