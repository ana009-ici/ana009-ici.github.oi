// t=texto curto, a=texto longo, r=rich text, d=data, n=número, g=tags
export const CFG = {
  sesi: { rota: "/sesi/registros", ev: "/sesi/evidencias", fk: "registro_id", detalhe: "/sesi/registro/", nome: "registro",
    campos: [["titulo","Título","t"],["data_registro","Data do registro","d"],["conteudo","Conteúdo","r"],["fundamentos_teoricos","Fundamentos teóricos","a"],["participacao_sala","Participação em sala","a"],["conceitos","Conceitos","a"],["principais_teorias","Principais teorias","a"],["metodologia","Metodologia","a"],["reflexao_critica","Reflexão crítica","a"],["conexoes_interdisciplinares","Conexões interdisciplinares","a"],["aprendizados","Aprendizados da escola","a"]] },
  senai: { rota: "/senai/registros", ev: null, detalhe: "/senai/registro/", nome: "registro",
    campos: [["titulo","Título","t"],["descricao","Descrição","a"],["ano","Ano","n"],["tags","Tags (separadas por vírgula)","g"],["conteudo","Registro acadêmico","r"],["conhecimentos_tecnicos","Conhecimentos técnicos aplicados","a"],["atividades","Atividades desenvolvidas","a"],["resultados","Resultados","a"],["competencias","Competências desenvolvidas","a"],["autoavaliacao","Autoavaliação","a"]] },
  projeto: { rota: "/senai/projetos", ev: "/senai/evidencias", fk: "projeto_id", detalhe: "/senai/projeto/", nome: "projeto", exigeEv: true,
    campos: [["titulo","Título do projeto","t"],["descricao","Descrição","a"],["ano","Ano","n"],["tags","Tags (separadas por vírgula)","g"],["relatorio_tecnico","Relatório técnico","r"],["reflexoes","Reflexões","a"],["competencias","Competências desenvolvidas","a"],["autoavaliacao","Autoavaliação","a"]] },
};
