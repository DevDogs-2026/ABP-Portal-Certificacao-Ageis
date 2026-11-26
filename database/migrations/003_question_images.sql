-- DogSchool: vincula as 48 imagens existentes a suas respectivas questoes.
-- Seguro para dados anteriores: modifica somente questao.imagem_url.
-- Reexecutavel sem duplicar dados nem alterar avaliacoes.
BEGIN;

WITH m(nome_tema, enunciado, imagem_url) AS (
  VALUES
    ('Fundamentos da Agilidade', 'Por que o modelo tradicional de gestão gera frustração quando ocorrem mudanças?', '/api/questoes/questao01.webp'),
    ('Fundamentos da Agilidade', 'De acordo com o Manifesto Ágil, o que deve ser priorizado para garantir o sucesso de um projeto?', '/api/questoes/questao02.webp'),
    ('Fundamentos da Agilidade', 'Qual é o maior benefício de adotar uma equipe multidisciplinar e auto-organizável na cultura ágil?', '/api/questoes/questao03.webp'),
    ('Fundamentos da Agilidade', 'Na cultura ágil, como muda o papel das lideranças corporativas em comparação ao modelo tradicional?', '/api/questoes/questao04.webp'),
    ('Introdução ao Scrum', 'Qual é a principal proposta do Scrum para lidar com a impossibilidade de prever tudo no início de um projeto?', '/api/questoes/questao05.webp'),
    ('Introdução ao Scrum', 'O que sustenta e permite o funcionamento real dos três pilares do Scrum no ambiente de trabalho?', '/api/questoes/questao06.webp'),
    ('Introdução ao Scrum', 'Como se divide a responsabilidade pelo resultado final do produto?', '/api/questoes/questao07.webp'),
    ('Introdução ao Scrum', 'Qual evento serve para o time se alinhar diariamente em uma conversa rápida de quinze minutos?', '/api/questoes/questao08.webp'),
    ('Papéis do Scrum', 'Como funciona a estrutura de decisão dentro de uma Equipe Scrum?', '/api/questoes/questao09.webp'),
    ('Papéis do Scrum', 'Qual é o papel responsável por remover os impedimentos e barreiras que bloqueiam o progresso da equipe?', '/api/questoes/questao10.webp'),
    ('Papéis do Scrum', 'De quem é a responsabilidade pelo sucesso ou fracasso de um projeto no Scrum?', '/api/questoes/questao11.webp'),
    ('Papéis do Scrum', 'O que acontece com uma equipe Scrum quando as fronteiras de responsabilidade de cada papel não são respeitadas?', '/api/questoes/questao12.webp'),
    ('Eventos do Scrum', 'No framework Scrum, qual é a principal característica e o papel da Sprint?', '/api/questoes/questao13.webp'),
    ('Eventos do Scrum', 'Qual é o objetivo da Daily Scrum segundo a Imagem?', '/api/questoes/questao14.webp'),
    ('Eventos do Scrum', 'O que o time faz durante a Sprint Retrospective?', '/api/questoes/questao15.webp'),
    ('Eventos do Scrum', 'Qual é o principal benefício de definir um timebox para os eventos do Scrum?', '/api/questoes/questao16.webp'),
    ('Artefatos Scrum', 'O que os Artefatos do Scrum realmente representam?', '/api/questoes/questao17.webp'),
    ('Artefatos Scrum', 'Qual é a principal diferença entre os compromissos do Product Backlog e do Sprint Backlog?', '/api/questoes/questao18.webp'),
    ('Artefatos Scrum', 'Qual é a função da Definição de Concluído (Definition of Done)?', '/api/questoes/questao19.webp'),
    ('Artefatos Scrum', 'O que acontece quando os artefatos do Scrum funcionam como radiadores de informação?', '/api/questoes/questao20.webp'),
    ('Gestão do Product Backlog', 'Qual é o principal objetivo da Gestão do Product Backlog em projetos ágeis?', '/api/questoes/questao21.webp'),
    ('Gestão do Product Backlog', 'Qual é o objetivo do refinamento do Product Backlog e o significado do acrônimo DEEP?', '/api/questoes/questao22.webp'),
    ('Gestão do Product Backlog', 'Qual é o principal papel da priorização na Gestão do Product Backlog?', '/api/questoes/questao23.webp'),
    ('Gestão do Product Backlog', 'Por que o Product Backlog deve ser constantemente atualizado?', '/api/questoes/questao24.webp'),
    ('Kanban', 'Em comparação ao Scrum, a abordagem de implementação do método Kanban é caracterizada como flexível e evolucionária porque se fundamenta na prática de:', '/api/questoes/questao25.webp'),
    ('Kanban', 'A prática guiada pela máxima "pare de começar e comece a terminar", que aumenta a eficiência da equipe ao impedir que várias tarefas sejam abertas simultaneamente sem conclusão, é conhecida como:', '/api/questoes/questao26.webp'),
    ('Kanban', 'Limitar o trabalho em andamento (WIP) serve para controlar quantas tarefas são feitas ao mesmo tempo. Assim, novas tarefas só começam quando a equipe tem espaço livre para fazê-las. Qual é o principal objetivo dessa prática?', '/api/questoes/questao27.webp'),
    ('Kanban', 'O limite de WIP ajuda a mostrar onde o trabalho está travando. Quando uma etapa atinge o limite máximo, novas tarefas ficam bloqueadas e a equipe se une para resolver o acúmulo. Qual é o principal resultado dessa prática?', '/api/questoes/questao28.webp'),
    ('Planejamento Ágil', 'Em comparação aos modelos tradicionais, qual é a principal diferença na abordagem do Planejamento Ágil?', '/api/questoes/questao29.webp'),
    ('Planejamento Ágil', 'No modelo da "Cebola do Planejamento Ágil", qual é a relação entre o horizonte de tempo e o nível de detalhe do plano?', '/api/questoes/questao30.webp'),
    ('Planejamento Ágil', 'No Planejamento Ágil, a capacidade da equipe de recalcular o percurso diante de obstáculos ou oportunidades sem perder o objetivo final assemelha-se ao funcionamento de um GPS porque o time:', '/api/questoes/questao31.webp'),
    ('Planejamento Ágil', 'No Planejamento Ágil, como a visão de futuro e as entregas de médio prazo são tratadas em comparação aos métodos tradicionais?', '/api/questoes/questao32.webp'),
    ('Métricas Ágeis', 'Qual métrica mede o tempo total desde o momento em que um pedido nasce até ser entregue ao cliente, e qual ferramenta visual ajuda a ver instantaneamente se o trabalho está acumulando em alguma etapa?', '/api/questoes/questao33.webp'),
    ('Métricas Ágeis', 'Qual é o principal benefício das métricas ágeis e como o sucesso deve ser medido?', '/api/questoes/questao34.webp'),
    ('Métricas Ágeis', 'Na análise de métricas ágeis, qual é a principal função do Cumulative Flow Diagram (CFD)?', '/api/questoes/questao35.webp'),
    ('Métricas Ágeis', 'Diferente dos modelos tradicionais, qual é o objetivo principal de utilizar Métricas Ágeis em um time?', '/api/questoes/questao36.webp'),
    ('Extreme Programming (XP)', 'Qual é o foco principal da metodologia Extreme Programming (XP) em comparação a frameworks de gestão de processo como o Scrum?', '/api/questoes/questao37.webp'),
    ('Extreme Programming (XP)', 'No XP, como atuam o TDD e a Programação em Par?', '/api/questoes/questao38.webp'),
    ('Extreme Programming (XP)', 'No XP, qual é o propósito da Integração Contínua (CI) e do design simples?', '/api/questoes/questao39.webp'),
    ('Extreme Programming (XP)', 'No Extreme Programming (XP), como o design simples lida com a arquitetura do software?', '/api/questoes/questao40.webp'),
    ('Ferramentas para Equipes Ágeis', 'Qual é o papel adequado das ferramentas de software no contexto das equipes ágeis?', '/api/questoes/questao41.webp'),
    ('Ferramentas para Equipes Ágeis', 'De acordo com o infográfico, como as ferramentas ágeis se dividem para apoiar a equipe?', '/api/questoes/questao42.webp'),
    ('Ferramentas para Equipes Ágeis', 'Segundo as boas práticas no uso de ferramentas ágeis, a principal função dessas tecnologias deve ser?', '/api/questoes/questao43.webp'),
    ('Ferramentas para Equipes Ágeis', 'De acordo com a imagem, o que acontece quando há excesso de configuração nas ferramentas ágeis?', '/api/questoes/questao44.webp'),
    ('Boas Práticas em Projetos Ágeis', 'Sobre a transição para metodologias ágeis, assinale a alternativa que representa a verdadeira essência da agilidade:', '/api/questoes/questao45.webp'),
    ('Boas Práticas em Projetos Ágeis', 'No fluxo de trabalho ágil, qual é a função das definições DoR (Definition of Ready) e DoD (Definition of Done)?', '/api/questoes/questao46.webp'),
    ('Boas Práticas em Projetos Ágeis', 'No âmbito da liderança e sustentabilidade em equipes ágeis, qual é o papel da segurança psicológica e do refinamento contínuo?', '/api/questoes/questao47.webp'),
    ('Boas Práticas em Projetos Ágeis', 'Qual é a consequência apontada para a equipe quando se decide iniciar um item de backlog que não atende aos critérios mínimos de DoR (Definition of Ready)?', '/api/questoes/questao48.webp')
)
UPDATE questao q
SET imagem_url = m.imagem_url
FROM tema t, m
WHERE q.id_tema = t.id_tema
  AND t.nome_tema = m.nome_tema
  AND q.enunciado = m.enunciado
  AND q.imagem_url IS DISTINCT FROM m.imagem_url;

SELECT COUNT(*) AS total_questoes,
       COUNT(*) FILTER (WHERE imagem_url LIKE '/api/questoes/questao%.webp') AS com_imagem
FROM questao;
COMMIT;
