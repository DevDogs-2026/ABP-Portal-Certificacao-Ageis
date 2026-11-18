-- Idempotent seed for the 12-topic assessment and its answer options.
BEGIN;
INSERT INTO certificacao (titulo, descricao, carga_horaria, ativa)
VALUES ('Certificação em Metodologias Ágeis', 'Avaliação de conhecimentos em metodologias ágeis.', 12, TRUE)
ON CONFLICT (titulo) DO UPDATE SET ativa = EXCLUDED.ativa;

INSERT INTO tema (nome_tema) VALUES ('Fundamentos da Agilidade')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Introdução ao Scrum')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Papéis do Scrum')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Eventos do Scrum')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Artefatos Scrum')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Kanban')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Planejamento Ágil')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Métricas Ágeis')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Gestão do Product Backlog')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Extreme Programming (XP)')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Ferramentas para Equipes Ágeis')
ON CONFLICT (nome_tema) DO NOTHING;
INSERT INTO tema (nome_tema) VALUES ('Boas Práticas em Projetos Ágeis')
ON CONFLICT (nome_tema) DO NOTHING;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Por que o modelo tradicional de gestão gera frustração quando ocorrem mudanças?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Porque não usa programas de computador modernos.'),
    ('B', 'Porque tenta planejar tudo com antecedência e resiste a mudanças.'),
    ('C', 'Porque não tem gerentes para cobrar regras rígidas.'),
    ('D', 'Porque as tarefas são feitas de forma muito lenta.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Por que o modelo tradicional de gestão gera frustração quando ocorrem mudanças?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'De acordo com o Manifesto Ágil, o que deve ser priorizado para garantir o sucesso de um projeto?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O cumprimento rígido de regras e uso de contratos inflexíveis.'),
    ('B', 'A escrita de longas documentações antes de começar o trabalho.'),
    ('C', 'As pessoas e suas interações, além da entrega de produtos funcionais.'),
    ('D', 'O seguimento cego de um plano montado meses atrás.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'De acordo com o Manifesto Ágil, o que deve ser priorizado para garantir o sucesso de um projeto?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o maior benefício de adotar uma equipe multidisciplinar e auto-organizável na cultura ágil?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Ter um gerente controlando cada tarefa individualmente.'),
    ('B', 'Esconder os erros para evitar que o time mude de rota.'),
    ('C', 'Assumir a responsabilidade coletiva para entregar valor contínuo ao usuário.'),
    ('D', 'Focar apenas em ferramentas de software sem olhar para a realidade.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Qual é o maior benefício de adotar uma equipe multidisciplinar e auto-organizável na cultura ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Na cultura ágil, como muda o papel das lideranças corporativas em comparação ao modelo tradicional?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O líder passa a cobrar prazos de forma ainda mais rígida e burocrática.'),
    ('B', 'O gestor centraliza todas as decisões diárias para evitar erros da equipe.'),
    ('C', 'O líder vira um facilitador que remove barreiras e dá autonomia para a ponta.'),
    ('D', 'O papel do chefe continua igual, mudando apenas o nome do cargos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Na cultura ágil, como muda o papel das lideranças corporativas em comparação ao modelo tradicional?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal proposta do Scrum para lidar com a impossibilidade de prever tudo no início de um projeto?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Utilizar um manual rígido de regras para evitar desvios no plano original.'),
    ('B', 'Trabalhar em ciclos curtos, avaliar os resultados e ajustar a rota continuamente.'),
    ('C', 'Planejar detalhadamente cada etapa antes de mostrar o produto ao usuário.'),
    ('D', 'Adotar uma lista fixa de ferramentas obrigatórias para acelerar o desenvolvimento.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'Qual é a principal proposta do Scrum para lidar com a impossibilidade de prever tudo no início de um projeto?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que sustenta e permite o funcionamento real dos três pilares do Scrum no ambiente de trabalho?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O uso obrigatório de ferramentas rígidas de controle de tarefas.'),
    ('B', 'A punição imediata de qualquer falha cometida pela equipe.'),
    ('C', 'Os valores do Scrum, que constroem um ambiente baseado na confiança.'),
    ('D', 'A documentação detalhada de todos os erros e acertos em relatórios.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'O que sustenta e permite o funcionamento real dos três pilares do Scrum no ambiente de trabalho?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Como se divide a responsabilidade pelo resultado final do produto?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'É exclusiva do Product Owner, pois ele gerencia o Product Backlog.'),
    ('B', 'É centralizada no Scrum Master, que atua como o chefe que dita as tarefas.'),
    ('C', 'É compartilhada em conjunto por toda a equipe, pois não existe hierarquia interna.'),
    ('D', 'É repassada apenas aos Developers, já que eles criam a parte funcional.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'Como se divide a responsabilidade pelo resultado final do produto?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual evento serve para o time se alinhar diariamente em uma conversa rápida de quinze minutos?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Daily Scrum.'),
    ('B', 'O Planejamento da Sprint.'),
    ('C', 'A Retrospectiva da Sprint.'),
    ('D', 'Sprint Review.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'Qual evento serve para o time se alinhar diariamente em uma conversa rápida de quinze minutos?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Como funciona a estrutura de decisão dentro de uma Equipe Scrum?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Um chefe dá ordens aos subordinados.'),
    ('B', 'Depende de autorização de gerentes externos.'),
    ('C', 'Todos trabalham no mesmo nível e com autogestão.'),
    ('D', 'Toda a responsabilidade fica com uma única pessoa.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'Como funciona a estrutura de decisão dentro de uma Equipe Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o papel responsável por remover os impedimentos e barreiras que bloqueiam o progresso da equipe?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Product Owner.'),
    ('B', 'Scrum Master.'),
    ('C', 'Developers.'),
    ('D', 'Stakeholders.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'Qual é o papel responsável por remover os impedimentos e barreiras que bloqueiam o progresso da equipe?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'De quem é a responsabilidade pelo sucesso ou fracasso de um projeto no Scrum?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Apenas do Product Owner, que define o que deve ser feito.'),
    ('B', 'Do Scrum Master, que atua como o líder do time.'),
    ('C', 'Dos Developers, que criam e entregam o produto.'),
    ('D', 'De toda a equipe Scrum em conjunto, sem culpados únicos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'De quem é a responsabilidade pelo sucesso ou fracasso de um projeto no Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que acontece com uma equipe Scrum quando as fronteiras de responsabilidade de cada papel não são respeitadas?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O time ganha mais velocidade porque todos fazem o trabalho de todo mundo.'),
    ('B', 'A autonomia técnica é destruída ou o alinhamento com o negócio se perde.'),
    ('C', 'O Scrum Master passa a atuar como o chefe absoluto para ditar as regras.'),
    ('D', 'O projeto avança mais rápido por causa do aumento da microgestão.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'O que acontece com uma equipe Scrum quando as fronteiras de responsabilidade de cada papel não são respeitadas?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No framework Scrum, qual é a principal característica e o papel da Sprint?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Dura de 6 a 12 meses e serve para mudar as metas do produto a cada dia.'),
    ('B', 'É uma reunião improvisada que ocorre sempre que o cliente solicita uma mudança.'),
    ('C', 'Tem duração fixa de 1 a 4 semanas e funciona como um contêiner para os outros eventos do Scrum.'),
    ('D', 'É um evento opcional que dura apenas alguns minutos e substitui a necessidade de planejar o trabalho.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'No framework Scrum, qual é a principal característica e o papel da Sprint?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o objetivo da Daily Scrum segundo a Imagem?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Definir as entregas de toda a Sprint.'),
    ('B', 'Alinhar o progresso diário e achar obstáculos em 15 minutos.'),
    ('C', 'Entregar o produto pronto ao cliente.'),
    ('D', 'Avaliar o trabalho individual da equipe.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'Qual é o objetivo da Daily Scrum segundo a Imagem?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que o time faz durante a Sprint Retrospective?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Apresenta o produto pronto para os clientes.'),
    ('B', 'Define as tarefas para as próximas 24 horas.'),
    ('C', 'Analisa como foi o trabalho em equipe e busca melhorias práticas.'),
    ('D', 'Escolhe os diretores que vão participar da próxima Sprint.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'O que o time faz durante a Sprint Retrospective?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal benefício de definir um timebox para os eventos do Scrum?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Permitir que as reuniões durem horas até que todos os assuntos paralelos sejam resolvidos.'),
    ('B', 'Gerar foco, disciplina e objetividade, evitando o excesso de reuniões improdutivas.'),
    ('C', 'Aumentar o número de reuniões diárias para melhorar o controle da empresa.'),
    ('D', 'Eliminar a necessidade de definir um objetivo coletivo para a equipe.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'Qual é o principal benefício de definir um timebox para os eventos do Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que os Artefatos do Scrum realmente representam?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Documentos burocráticos usados apenas para prestar contas à diretoria.'),
    ('B', 'O trabalho ou valor gerado pela equipe, trazendo visibilidade total ao projeto.'),
    ('C', 'Relatórios secretos criados pelo gestor ao final de cada ano.'),
    ('D', 'Regras rígidas que impedem a equipe de mudar o plano do projeto.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'O que os Artefatos do Scrum realmente representam?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal diferença entre os compromissos do Product Backlog e do Sprint Backlog?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O Product Backlog foca no curto prazo, enquanto o Sprint Backlog foca no longo prazo.'),
    ('B', 'O Product Backlog tem a Meta do Produto, e o Sprint Backlog tem a Meta da Sprint.'),
    ('C', 'O Product Backlog é gerenciado pelos Developers, e o Sprint Backlog é criado pelo cliente.'),
    ('D', 'O Product Backlog nunca muda, enquanto o Sprint Backlog muda todos os anos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'Qual é a principal diferença entre os compromissos do Product Backlog e do Sprint Backlog?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a função da Definição de Concluído (Definition of Done)?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Servir como uma régua de qualidade para garantir que o trabalho está realmente finalizado e pronto para uso.'),
    ('B', 'Listar todas as tarefas futuras que ainda não começaram.'),
    ('C', 'Substituir o Incremento ao final de cada Sprint.'),
    ('D', 'Definir o orçamento total aprovado pelos diretores do projeto.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'Qual é a função da Definição de Concluído (Definition of Done)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que acontece quando os artefatos do Scrum funcionam como radiadores de informação?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Apenas o CEO tem acesso ao andamento do projeto.'),
    ('B', 'O time precisa fazer relatórios escritos todos os dias para explicar o trabalho.'),
    ('C', 'Qualquer pessoa vê as prioridades e o progresso na hora, evitando reuniões longas de prestação de contas.'),
    ('D', 'As informações do projeto ficam escondidas até o final do ano.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'O que acontece quando os artefatos do Scrum funcionam como radiadores de informação?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal objetivo da Gestão do Product Backlog em projetos ágeis?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Organizar e priorizar as tarefas continuamente, em equipe, para entregar mais valor ao cliente e ao negócio.'),
    ('B', 'Criar uma lista fixa de tarefas que não muda durante o projeto.'),
    ('C', 'Anotar todas as ideias sem definir prioridades ou ouvir a equipe.'),
    ('D', 'Deixar apenas o time técnico escolher as prioridades, enquanto o Product Owner só acompanha.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Qual é o principal objetivo da Gestão do Product Backlog em projetos ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o objetivo do refinamento do Product Backlog e o significado do acrônimo DEEP?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Agrupar tarefas e manter prioridades fixas durante o projeto.'),
    ('B', 'Detalhar todos os itens desde o início, sem alterações posteriores.'),
    ('C', 'Dividir itens complexos em partes menores e manter o backlog Detalhado, Estimado, Evolutivo e Priorizado.'),
    ('D', 'Eliminar itens antigos e planejar apenas a Sprint atual.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Qual é o objetivo do refinamento do Product Backlog e o significado do acrônimo DEEP?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal papel da priorização na Gestão do Product Backlog?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Organizar tarefas por ordem de criação, mantendo prioridades fixas.'),
    ('B', 'Equilibrar valor financeiro, satisfação do usuário e esforço técnico, garantindo entregas sustentáveis.'),
    ('C', 'Priorizar apenas os itens mais fáceis de desenvolver, reduzindo o trabalho da equipe.'),
    ('D', 'Transferir ao time técnico a responsabilidade de definir todas as prioridades do produto.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Qual é o principal papel da priorização na Gestão do Product Backlog?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Por que o Product Backlog deve ser constantemente atualizado?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Para manter todas as ideias iniciais, evitando descartar funcionalidades planejadas.'),
    ('B', 'Para impedir mudanças nas prioridades durante o desenvolvimento do produto.'),
    ('C', 'Para adaptar-se às mudanças do negócio e dos usuários, descartando itens que não geram mais valor.'),
    ('D', 'Para garantir que todas as funcionalidades sejam desenvolvidas, independentemente de sua utilidade.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Por que o Product Backlog deve ser constantemente atualizado?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Em comparação ao Scrum, a abordagem de implementação do método Kanban é caracterizada como flexível e evolucionária porque se fundamenta na prática de:' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Exigir Sprints e papéis predefinidos.'),
    ('B', 'Começar com o processo atual e buscar melhorias contínuas.'),
    ('C', 'Substituir todo o fluxo por um modelo padrão.'),
    ('D', 'Ignorar o processo atual no primeiro dia.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'Em comparação ao Scrum, a abordagem de implementação do método Kanban é caracterizada como flexível e evolucionária porque se fundamenta na prática de:'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'A prática guiada pela máxima "pare de começar e comece a terminar", que aumenta a eficiência da equipe ao impedir que várias tarefas sejam abertas simultaneamente sem conclusão, é conhecida como:' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Visualização do fluxo.'),
    ('B', 'Mapeamento de etapas.'),
    ('C', 'Limitar o Trabalho em Progresso (WIP).'),
    ('D', 'Criar políticas explícitas.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'A prática guiada pela máxima "pare de começar e comece a terminar", que aumenta a eficiência da equipe ao impedir que várias tarefas sejam abertas simultaneamente sem conclusão, é conhecida como:'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Limitar o trabalho em andamento (WIP) serve para controlar quantas tarefas são feitas ao mesmo tempo. Assim, novas tarefas só começam quando a equipe tem espaço livre para fazê-las. Qual é o principal objetivo dessa prática?' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Criar ciclos fixos obrigatórios (Sprints).'),
    ('B', 'Parar de medir os resultados.'),
    ('C', 'Controlar o ritmo das tarefas conforme a capacidade da equipe.'),
    ('D', 'Aumentar o número de tarefas feitas ao mesmo tempo.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'Limitar o trabalho em andamento (WIP) serve para controlar quantas tarefas são feitas ao mesmo tempo. Assim, novas tarefas só começam quando a equipe tem espaço livre para fazê-las. Qual é o principal objetivo dessa prática?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O limite de WIP ajuda a mostrar onde o trabalho está travando. Quando uma etapa atinge o limite máximo, novas tarefas ficam bloqueadas e a equipe se une para resolver o acúmulo. Qual é o principal resultado dessa prática?' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Deixar cada etapa ter tarefas sem limite.'),
    ('B', 'Incentivar a equipe a colaborar e destravar o fluxo.'),
    ('C', 'Evitar que as pessoas conversem entre si.'),
    ('D', 'Focar apenas no trabalho individual.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'O limite de WIP ajuda a mostrar onde o trabalho está travando. Quando uma etapa atinge o limite máximo, novas tarefas ficam bloqueadas e a equipe se une para resolver o acúmulo. Qual é o principal resultado dessa prática?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Em comparação aos modelos tradicionais, qual é a principal diferença na abordagem do Planejamento Ágil?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Tentar antecipar e detalhar cada etapa de projetos longos logo no início.'),
    ('B', 'Tratar o planejamento como uma atividade contínua, aceitando a incerteza e focando na adaptação.'),
    ('C', 'Criar documentos estáticos e rígidos que não sofrem alterações ao longo do projeto.'),
    ('D', 'Eliminar completamente qualquer forma de planejamento para focar apenas na execução aleatória.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'Em comparação aos modelos tradicionais, qual é a principal diferença na abordagem do Planejamento Ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No modelo da "Cebola do Planejamento Ágil", qual é a relação entre o horizonte de tempo e o nível de detalhe do plano?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Distante = detalhado.'),
    ('B', 'Próximo = abstrato.'),
    ('C', 'Distante = abstrato; Próximo = detalhado.'),
    ('D', 'Mesma profundidade.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'No modelo da "Cebola do Planejamento Ágil", qual é a relação entre o horizonte de tempo e o nível de detalhe do plano?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No Planejamento Ágil, a capacidade da equipe de recalcular o percurso diante de obstáculos ou oportunidades sem perder o objetivo final assemelha-se ao funcionamento de um GPS porque o time:' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Segue um cronograma fixo e imutável desde o início.'),
    ('B', 'Toma decisões com base em dados reais e mede sua velocidade a cada ciclo.'),
    ('C', 'Elimina qualquer estimativa de esforço ou previsão de prazos.'),
    ('D', 'Engessa a inovação para cumprir rigorosamente o plano original.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'No Planejamento Ágil, a capacidade da equipe de recalcular o percurso diante de obstáculos ou oportunidades sem perder o objetivo final assemelha-se ao funcionamento de um GPS porque o time:'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No Planejamento Ágil, como a visão de futuro e as entregas de médio prazo são tratadas em comparação aos métodos tradicionais?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Como uma profecia inflexível e imutável.'),
    ('B', 'Evitando olhar para o futuro ou criar Roadmaps.'),
    ('C', 'Como uma hipótese testada e detalhada gradualmente.'),
    ('D', 'Substituindo o Roadmap por cronogramas rígidos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'No Planejamento Ágil, como a visão de futuro e as entregas de médio prazo são tratadas em comparação aos métodos tradicionais?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual métrica mede o tempo total desde o momento em que um pedido nasce até ser entregue ao cliente, e qual ferramenta visual ajuda a ver instantaneamente se o trabalho está acumulando em alguma etapa?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Cycle Time e Gráfico de Burndown.'),
    ('B', 'Velocidade e Cycle Time.'),
    ('C', 'Vazão Throughput e Gráfico de Burndown.'),
    ('D', 'Lead Time e Diagrama de Fluxo Cumulativo (CFD).')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Qual métrica mede o tempo total desde o momento em que um pedido nasce até ser entregue ao cliente, e qual ferramenta visual ajuda a ver instantaneamente se o trabalho está acumulando em alguma etapa?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal benefício das métricas ágeis e como o sucesso deve ser medido?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Contar horas trabalhadas para avaliar a equipe.'),
    ('B', 'Identificar gargalos pelo histórico real e medir o sucesso pelo valor entregue ao usuário.'),
    ('C', 'Estabelecer metas punitivas baseadas no volume de tarefas iniciadas.'),
    ('D', 'Substituir dados reais por estimativas baseadas em desejos da gestão.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Qual é o principal benefício das métricas ágeis e como o sucesso deve ser medido?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Na análise de métricas ágeis, qual é a principal função do Cumulative Flow Diagram (CFD)?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Identificar acúmulos de demandas paradas e prever atrasos antecipadamente.'),
    ('B', 'Medir a produtividade individual por horas trabalhadas.'),
    ('C', 'Manter um número fixo de tarefas concluídas por dia em cada etapa.'),
    ('D', 'Eliminar a necessidade de acompanhar o progresso após o início do ciclo.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Na análise de métricas ágeis, qual é a principal função do Cumulative Flow Diagram (CFD)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Diferente dos modelos tradicionais, qual é o objetivo principal de utilizar Métricas Ágeis em um time?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Vigiar o time e contar horas de trabalho na mesa.'),
    ('B', 'Acompanhar a saúde do fluxo e o valor entregue para gerar melhoria contínua.'),
    ('C', 'Identificar colaboradores lentos para aplicar punições.'),
    ('D', 'Eliminar indicadores e gerenciar o projeto com base em palpites.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Diferente dos modelos tradicionais, qual é o objetivo principal de utilizar Métricas Ágeis em um time?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o foco principal da metodologia Extreme Programming (XP) em comparação a frameworks de gestão de processo como o Scrum?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Organizar a comunicação gerencial e eliminar a necessidade de testes de código.'),
    ('B', 'Focar intensamente na excelência técnica e na engenharia de software, levando boas práticas ao limite.'),
    ('C', 'Priorizar a burocracia e o cumprimento rígido de planos de longo prazo.'),
    ('D', 'Reduzir a frequência de testes para acelerar a entrega inicial do sistema.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'Qual é o foco principal da metodologia Extreme Programming (XP) em comparação a frameworks de gestão de processo como o Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No XP, como atuam o TDD e a Programação em Par?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O TDD cria testes após a entrega, e a Programação em Par divide o time em turnos.'),
    ('B', 'O TDD foca na documentação manual, e a Programação em Par separa os desenvolvedores em salas distintas.'),
    ('C', 'O TDD escreve o teste antes do código para evitar erros, e a Programação em Par une dois programadores na mesma máquina para detalhe e visão geral.'),
    ('D', 'O TDD elimina validações automatizadas, e a Programação em Par impõe cronogramas rígidos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'No XP, como atuam o TDD e a Programação em Par?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No XP, qual é o propósito da Integração Contínua (CI) e do design simples?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Unificar alterações e testes várias vezes ao dia e criar apenas o necessário para o momento atual.'),
    ('B', 'Isolar o código de cada desenvolvedor por longos períodos e planejar todas as funcionalidades futuras de uma só vez.'),
    ('C', 'Priorizar entregas rápidas ignorando testes automatizados e maximizar a complexidade inicial do sistema.'),
    ('D', 'Substituir o ritmo de trabalho sustentável por jornadas extensas focadas em documentação estática.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'No XP, qual é o propósito da Integração Contínua (CI) e do design simples?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No Extreme Programming (XP), como o design simples lida com a arquitetura do software?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Cria arquiteturas complexas prevendo demandas futuras.'),
    ('B', 'Resolve o problema atual com simplicidade, usando testes para evoluir depois.'),
    ('C', 'Elimina testes automatizados ao priorizar estruturas rígidas de longo prazo.'),
    ('D', 'Substitui o código funcional por planejamentos burocráticos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'No Extreme Programming (XP), como o design simples lida com a arquitetura do software?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o papel adequado das ferramentas de software no contexto das equipes ágeis?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Servir como ponto de partida principal para transformar a empresa em ágil imediatamente.'),
    ('B', 'Atuar como meio facilitador para potencializar a colaboração, dar transparência e conectar equipes.'),
    ('C', 'Substituir a necessidade de interações humanas por automações rígidas de processos.'),
    ('D', 'Garantir a agilidade da organização apenas por meio da aquisição de licenças sofisticadas.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'Qual é o papel adequado das ferramentas de software no contexto das equipes ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'De acordo com o infográfico, como as ferramentas ágeis se dividem para apoiar a equipe?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Em código (GitHub/GitLab) para o backlog e editores de texto para retrospectivas.'),
    ('B', 'Em comunicação (Slack/Teams) para substituir o Kanban e quadros físicos para o Burndown.'),
    ('C', 'Em gestão de fluxo (Jira/Trello) para métricas e WIP, e colaboração visual (Miro/Mural) para quadros e retrospectivas.'),
    ('D', 'Em automação de servidores para eliminar a necessidade de acompanhamento de progresso.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'De acordo com o infográfico, como as ferramentas ágeis se dividem para apoiar a equipe?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Segundo as boas práticas no uso de ferramentas ágeis, a principal função dessas tecnologias deve ser?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Refletir com simplicidade a realidade do time e focar na entrega de valor.'),
    ('B', 'Impor processos burocráticos para detalhar o tempo da equipe.'),
    ('C', 'Preservar o isolamento das informações entre os setores.'),
    ('D', 'Priorizar o preenchimento de campos em detrimento da adaptação.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'Segundo as boas práticas no uso de ferramentas ágeis, a principal função dessas tecnologias deve ser?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'De acordo com a imagem, o que acontece quando há excesso de configuração nas ferramentas ágeis?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Aumenta a velocidade de entrega com processos obrigatórios.'),
    ('D', 'Melhora a colaboração direta e elimina reuniões de alinhamento.'),
    ('C', 'Garante a entrega de valor ao substituir o Kanban por formulários.'),
    ('D', 'Gera burocracia e drena a energia do time, que passa a focar apenas em alimentar o sistema.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'De acordo com a imagem, o que acontece quando há excesso de configuração nas ferramentas ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Sobre a transição para metodologias ágeis, assinale a alternativa que representa a verdadeira essência da agilidade:' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Seguir manuais rigorosamente, focando mais na forma do que na adaptação.'),
    ('B', 'Eliminar padrões de qualidade para acelerar as entregas do time.'),
    ('C', 'Usar termos ágeis apenas para manter o modelo tradicional de gestão.'),
    ('D', 'Cultivar disciplina, transparência e melhoria contínua na equipe.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'Sobre a transição para metodologias ágeis, assinale a alternativa que representa a verdadeira essência da agilidade:'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No fluxo de trabalho ágil, qual é a função das definições DoR (Definition of Ready) e DoD (Definition of Done)?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'DoR evita o início de tarefas confusas e DoD garante a qualidade da entrega final.'),
    ('B', 'DoR e DoD são listas idênticas usadas apenas para duplicar o controle de qualidade.'),
    ('C', 'DoR serve para aprovação do cliente e DoD para estimar o tempo de desenvolvimento.'),
    ('D', 'DoR valida histórias técnicas e DoD define o que entra no Backlog.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'No fluxo de trabalho ágil, qual é a função das definições DoR (Definition of Ready) e DoD (Definition of Done)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No âmbito da liderança e sustentabilidade em equipes ágeis, qual é o papel da segurança psicológica e do refinamento contínuo?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Impor metas individuais rígidas para evitar erros e punir falhas nas retrospectivas.'),
    ('B', 'Garantir um ambiente seguro para o time aprender com falhas e manter reuniões de planejamento eficientes.'),
    ('C', 'Eliminar o refinamento do backlog para tornar o planejamento da Sprint o mais longo possível.'),
    ('D', 'Focar no aumento do esforço individual, independentemente do valor gerado para o cliente.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'No âmbito da liderança e sustentabilidade em equipes ágeis, qual é o papel da segurança psicológica e do refinamento contínuo?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a consequência apontada para a equipe quando se decide iniciar um item de backlog que não atende aos critérios mínimos de DoR (Definition of Ready)?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O aumento imediato da transparência e a eliminação de reuniões de emergência.'),
    ('B', 'O pagamento de um preço alto no meio da Sprint, com atrasos e impedimentos técnicos.'),
    ('C', 'A automatização do processo de testes e o fim do retrabalho na entrega final.'),
    ('D', 'A melhoria contínua do fluxo de valor sem afetar o foco dos desenvolvedores.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'Qual é a consequência apontada para a equipe quando se decide iniciar um item de backlog que não atende aos critérios mínimos de DoR (Definition of Ready)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

COMMIT;
