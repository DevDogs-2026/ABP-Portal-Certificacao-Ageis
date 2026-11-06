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
SELECT id_tema, 'Qual é o principal objetivo das metodologias ágeis?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Eliminar completamente o planejamento.'),
    ('B', 'Entregar valor continuamente e adaptar-se às mudanças.'),
    ('C', 'Aumentar a documentação dos projetos.'),
    ('D', 'Evitar a participação do cliente.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Qual é o principal objetivo das metodologias ágeis?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Quantos valores fundamentais possui o Manifesto Ágil?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', '3'),
    ('B', '5'),
    ('C', '4'),
    ('D', '6')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Quantos valores fundamentais possui o Manifesto Ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual das alternativas representa um valor do Manifesto Ágil?' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Indivíduos e interações mais que processos e ferramentas.'),
    ('B', 'Seguir um plano mais que responder a mudanças.'),
    ('C', 'Documentação abrangente mais que software funcionando.'),
    ('D', 'Negociação de contratos mais que colaboração com o cliente.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Qual das alternativas representa um valor do Manifesto Ágil?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Uma característica importante das equipes ágeis é:' FROM tema WHERE nome_tema = 'Fundamentos da Agilidade'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Trabalhar sem comunicação.'),
    ('B', 'Depender exclusivamente do gerente.'),
    ('C', 'Evitar alterações durante o projeto.'),
    ('D', 'Colaborar e adaptar-se às necessidades.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Fundamentos da Agilidade' AND q.enunciado = 'Uma característica importante das equipes ágeis é:'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que é Scrum?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Uma linguagem de programação.'),
    ('B', 'Um software de gerenciamento.'),
    ('C', 'Um framework ágil para desenvolver e entregar produtos complexos.'),
    ('D', 'Um banco de dados.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'O que é Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Como são chamados os ciclos de trabalho no Scrum?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Sprints.'),
    ('B', 'Etapas fixas.'),
    ('C', 'Processos.'),
    ('D', 'Módulos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'Como são chamados os ciclos de trabalho no Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a duração máxima de uma Sprint?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', '3 meses.'),
    ('B', '2 meses.'),
    ('C', '6 semanas.'),
    ('D', '1 mês.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'Qual é a duração máxima de uma Sprint?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é um dos principais pilares do Scrum?' FROM tema WHERE nome_tema = 'Introdução ao Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Hierarquia.'),
    ('B', 'Transparência.'),
    ('C', 'Burocracia.'),
    ('D', 'Centralização.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Introdução ao Scrum' AND q.enunciado = 'Qual é um dos principais pilares do Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Quem é responsável por maximizar o valor do produto?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Scrum Master.'),
    ('B', 'Desenvolvedor.'),
    ('C', 'Product Owner.'),
    ('D', 'Cliente.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'Quem é responsável por maximizar o valor do produto?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é a principal responsabilidade do Scrum Master?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Estabelecer o Scrum e ajudar a equipe a utilizá-lo corretamente.'),
    ('B', 'Desenvolver todo o código.'),
    ('C', 'Aprovar todas as funcionalidades.'),
    ('D', 'Controlar individualmente cada funcionário.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'Qual é a principal responsabilidade do Scrum Master?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Quem é responsável por criar um Incremento utilizável a cada Sprint?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Cliente.'),
    ('B', 'Gerente financeiro.'),
    ('C', 'Product Owner exclusivamente.'),
    ('D', 'Developers.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'Quem é responsável por criar um Incremento utilizável a cada Sprint?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Quais são as três responsabilidades principais dentro de um Scrum Team?' FROM tema WHERE nome_tema = 'Papéis do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Gerente, Analista e Cliente.'),
    ('B', 'Product Owner, Scrum Master e Developers.'),
    ('C', 'Diretor, Coordenador e Supervisor.'),
    ('D', 'Programador, Designer e Testador.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Papéis do Scrum' AND q.enunciado = 'Quais são as três responsabilidades principais dentro de um Scrum Team?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual evento é utilizado para planejar o trabalho da Sprint?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Sprint Review.'),
    ('B', 'Daily Scrum.'),
    ('C', 'Sprint Retrospective.'),
    ('D', 'Sprint Planning.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'Qual evento é utilizado para planejar o trabalho da Sprint?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o tempo máximo de duração da Daily Scrum?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', '15 minutos.'),
    ('B', '30 minutos.'),
    ('C', '1 hora.'),
    ('D', '2 horas.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'Qual é o tempo máximo de duração da Daily Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual é o principal objetivo da Sprint Review?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Avaliar individualmente os funcionários.'),
    ('B', 'Definir salários da equipe.'),
    ('C', 'Inspecionar o resultado da Sprint e discutir adaptações futuras.'),
    ('D', 'Substituir o planejamento da Sprint.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'Qual é o principal objetivo da Sprint Review?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que acontece durante a Sprint Retrospective?' FROM tema WHERE nome_tema = 'Eventos do Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'O cliente realiza o pagamento.'),
    ('B', 'A equipe identifica maneiras de melhorar sua qualidade e eficácia.'),
    ('C', 'O projeto é obrigatoriamente encerrado.'),
    ('D', 'Todos os requisitos são descartados.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Eventos do Scrum' AND q.enunciado = 'O que acontece durante a Sprint Retrospective?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Quais são os três artefatos oficiais do Scrum?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Product Backlog, Sprint Backlog e Increment.'),
    ('B', 'Kanban, Daily Scrum e Sprint Planning.'),
    ('C', 'Cronograma, Relatório e Contrato.'),
    ('D', 'Sprint Review, Daily Scrum e Retrospective.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'Quais são os três artefatos oficiais do Scrum?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que representa o Product Backlog?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Uma lista de funcionários.'),
    ('B', 'Um relatório financeiro.'),
    ('C', 'Um histórico de reuniões.'),
    ('D', 'Uma lista ordenada do que é necessário para melhorar o produto.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'O que representa o Product Backlog?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O Sprint Backlog contém:' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Apenas os problemas encontrados.'),
    ('B', 'O objetivo da Sprint, os itens selecionados e o plano de entrega.'),
    ('C', 'Somente as tarefas concluídas.'),
    ('D', 'Todas as funcionalidades de projetos futuros.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'O Sprint Backlog contém:'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que é um Increment no Scrum?' FROM tema WHERE nome_tema = 'Artefatos Scrum'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Uma reunião semanal.'),
    ('B', 'Um documento de planejamento.'),
    ('C', 'Uma parte utilizável do produto que atende à Definition of Done.'),
    ('D', 'Uma lista de requisitos não aprovados.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Artefatos Scrum' AND q.enunciado = 'O que é um Increment no Scrum?'
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
SELECT id_tema, 'Quem é responsável pela gestão eficaz do Product Backlog?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'C'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Scrum Master.'),
    ('B', 'Cliente.'),
    ('C', 'Product Owner.'),
    ('D', 'Gerente de recursos humanos.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Quem é responsável pela gestão eficaz do Product Backlog?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'O que significa realizar o refinamento do Product Backlog?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'A'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Detalhar e dividir itens para melhorar seu entendimento.'),
    ('B', 'Excluir todas as tarefas antigas.'),
    ('C', 'Encerrar automaticamente a Sprint.'),
    ('D', 'Substituir os desenvolvedores.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'O que significa realizar o refinamento do Product Backlog?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual característica é importante para um Product Backlog eficiente?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'D'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'Nunca sofrer alterações.'),
    ('B', 'Ser conhecido apenas pelo gerente.'),
    ('C', 'Conter exclusivamente tarefas concluídas.'),
    ('D', 'Ser transparente, ordenado e continuamente atualizado.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Qual característica é importante para um Product Backlog eficiente?'
ON CONFLICT (id_questao, letra) DO UPDATE SET texto_alternativa = EXCLUDED.texto_alternativa, correta = EXCLUDED.correta;

INSERT INTO questao (id_tema, enunciado)
SELECT id_tema, 'Qual fator pode influenciar a ordenação dos itens do Product Backlog?' FROM tema WHERE nome_tema = 'Gestão do Product Backlog'
ON CONFLICT (id_tema, enunciado) DO NOTHING;
INSERT INTO alternativa (id_questao, letra, texto_alternativa, correta)
SELECT q.id_questao, opcoes.letra, opcoes.texto, opcoes.letra = 'B'
FROM questao q JOIN tema t ON t.id_tema = q.id_tema
CROSS JOIN (VALUES
    ('A', 'A ordem alfabética dos desenvolvedores.'),
    ('B', 'O valor de negócio, os riscos e as dependências.'),
    ('C', 'A quantidade de reuniões realizadas.'),
    ('D', 'A preferência pessoal do Scrum Master.')
) AS opcoes(letra, texto)
WHERE t.nome_tema = 'Gestão do Product Backlog' AND q.enunciado = 'Qual fator pode influenciar a ordenação dos itens do Product Backlog?'
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
