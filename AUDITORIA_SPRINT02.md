# Auditoria de adequação — DevDogs · Sprint 02

**Data da auditoria original:** 03/11/2026  
**Data da revisão documental:** 04/11/2026  
**Projeto:** ABP — Portal de Certificação em Metodologias Ágeis  
**Repositório:** `DevDogs-2026/ABP-Portal-Certificacao-Ageis`  
**Natureza:** diagnóstico documental e plano de verificação; não constitui homologação técnica da aplicação.

## 1. Objetivo

Registrar os achados da auditoria, distinguir evidências verificadas de hipóteses e pendências, atualizar o estado do GitHub Projects e definir ações verificáveis para adequação da Sprint 02. Preservar o histórico das Issues e não realizar alterações na `main` sem aprovação da equipe.

## 2. Fontes e limites

- Documentos de referência do projeto, disponibilizados em [`docs/projeto`](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/tree/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto):
  - [1DSM - ABP - Planilha de avaliação - 2026-2.xlsx](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto/1DSM%20-%20ABP%20-%20Planilha%20de%20avalia%C3%A7%C3%A3o%20-%202026-2.xlsx).
  - [1DSM - Proposta de rubrica de avaliação das sprints.pdf](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto/1DSM%20-%20Proposta%20de%20rubrica%20de%20avalia%C3%A7%C3%A3o%20das%20sprints.pdf).
  - [Desafio 1DSM - 2026-2.pdf](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto/Desafio%201DSM%20-%202026-2.pdf).
- Repositório GitHub `DevDogs-2026/ABP-Portal-Certificacao-Ageis`: consultas registradas na auditoria de 03/11/2026.
- **Sprint 02** do GitHub Projects, filtro `milestone:Sprint02`, contador de **19 itens**, com status e prioridades exibidos.
- PR [#131](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/pull/131), utilizada para revisão documental.

## 3. Achados e classificação das evidências

| ID | Gravidade original | Achado | Evidência disponível | Situação em 04/11/2026 | Próxima ação |
|---|---|---|---|---|---|
| A01 | Alta | Divergência entre `main` e `dev` | Auditoria original registra `compare_commits(main,dev)` com `ahead_by=120` e `behind_by=20` | **Pendente de revalidação técnica**; não implica, por si só, erro de integração | Reexecutar comparação e analisar diferenças e conflitos antes de definir branch de integração |
| A02 | Alta | `database/init.sql` vazio na `main` | Auditoria original registra conteúdo de tamanho zero | **Fato reportado para a `main` na data da consulta**, sem conclusão sobre as demais branches ou sobre o banco em execução | Examinar `main`, `dev` e demais branches relevantes; validar scripts, migrações e instruções de inicialização |
| A03 | Alta | `docker-compose.yaml` vazio na `main` | Auditoria original registra conteúdo de tamanho zero | **Fato reportado para a `main` na data da consulta**, sem comprovação de falha do ambiente | Examinar arquivos de infraestrutura em branches relevantes e testar procedimento documentado de execução |
| A04 | Alta | Títulos de Issues técnicas repetidos | Auditoria original identifica séries #59–#76, #77–#94, #95–#112 e #113–#130 | **Duplicação aparente de títulos**, não necessariamente de trabalho; histórico e vínculos não verificados | Comparar escopo, datas, milestones, status, PRs e comentários; preservar rastreabilidade |
| A05 | Média | User Stories recentes com redação técnica e referências RF/RNF genéricas | Observação registrada na auditoria original | **Necessita validação contra matriz institucional** | Revisar `docs/backlog.md`, critérios de aceitação e correspondência RF/RNF |
| A06 | Alta | Burndown sem série histórica verificável | Auditoria original registra Story Points a definir por Scrum Poker e ausência de histórico suficiente na consulta | **Pendente de dados reais**; não gerar gráfico com estimativas inventadas | Levantar estimativas aprovadas, datas e mudanças de escopo; documentar lacunas |
| A07 | Alta | GitHub Projects sem separação por Sprint | Observação histórica da planilha institucional; view **Sprint 02** com `milestone:Sprint02` e 19 itens | **Corrigido quanto à existência de uma visualização filtrada** |
| A08 | Média | Ausência ou insuficiência de DoD dedicada, Burndown e reviews de PR na Sprint 01 | Relatório de avaliação de 24/10 citado na auditoria original | **Pendência histórica a tratar prospectivamente**, sem simular registros retroativos | Revisar `docs/dod.md`, evidências de revisão e método de acompanhamento da Sprint 02 |

## 4. Correção do diagnóstico sobre o GitHub Projects

A constatação anterior de que o Project não apresentava separação por Sprint deve permanecer como **registro histórico** da avaliação institucional, mas não como deficiência atual sem ressalvas.

Em 04/11/2026, Projeto apresenta:

- Visualização denominada **Sprint 02** no GitHub Projects;
- Filtro `milestone:Sprint02` aplicado;
- Contador de **19 itens** na visualização;
- Campos de responsável, milestone, status e prioridade exibidos.

**Conclusão delimitada:** a necessidade de uma visualização específica para a Sprint 02 foi atendida. Não se afirma que os 19 itens estejam integralmente validados quanto a escopo, responsáveis, estimativas ou conclusão. Não se propõe alterar o posicionamento dos cartões, que a equipe informou corresponder ao estado real do trabalho.

## 5. Evidências, hipóteses e verificações pendentes

- A auditoria de 03/11 registrou diferenças entre `main` e `dev`, arquivos vazios na `main` e títulos repetidos de Issues.
- A visualização Sprint 02 apresenta filtro e contador de 19 itens nas capturas de 04/11.
- A PR #131 reúne os documentos de adequação para revisão, sem autorização para merge.

## 6. Plano de ação rastreável

**Regra:** os responsáveis abaixo estão **a definir pela equipe**. Nenhuma atribuição é presumida. Os vínculos são referências iniciais; onde não há Issue confirmada, o vínculo deve ser estabelecido após conferência, sem criar duplicações automaticamente.

| ID | Prioridade sugerida | Ação | Referência inicial | Responsável | Critério de conclusão | Evidência esperada |
|---|---|---|---|---|---|---|
| P01 | Alta | Comparar `main`, `dev` e, se aplicável, `dev-final`; decidir estratégia de integração | Branches e PRs do repositório | A definir | Diferenças e conflitos analisados; estratégia aprovada, sem merge automático | Comparação de commits, lista de conflitos e decisão registrada |
| P02 | Alta | Verificar scripts de banco, migrações e inicialização do PostgreSQL | `database/init.sql` e arquivos correlatos | A definir | Processo de criação/inicialização reproduzível e documentado, ou lacuna claramente registrada | Caminhos de arquivos, comandos e resultado de teste |
| P03 | Alta | Verificar configuração de execução e infraestrutura | `docker-compose.yaml` e documentação de execução | A definir | Procedimento de execução validado ou impedimento reproduzível documentado | Configuração efetiva, comandos e logs de teste |
| P04 | Média | Auditar títulos repetidos sem apagar histórico | Issues #59–#130, conforme séries indicadas na auditoria | A definir | Cada grupo classificado como histórico legítimo, trabalho distinto ou duplicação real | Matriz de correspondência com links, justificativas e ações aprovadas |
| P05 | Alta | Refinar User Stories e rastrear requisitos institucionais | `docs/backlog.md` e Issues da Sprint 02 | A definir | Histórias e critérios de aceitação associados aos RF/RNF aplicáveis | Matriz de rastreabilidade e links das Issues |
| P06 | Alta | Construir Burndown apenas com dados verificáveis | `docs/burndown/sprint-02.md` e `sprint-02-dados.csv` | A definir | Origem e datas dos dados registradas; lacunas sinalizadas; gráfico somente se houver série suficiente | Exportação/registro histórico, tabela de pontos e gráfico, se viável |
| P07 | Média | Formalizar DoD e processo de revisão para Sprint 02 | `docs/dod.md`, PRs e critérios da equipe | A definir | DoD aprovada e aplicada às entregas futuras; reviews/testes documentados | Registro de aprovação, checklist e evidências por PR |

## 7. Critérios para encerramento da auditoria

A auditoria poderá ser marcada como concluída **documentalmente** quando:

1. Cada achado possuir status atualizado, responsável designado ou justificativa formal para ausência de designação;
2. As evidências técnicas pendentes forem verificadas, ou explicitamente registradas como limitações não resolvidas;
3. O backlog, a DoD, o planejamento da Sprint 02 e o Burndown forem revisados quanto à consistência;
4. As decisões de integração entre branches forem aprovadas pela equipe;
5. Os links das Issues, PRs, testes e registros de aprovação estiverem documentados.

**Observação:** conclusão documental não equivale a homologação funcional, aprovação institucional ou autorização de merge.

## 8. Controle de revisão

| Versão | Data | Alteração | Situação |
|---|---|---|---|
| 1.0 | 03/11/2026 | Auditoria inicial com oito achados e cinco limitações | Documento original |
| 1.1 | 04/11/2026 | Atualização da view Sprint 02; distinção entre evidências e hipóteses; plano de ação com rastreabilidade e critérios de conclusão |
