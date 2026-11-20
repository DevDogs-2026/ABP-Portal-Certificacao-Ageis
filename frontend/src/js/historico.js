const CHAVE_HISTORICO = "historicoRespostas";
const MEDIA_APROVACAO = 65; // % mínimo para aprovação

const TEMAS = [
  {
    id: "fundamentos-agilidade",
    nome: "Fundamentos da Agilidade",
    totalQuestoes: 1,
  },
  { id: "introducao-scrum", nome: "Introdução ao Scrum", totalQuestoes: 1 },
  { id: "papeis-scrum", nome: "Papéis do Scrum", totalQuestoes: 1 },
  { id: "eventos-scrum", nome: "Eventos do Scrum", totalQuestoes: 1 },
  { id: "artefatos-scrum", nome: "Artefatos do Scrum", totalQuestoes: 1 },
  {
    id: "product-backlog",
    nome: "Gestão do Product Backlog",
    totalQuestoes: 1,
  },
  { id: "kanban", nome: "Kanban", totalQuestoes: 1 },
  { id: "planejamento-agil", nome: "Planejamento Ágil", totalQuestoes: 1 },
  { id: "metricas-ageis", nome: "Métricas Ágeis", totalQuestoes: 1 },
  { id: "xp", nome: "Extreme Programming (XP)", totalQuestoes: 1 },
  {
    id: "ferramentas-ageis",
    nome: "Ferramentas para Equipes Ágeis",
    totalQuestoes: 1,
  },
  {
    id: "boas-praticas",
    nome: "Boas Práticas em Projetos Ágeis",
    totalQuestoes: 1,
  },
];

function lerHistorico() {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_HISTORICO));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

function agruparAvaliacoes(usuarioId) {
  const mapa = new Map();
  lerHistorico()
    .filter((h) => h.usuarioId === usuarioId)
    .forEach((h) => {
      const n = h.tentativa || 1;
      if (!mapa.has(n)) mapa.set(n, new Map());
      mapa.get(n).set(h.temaId, h);
    });
  return mapa;
}

function resumoDaAvaliacao(respostas) {
  const acertos = [...respostas.values()].filter((r) => r.acertou).length;
  const percentual = Math.round((acertos / TEMAS.length) * 100);
  const completa = respostas.size >= TEMAS.length;
  return {
    acertos,
    percentual,
    completa,
    aprovada: completa && percentual >= MEDIA_APROVACAO,
  };
}

function avaliacaoVigente(usuarioId) {
  const mapa = agruparAvaliacoes(usuarioId);
  let ultima = 0;
  let aprovada = 0;
  for (const [n, respostas] of mapa) {
    ultima = Math.max(ultima, n);
    if (!aprovada && resumoDaAvaliacao(respostas).aprovada) aprovada = n;
  }
  const numero = aprovada || ultima;
  return { numero, respostas: mapa.get(numero) || new Map() };
}

function registrarResposta({
  usuarioId,
  temaId,
  questaoId,
  enunciado,
  respostaDada,
  respostaCorreta,
}) {
  const tema = TEMAS.find((t) => t.id === temaId);
  if (!usuarioId || !tema || !questaoId) return null;

  const mapa = agruparAvaliacoes(usuarioId);
  let numero = 1;
  if (mapa.size) {
    const ultima = Math.max(...mapa.keys());
    const resumo = resumoDaAvaliacao(mapa.get(ultima));
    if (resumo.aprovada) return null; // já aprovado, não há nova avaliação
    numero = resumo.completa ? ultima + 1 : ultima;
  }

  if (mapa.get(numero)?.has(temaId)) return null;

  const registro = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    usuarioId,
    temaId,
    temaNome: tema.nome,
    questaoId,
    enunciado: String(enunciado || ""),
    respostaDada: String(respostaDada ?? ""),
    respostaCorreta: String(respostaCorreta ?? ""),
    acertou: String(respostaDada) === String(respostaCorreta),
    tentativa: numero, // número da avaliação
    respondidoEm: new Date().toISOString(),
  };

  const historico = lerHistorico();
  historico.push(registro);
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
  return registro;
}

function historicoDoUsuario(usuarioId) {
  return lerHistorico()
    .filter((h) => h.usuarioId === usuarioId)
    .sort((a, b) => new Date(b.respondidoEm) - new Date(a.respondidoEm));
}

function resumoPorTema(usuarioId) {
  const { respostas } = avaliacaoVigente(usuarioId);
  return TEMAS.map((tema) => {
    const r = respostas.get(tema.id);
    return {
      tema,
      respondidas: r ? 1 : 0,
      total: tema.totalQuestoes,
      acertos: r && r.acertou ? 1 : 0,
      concluido: Boolean(r),
    };
  });
}

function calcularEstatisticas(usuarioId) {
  const { numero, respostas } = avaliacaoVigente(usuarioId);
  const resumo = resumoDaAvaliacao(respostas);
  return {
    avaliacao: numero,
    temasConcluidos: respostas.size,
    totalTemas: TEMAS.length,
    progresso: Math.round((respostas.size / TEMAS.length) * 100),
    percentual: resumo.percentual,
    nota: resumo.percentual / 10,
    finalizada: resumo.completa,
    aprovado: resumo.aprovada,
  };
}
