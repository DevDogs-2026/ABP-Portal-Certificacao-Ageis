# Retrospectiva da Sprint 3 — Portal de Certificação em Metodologias Ágeis

**Projeto:** Portal de Certificação em Metodologias Ágeis  
**Contexto:** Projeto acadêmico — 1º semestre de Desenvolvimento de Software Multiplataforma (DSM)  
**Período de referência:** Sprint 3 — novembro de 2026  
**Objetivo da retrospectiva:** Refletir sobre o processo de trabalho da equipe, identificar dificuldades, avaliar a evolução das práticas adotadas e definir melhorias para as próximas etapas do projeto.

> **Nota:** As ações propostas para as próximas etapas representam oportunidades de melhoria, não atividades já concluídas.

## 1. O que aprendemos

### Organização da equipe e divisão de responsabilidades

Contrariamente à abordagem inicial do projeto, na qual todos os integrantes realizavam diferentes tipos de atividades, envolvendo frontend, backend, modelagem, Figma e banco de dados, durante a Sprint 3 a equipe adotou uma divisão de responsabilidades por área de atuação.

| Área | Integrantes | Responsabilidades |
|---|---|---|
| Frontend | Gabriel, Hector e João | Desenvolvimento do frontend. |
| Backend | Igor, Marcos e Vitor | Desenvolvimento do backend. |
| Integração com Docker | Equipes de frontend e backend | Integração conjunta dos componentes da aplicação. |
| Gestão do projeto | Lucas — Scrum Master | Monitoramento das atividades, registros, documentação, criação de issues, treinamento e direcionamento da equipe. |

A mudança buscou proporcionar maior continuidade nas atividades de cada integrante e reduzir a alternância entre diferentes áreas técnicas. A integração com Docker permaneceu uma responsabilidade compartilhada, reforçando a necessidade de colaboração entre as equipes.

O principal aprendizado foi que a distribuição de atividades por afinidade técnica pode favorecer a organização do trabalho, desde que seja preservada a responsabilidade coletiva pelo incremento e evitado o isolamento entre as áreas.

### Aderência e regularidade do Daily Scrum

As dificuldades relacionadas à realização do Daily Scrum permaneceram durante a Sprint 3, principalmente devido à incompatibilidade de horários e à disponibilidade dos integrantes.

Como alternativa, a equipe adotou registros individuais e assíncronos pelo Microsoft Teams, realizados conforme a disponibilidade de cada integrante, buscando manter uma constância diária. Esses registros eram coletados pelo Scrum Master, Lucas, que acompanhava as informações e encaminhava as necessidades identificadas quando necessário.

Essa adaptação permitiu manter um canal de acompanhamento das atividades mesmo diante das limitações de horário. Entretanto, os registros assíncronos não substituem integralmente a interação coletiva do Daily Scrum, especialmente quanto à inspeção conjunta do progresso e à adaptação do plano de trabalho pelos desenvolvedores.

### Consolidação do quadro Kanban

O quadro Kanban do GitHub Projects tornou-se o principal direcionador das atividades da Sprint, centralizando as informações necessárias à organização e ao acompanhamento do trabalho.

Cada integrante ficou responsável por identificar os cartões relacionados à sua área de atuação, acompanhar suas atividades e observar eventuais necessidades de criação de novos cartões.

O aprendizado foi que o Kanban deve funcionar não apenas como instrumento de acompanhamento da gestão, mas também como referência operacional para a equipe, favorecendo a autonomia, a transparência e a identificação de necessidades durante o desenvolvimento.

### Padronização do fluxo de trabalho no GitHub

Foi realizado um treinamento presencial com os integrantes da equipe para orientar a utilização dos cartões do Kanban como ponto de partida das atividades de desenvolvimento e estabelecer um fluxo compartilhado de versionamento e revisão.

O procedimento apresentado compreendeu as seguintes etapas:

1. Identificar o cartão correspondente à atividade no Kanban.
2. Criar uma branch independente para o desenvolvimento da atividade.
3. Implementar as alterações e registrar os commits correspondentes.
4. Abrir um Pull Request direcionado à branch `dev`.
5. Disponibilizar o Pull Request para revisão por outro integrante da equipe.
6. Realizar a revisão e, quando atendidas as condições necessárias, aprovar e integrar as alterações à branch `dev`.

O cartão `[TESTE]` foi utilizado como referência para exemplificar o preenchimento e a utilização das informações dos cartões, disponibilizando também um procedimento passo a passo para a realização de Pull Requests.

Essa iniciativa representa uma evolução em relação às dificuldades de versionamento e utilização do Kanban identificadas na Sprint 1. O treinamento estabeleceu um procedimento comum, cuja aplicação consistente deve continuar sendo acompanhada.

## 2. O que funcionou bem

- Divisão das atividades por área de atuação, com responsabilidades mais claramente estabelecidas.
- Colaboração entre frontend e backend nas atividades de integração com Docker.
- Centralização das informações e direcionamento das atividades por meio do Kanban.
- Participação dos integrantes na identificação de necessidades de criação de novos cartões.
- Realização de treinamento presencial sobre o fluxo de desenvolvimento e versionamento no GitHub.
- Disponibilização do cartão `[TESTE]` como referência prática para utilização do Kanban e realização de Pull Requests.
- Definição de um fluxo de revisão por outro integrante antes da integração das alterações à branch `dev`.
- Adoção de registros individuais pelo Microsoft Teams como alternativa diante da incompatibilidade de horários.
- Acompanhamento dos registros e encaminhamento das necessidades identificadas pelo Scrum Master.

## 3. O que pode melhorar

| Ponto de atenção | Impacto observado ou risco identificado | Melhoria proposta |
|---|---|---|
| Daily Scrum | Incompatibilidade de horários e dificuldade de alinhamento coletivo diário. | Buscar uma janela comum de até 15 minutos e manter os registros assíncronos como apoio quando necessário. |
| Divisão por áreas | Risco de concentração de conhecimento e isolamento entre frontend e backend. | Promover compartilhamento de conhecimento e alinhamentos sobre dependências técnicas. |
| Integração com Docker | Dependência de colaboração entre as áreas técnicas. | Realizar verificações conjuntas e documentar procedimentos de execução e integração. |
| Utilização do Kanban | Risco de divergência entre o estado dos cartões e o progresso real. | Manter os cartões atualizados e registrar novas necessidades identificadas. |
| Fluxo de versionamento | Risco de aplicação inconsistente do procedimento apresentado no treinamento. | Vincular Pull Requests às issues e acompanhar a revisão por outro integrante antes do merge. |
| Comunicação e acompanhamento | Risco de concentração das informações no Scrum Master. | Incentivar a comunicação direta entre os desenvolvedores e dar visibilidade aos impedimentos e encaminhamentos. |

## 4. Plano de ação para as próximas etapas

| Ação | Responsável sugerido | Prazo sugerido | Critério de conclusão |
|---|---|---|---|
| Buscar um horário comum para o Daily Scrum. | Desenvolvedores, com apoio do Scrum Master | Próximo alinhamento da equipe | Horário acordado ou alternativa de acompanhamento definida. |
| Manter os registros individuais de acompanhamento quando necessário. | Desenvolvedores | Diariamente | Registros com progresso, próximas atividades, issues relacionadas e impedimentos. |
| Acompanhar e encaminhar os impedimentos identificados. | Scrum Master e desenvolvedores | Durante a execução das atividades | Impedimentos registrados, encaminhados e acompanhados até sua resolução. |
| Manter o Kanban como referência operacional. | Toda a equipe | Durante a execução das atividades | Cartões atualizados e novas necessidades registradas. |
| Aplicar o fluxo de branches e Pull Requests apresentado no treinamento. | Equipes de frontend e backend | A cada atividade de desenvolvimento | Alterações rastreáveis às issues e revisadas por outro integrante antes do merge em `dev`. |
| Manter o cartão `[TESTE]` como referência de consulta. | Scrum Master e equipe | Durante as próximas atividades | Procedimento acessível e atualizado conforme as necessidades da equipe. |
| Validar conjuntamente a integração com Docker. | Equipes de frontend e backend | Antes da próxima entrega ou homologação | Execução integrada verificada e procedimento documentado. |
| Compartilhar conhecimentos e dependências entre as áreas. | Equipes de frontend e backend | Durante os alinhamentos técnicos | Dependências identificadas e informações necessárias compartilhadas entre os integrantes. |

## 5. Compromissos da equipe

Para as próximas etapas, a equipe deverá preservar a organização das atividades por área, mantendo a colaboração entre os integrantes e a responsabilidade coletiva pela qualidade do produto.

Deverá ser priorizada a utilização consistente do Kanban como referência para execução e acompanhamento das atividades, bem como a aplicação do fluxo de versionamento e revisão apresentado no treinamento presencial.

A regularidade do acompanhamento diário continuará sendo um ponto de atenção. Os registros pelo Microsoft Teams deverão apoiar a comunicação, sem eliminar a busca por oportunidades de alinhamento coletivo e resolução colaborativa dos impedimentos.

## 6. Considerações finais

A Sprint 3 representou uma evolução na organização do trabalho da equipe DevDogs. A divisão das atividades por área, a consolidação do Kanban como principal direcionador das atividades e o treinamento presencial sobre o fluxo de desenvolvimento no GitHub demonstram mudanças concretas em relação às dificuldades identificadas na Sprint 1.

A adoção de registros individuais pelo Microsoft Teams constituiu uma adaptação às limitações de disponibilidade dos integrantes, embora a realização regular do Daily Scrum coletivo permaneça uma oportunidade de melhoria.

A experiência reforçou a importância da definição de responsabilidades, da transparência das atividades, da rastreabilidade entre issues e alterações no código, da revisão colaborativa e da integração entre as áreas técnicas.

Como resultado da retrospectiva, ficam propostas ações para consolidar as práticas adotadas, fortalecer a comunicação e preservar a melhoria contínua no desenvolvimento do Portal de Certificação em Metodologias Ágeis.
