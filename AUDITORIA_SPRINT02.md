# Auditoria de adequação — DevDogs · 03/11/2026

## Fontes

- Planilha institucional `1DSM - ABP - Planilha de avaliação - 2026-2.xlsx`, aba DevDogs.
- Relatório `relatorio-avaliacao-DevDogs-sprint1(1).md`, datado de 24/10/2026.
- GitHub: `DevDogs-2026/ABP-Portal-Certificacao-Ageis`, consultas diretas de branches, comparação, README, arquivos e Issues em 03/11/2026.

## Achados confirmados

| Gravidade | Achado | Evidência | Ação |
|---|---|---|---|
| Alta | Branches `main` e `dev` divergentes | `compare_commits(main,dev)`: `ahead_by=120`, `behind_by=20` | Não fazer merge automático; avaliar conflitos e escolher branch de integração. |
| Alta | `database/init.sql` vazio em `main` | Conteúdo de tamanho zero | Verificar implementação SQL nas outras branches; criar script reproduzível se necessário. |
| Alta | `docker-compose.yaml` vazio em `main` | Conteúdo de tamanho zero | Verificar execução e instruções, sem presumir que a infraestrutura esteja operacional. |
| Alta | Duplicação de Issues | 18 títulos técnicos repetidos em #59–#76, #77–#94, #95–#112 e #113–#130 | Validar histórico, estado e vínculos; consolidar sem perda de evidência. |
| Média | User Stories das Issues recentes precisam de refinamento | Algumas descrevem tarefa técnica como desejo do candidato; requisitos RF/RNF citados de forma genérica | Revisar `docs/backlog.md` e associar matriz oficial. |
| Alta | Burndown sem dados históricos verificáveis na consulta | Story Points nas Issues recentes indicados como 'definir por Scrum Poker'; datas/status não retornados | Levantar registros históricos antes de gerar gráfico real. |
| Alta | GitHub Projects sem separação por Sprint | Observação da planilha institucional na aba DevDogs | Criar campo Sprint e views filtradas; capturar evidência. |
| Média | Falta de DoD dedicada, Burndown e reviews de PR na Sprint 01 | Relatório de avaliação de 24/10 | Publicar DoD proposta e reforçar revisões; não simular evidências retroativas. |

## O que não foi verificado

- Estado atual da implementação completa nas branches `dev`/`dev-final` e ambiente de execução.
- Quais Issues estão de fato concluídas e quais integram a Sprint 02 no Project.
- Story Points reais e datas de conclusão, necessários ao Burndown.
- Correspondência exata dos IDs RF/RNF com a matriz oficial completa.
- Aprovação formal do PO/SM para o escopo e DoD propostos.
