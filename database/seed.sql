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
SELECT id_tema, 'Qual é o principal objetivo do Kanban dentro de uma equipe de trabalho?' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Estabelecer ciclos fixos de desenvolvimento chamados Sprints.'),
    ('B', 'Otimizar o fluxo de trabalho, identificar gargalos e reduzir desperdícios de tempo.'),
    ('C', 'Definir cargos e funções obrigatórias para todos os integrantes da equipe.'),
    ('D', 'Aumentar a quantidade de tarefas iniciadas simultaneamente.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'Qual é o principal objetivo do Kanban dentro de uma equipe de trabalho?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a importância da visualização do fluxo de trabalho e da limitação do WIP no Kanban?' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Permitir que cada funcionário trabalhe isoladamente, sem depender dos demais.'),
    ('B', 'Organizar as tarefas apenas depois que elas forem concluídas.'),
    ('C', 'Facilitar a visualização das etapas e incentivar a equipe a terminar tarefas antes de iniciar novas.'),
    ('D', 'Eliminar a necessidade de acompanhar o andamento das atividades.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'Qual é a importância da visualização do fluxo de trabalho e da limitação do WIP no Kanban?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que acontece quando o Kanban utiliza um sistema puxado e acompanha métricas como o Lead Time?' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'As tarefas são distribuídas sem considerar a capacidade da equipe.'),
    ('B', 'O trabalho só entra no fluxo quando existe capacidade disponível, permitindo entregas mais previsíveis.'),
    ('C', 'A equipe precisa concluir todas as tarefas ao mesmo tempo.'),
    ('D', 'O Lead Time determina quantos funcionários devem participar de cada atividade.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'O que acontece quando o Kanban utiliza um sistema puxado e acompanha métricas como o Lead Time?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a consequência de estabelecer um limite de WIP na coluna "Em Teste" quando ela já atingiu sua capacidade máxima?' FROM tema WHERE nome_tema = 'Kanban'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'A equipe continua desenvolvendo novas tarefas normalmente.'),
    ('B', 'As tarefas acumuladas são automaticamente removidas do sistema.'),
    ('C', 'Os desenvolvedores são incentivados a colaborar nos testes para liberar espaço no fluxo.'),
    ('D', 'O gerente precisa aumentar obrigatoriamente o número de funcionários.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Kanban' AND q.enunciado = 'Qual é a consequência de estabelecer um limite de WIP na coluna "Em Teste" quando ela já atingiu sua capacidade máxima?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal diferença entre o Planejamento Ágil e os modelos tradicionais de planejamento?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O Planejamento Ágil exige que todos os detalhes do projeto sejam definidos antes do início.'),
    ('B', 'O Planejamento Ágil elimina a necessidade de estabelecer objetivos para o projeto.'),
    ('C', 'O Planejamento Ágil trata o planejamento como uma atividade contínua, permitindo adaptações conforme surgem mudanças.'),
    ('D', 'O Planejamento Ágil utiliza documentos rígidos que não podem ser modificados durante o projeto.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'Qual é a principal diferença entre o Planejamento Ágil e os modelos tradicionais de planejamento?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a função da Cebola do Planejamento Ágil (Agile Planning Onion)?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Dividir o planejamento em camadas que representam diferentes horizontes de tempo, do longo ao curtíssimo prazo.'),
    ('B', 'Organizar os funcionários de acordo com seus níveis de experiência.'),
    ('C', 'Determinar exclusivamente o orçamento necessário para cada Sprint.'),
    ('D', 'Substituir o planejamento diário por um planejamento anual.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'Qual é a função da Cebola do Planejamento Ágil (Agile Planning Onion)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Como o uso de estimativas ágeis e da medição da velocidade da equipe contribui para o Planejamento Ágil?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Impede que o projeto sofra alterações durante seu desenvolvimento.'),
    ('B', 'Permite estabelecer prazos com base em dados reais, mantendo a flexibilidade para mudanças e inovações.'),
    ('C', 'Garante que todas as tarefas sejam concluídas exatamente no mesmo período.'),
    ('D', 'Elimina a necessidade de acompanhar os resultados de cada ciclo.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'Como o uso de estimativas ágeis e da medição da velocidade da equipe contribui para o Planejamento Ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'No Planejamento Ágil, como o Roadmap é utilizado em relação às entregas futuras?' FROM tema WHERE nome_tema = 'Planejamento Ágil'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Como um documento definitivo que não permite alterações nas entregas.'),
    ('B', 'Como uma ferramenta utilizada apenas para organizar as tarefas diárias.'),
    ('C', 'Como uma forma de substituir as reuniões de planejamento das Sprints.'),
    ('D', 'Como uma projeção de médio prazo, cujos detalhes são ajustados conforme o momento das entregas se aproxima.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Planejamento Ágil' AND q.enunciado = 'No Planejamento Ágil, como o Roadmap é utilizado em relação às entregas futuras?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal objetivo das Métricas Ágeis dentro de uma equipe?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Vigiar individualmente os funcionários e controlar as horas trabalhadas.'),
    ('B', 'Punir os integrantes que não conseguem concluir suas tarefas rapidamente.'),
    ('C', 'Fornecer dados reais para avaliar o fluxo de trabalho e promover melhorias contínuas.'),
    ('D', 'Aumentar a quantidade de tarefas iniciadas durante cada ciclo.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Qual é o principal objetivo das Métricas Ágeis dentro de uma equipe?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a diferença entre Lead Time e Cycle Time nas Métricas Ágeis?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Lead Time mede as horas trabalhadas, enquanto Cycle Time mede os custos do projeto.'),
    ('B', 'Lead Time mede o tempo desde o nascimento do pedido até a entrega, enquanto Cycle Time mede o tempo desde o início efetivo do trabalho até sua conclusão.'),
    ('C', 'Lead Time mede a quantidade de funcionários, enquanto Cycle Time mede a quantidade de reuniões.'),
    ('D', 'Ambos medem exclusivamente o número de tarefas concluídas durante uma Sprint.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Qual é a diferença entre Lead Time e Cycle Time nas Métricas Ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal finalidade de utilizar métricas ágeis, como ferramentas de transparência e tomada de decisões?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Identificar problemas no processo, melhorar estimativas e acompanhar o valor entregue ao cliente.'),
    ('B', 'Substituir todas as reuniões da equipe por relatórios automáticos.'),
    ('C', 'Avaliar exclusivamente o desempenho individual de cada funcionário.'),
    ('D', 'Garantir que todas as tarefas sejam iniciadas ao mesmo tempo.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Qual é a principal finalidade de utilizar métricas ágeis, como ferramentas de transparência e tomada de decisões?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Para que serve o Cumulative Flow Diagram (CFD) na análise das métricas ágeis?' FROM tema WHERE nome_tema = 'Métricas Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Calcular o salário dos integrantes da equipe com base na produtividade.'),
    ('B', 'Determinar quantas horas cada funcionário precisa trabalhar diariamente.'),
    ('C', 'Organizar os integrantes conforme suas funções dentro do projeto.'),
    ('D', 'Visualizar o fluxo de trabalho, identificar acúmulos de tarefas e antecipar possíveis atrasos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Métricas Ágeis' AND q.enunciado = 'Para que serve o Cumulative Flow Diagram (CFD) na análise das métricas ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal foco da metodologia Extreme Programming (XP) no desenvolvimento de software?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Organizar exclusivamente reuniões e distribuir tarefas entre os funcionários.'),
    ('B', 'Priorizar a documentação extensa antes de iniciar qualquer desenvolvimento.'),
    ('C', 'Concentrar-se na excelência técnica e na qualidade do software, permitindo adaptações às mudanças de requisitos.'),
    ('D', 'Evitar alterações no código depois que o desenvolvimento começa.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'Qual é o principal foco da metodologia Extreme Programming (XP) no desenvolvimento de software?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Quais são os cinco valores essenciais do Extreme Programming (XP)?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Comunicação, simplicidade, feedback, coragem e respeito.'),
    ('B', 'Planejamento, organização, liderança, produtividade e controle.'),
    ('C', 'Qualidade, velocidade, documentação, hierarquia e segurança.'),
    ('D', 'Comunicação, competitividade, planejamento, inovação e disciplina.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'Quais são os cinco valores essenciais do Extreme Programming (XP)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal característica das práticas de Integração Contínua (CI) e design simples no XP?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Desenvolver todo o sistema antes de realizar os primeiros testes.'),
    ('B', 'Evitar alterações frequentes no código para diminuir os riscos.'),
    ('C', 'Criar funcionalidades futuras antecipadamente para evitar novos desenvolvimentos.'),
    ('D', 'Integrar e testar alterações frequentemente, desenvolvendo apenas o necessário para o momento atual.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'Qual é a principal característica das práticas de Integração Contínua (CI) e design simples no XP?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Como a prática do design simples contribui para o desenvolvimento de software no XP?' FROM tema WHERE nome_tema = 'Extreme Programming (XP)'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Incentiva a criação de arquiteturas complexas para prever todas as funcionalidades futuras.'),
    ('B', 'Busca resolver os problemas atuais com soluções simples e elegantes, evitando complexidade desnecessária.'),
    ('C', 'Elimina a necessidade de testes automatizados durante o desenvolvimento.'),
    ('D', 'Impede que o sistema receba novas funcionalidades depois de concluído.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Extreme Programming (XP)' AND q.enunciado = 'Como a prática do design simples contribui para o desenvolvimento de software no XP?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal papel das ferramentas utilizadas pelas equipes ágeis?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Substituir a comunicação entre os integrantes por processos automatizados.'),
    ('B', 'Tornar uma empresa ágil automaticamente após a aquisição de softwares especializados.'),
    ('C', 'Controlar individualmente o desempenho dos funcionários.'),
    ('D', 'Apoiar a colaboração, centralizar informações e proporcionar transparência ao fluxo de trabalho.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'Qual é o principal papel das ferramentas utilizadas pelas equipes ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal diferença entre as ferramentas de gestão de fluxo e as ferramentas de colaboração visual?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'As ferramentas de gestão organizam tarefas, Backlogs e métricas, enquanto as de colaboração visual facilitam reuniões, ideias e atividades em grupo.'),
    ('B', 'As ferramentas de gestão são utilizadas exclusivamente para comunicação, enquanto as visuais servem para controlar horários.'),
    ('C', 'Ambas possuem a mesma finalidade e são utilizadas apenas para desenvolver códigos.'),
    ('D', 'As ferramentas visuais substituem completamente o planejamento e a gestão das tarefas.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'Qual é a principal diferença entre as ferramentas de gestão de fluxo e as ferramentas de colaboração visual?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual característica é fundamental para escolher e utilizar uma boa ferramenta ágil?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Possuir o maior número possível de funcionalidades e campos obrigatórios.'),
    ('B', 'Exigir atualizações constantes e processos burocráticos para registrar tarefas.'),
    ('C', 'Ser simples, fácil de atualizar e representar fielmente a realidade do trabalho da equipe.'),
    ('D', 'Impedir alterações no fluxo de trabalho depois que o projeto começar.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'Qual característica é fundamental para escolher e utilizar uma boa ferramenta ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Por que o excesso de customização em ferramentas como Jira e Azure DevOps pode prejudicar uma equipe ágil?' FROM tema WHERE nome_tema = 'Ferramentas para Equipes Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Porque impede que os funcionários tenham acesso às informações do projeto.'),
    ('B', 'Porque cria burocracias e obrigações excessivas, fazendo com que a equipe perca mais tempo alimentando o sistema do que colaborando.'),
    ('C', 'Porque elimina automaticamente todas as funcionalidades de gestão do software.'),
    ('D', 'Porque impede a utilização de métricas como Lead Time e Burndown.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Ferramentas para Equipes Ágeis' AND q.enunciado = 'Por que o excesso de customização em ferramentas como Jira e Azure DevOps pode prejudicar uma equipe ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal objetivo de adotar boas práticas em projetos ágeis?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Seguir rigidamente um manual, sem permitir adaptações durante o projeto.'),
    ('B', 'Utilizar os nomes e eventos do Scrum, mesmo mantendo métodos tradicionais de trabalho.'),
    ('C', 'Desenvolver hábitos de disciplina, transparência e melhoria contínua, garantindo que a equipe realmente trabalhe de forma ágil.'),
    ('D', 'Priorizar a quantidade de tarefas realizadas, independentemente da qualidade das entregas.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'Qual é o principal objetivo de adotar boas práticas em projetos ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a finalidade do critério INVEST e das definições DoR e DoD em projetos ágeis?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O INVEST avalia o desempenho individual, enquanto DoR e DoD controlam os horários da equipe.'),
    ('B', 'O INVEST ajuda a garantir a qualidade das Histórias de Usuário, o DoR verifica se o trabalho está pronto para começar e o DoD estabelece os critérios para considerar uma entrega concluída.'),
    ('C', 'O INVEST organiza as reuniões, enquanto DoR e DoD determinam a duração das Sprints.'),
    ('D', 'O INVEST define o orçamento do projeto, enquanto DoR e DoD substituem o Product Backlog.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'Qual é a finalidade do critério INVEST e das definições DoR e DoD em projetos ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Por que o refinamento do Backlog, o ritmo sustentável e a segurança psicológica são importantes para uma equipe ágil?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Porque permitem eliminar todas as reuniões e impedir que ocorram erros durante o desenvolvimento.'),
    ('B', 'Porque garantem que os integrantes trabalhem sempre sob pressão para aumentar a produtividade.'),
    ('C', 'Porque substituem a necessidade de planejamento e acompanhamento das tarefas.'),
    ('D', 'Porque melhoram a organização do trabalho, evitam sobrecargas e permitem que os integrantes identifiquem problemas sem medo de punições.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'Por que o refinamento do Backlog, o ritmo sustentável e a segurança psicológica são importantes para uma equipe ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que pode acontecer quando uma equipe inicia uma tarefa sem que ela atenda aos critérios mínimos da Definição de Pronto (DoR)?' FROM tema WHERE nome_tema = 'Boas Práticas em Projetos Ágeis'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Podem surgir dúvidas, impedimentos técnicos e atrasos durante a Sprint, prejudicando o fluxo de trabalho.'),
    ('B', 'A tarefa será concluída automaticamente com maior qualidade.'),
    ('C', 'O tempo de desenvolvimento será reduzido obrigatoriamente.'),
    ('D', 'A equipe não precisará realizar reuniões de alinhamento durante a Sprint.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Boas Práticas em Projetos Ágeis' AND q.enunciado = 'O que pode acontecer quando uma equipe inicia uma tarefa sem que ela atenda aos critérios mínimos da Definição de Pronto (DoR)?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

COMMIT;
