# Sprint 02 — Acompanhamento técnico e documental atualizado

**Projeto:** ABP — Portal de Certificação em Metodologias Ágeis (DevDogs)  
**Período da Sprint:** 23/10 a 05/11/2026  
**Data desta revisão:** 05/11/2026  
**Natureza:** registro de auditoria e acompanhamento, **não** ata de Sprint Review, homologação da aplicação ou declaração de conclusão das Issues.  
**Branches examinadas:** `dev` e `docs/sprint02-adequacao-avaliacao-20261103`.

## 1. Objetivo e critério de evidência

Consolidar uma entrega demonstrável do portal, integrar os fluxos prioritários e registrar evidências reais de desenvolvimento e de Scrum. A presença de código, arquivos, testes escritos ou documentação **não comprova**, isoladamente, execução bem-sucedida, integração, aprovação do Product Owner ou atendimento à Definition of Done.

Fontes: [repositório](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis), [PR documental #131](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/pull/131), [`docs/backlog.md`](../backlog.md), [`docs/dod.md`](../dod.md) e [auditoria](../../AUDITORIA_SPRINT02.md).

## 2. Situação das branches em 05/11/2026

| Referência | Evidência consultada | Interpretação |
|---|---|---|
| `main` → `dev` | `dev` **161 commits à frente** e **21 atrás** de `main` | Branches divergentes; não integrar sem revisão dos diffs e testes |
| `main` → `docs/sprint02-adequacao-avaliacao-20261103` | Branch documental **6 commits à frente** e **1 atrás** de `main` | Alterações documentais ainda separadas da branch principal |
| PR #131 | PR de documentação da Sprint 02, aberta como rascunho na verificação anterior | Revisão documental não equivale a merge nem aprovação |
| Commit [`9f3f4be`](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/commit/9f3f4beeb2f3b4aa84661314eee59d2a3ed12cc5) | Revisão de `docs/dod.md` | Rastreabilidade RF/RNF/RP e aceite conjunto de Issue e User Story incorporados |

**Limite da consulta:** foram examinados os estados atuais das branches e o commit documental identificado. Não foi obtida uma listagem exaustiva, com autor e horário, de **todos** os commits de 05/11 na `dev`; portanto, os arquivos encontrados abaixo não são atribuídos individualmente a commits de hoje sem confirmação adicional.

## 3. Evidências técnicas verificadas na `dev`

| Área | Arquivos observados | Situação comprovável | O que falta validar |
|---|---|---|---|
| Backend Express | `backend/src/server.js`, `backend/package.json` | Código de servidor, middleware de sessão e scripts `start`, `dev` e `test` presentes | Inicialização real, rotas, implantação e integração com frontend |
| Autenticação | `backend/src/routes/authRoutes.js` | Rotas `/login`, `/me` e `/logout`; consulta parametrizada ao PostgreSQL, comparação com bcrypt, sessão e limite de tentativas de login | Testes integrados, cadastro persistido, proteção ponta a ponta e fluxos de recuperação |
| Banco e sessões | `backend/src/db/pool.js`; `backend/src/server.js` | Pool PostgreSQL e sessão persistida via `connect-pg-simple` previstos no código | Configuração real do ambiente, esquema compatível e execução dos scripts |
| Resultado da avaliação | `backend/src/services/calcularResultado.js` | Regra de aprovação de 65% implementada no cálculo | Integração com respostas, tentativas, persistência e interface |
| Testes de resultado | `backend/test/calcularResultados.test.js` | Testes escritos para 7/12 (reprova), 8/12 (aprova), entradas inválidas e total padrão | Executar `npm test` e guardar log/resultado da execução |
| Frontend | `frontend/acesso.html`, `frontend/src/js/acesso.js` e outras páginas/JS | Interfaces e lógica de demonstração existentes | Substituir armazenamento local temporário pelo backend e testar os fluxos integrados |
| Infraestrutura | `docker-compose.yaml` | Serviço PostgreSQL definido e montagem de arquivos SQL prevista | Confirmar existência e caminhos dos SQL, variáveis de ambiente e subida do container |
| Material de estudo e avaliação | `docs/questoes/` e artefatos de Figma/UML | Há arquivos de conteúdo, imagens e modelos na `dev` | Conferir cobertura dos 12 temas, consistência e ligação à aplicação |

### 3.1 Pendências técnicas prioritárias

1. **Integração de login e cadastro:** `frontend/src/js/acesso.js` ainda utiliza `localStorage` para armazenar usuários e hashes SHA-256 como mecanismo temporário. Esse fluxo não substitui autenticação segura no servidor. O backend já possui rota de login com bcrypt; é necessário unificar os fluxos e retirar o armazenamento local de credenciais de demonstração do caminho de produção.
2. **Inicialização do banco:** o `docker-compose.yaml` referencia `./database/schema.sql` e `./database/seed.sql`; ambos não foram encontrados nas consultas realizadas à `dev`. O arquivo `database/init.sql` também não foi encontrado nessa branch. É necessário confirmar os nomes/caminhos reais e executar o ambiente antes de afirmar que o banco está operacional.
3. **Caminho do frontend servido pelo backend:** `backend/src/server.js` usa `../frontend/build`, enquanto foram observados arquivos de interface em `frontend/`. Validar se existe etapa de build e se o caminho servido corresponde à estrutura efetiva de execução.
4. **Segredos e configuração:** conferir o versionamento de `backend/.env` identificado na comparação entre branches. Verificar se contém dados sensíveis; se contiver, remover do versionamento, revogar/rotacionar segredos comprometidos e fornecer apenas `.env.example` sem valores reais.
5. **Cobertura de testes:** os testes da função de resultado existem, mas sua execução não foi comprovada nesta auditoria. Também são necessárias evidências para autenticação, persistência, autorização e cenários negativos.

## 4. Situação documental e rastreabilidade

- **Product Backlog:** `docs/backlog.md` apresenta US-01 a US-09, critérios de aceite, vínculos com Issues #113–#130 e matriz RF. Para **US-04**, mantém corretamente a associação a **RF03 e RF04**.
- **Requisitos transversais:** RNF01–RNF08 e RP01–RP09 são considerados aplicáveis aos fluxos, sujeitos à validação efetiva por funcionalidade.
- **DoD:** `docs/dod.md` revisado no commit `9f3f4be`, com vínculo da Issue à User Story, RF/RNF/RP e comprovação dos critérios de aceite de ambos. **Aprovação formal da equipe ainda não foi comprovada.**
- **GitHub Projects:** a auditoria documental anterior registrou uma visualização **Sprint 02** filtrada por `milestone:Sprint02`, com 19 itens. Este documento **não altera** cartões, responsáveis, prioridades ou status; a contagem e o estado atual de cada item devem ser confirmados na própria visualização.
- **Burndown:** existem `docs/burndown/sprint-02.md` e `sprint-02-dados.csv`, mas não há, nesta revisão, série histórica comprovada suficiente para declarar um burndown real concluído.

## 5. Histórico de pendências e atualização do diagnóstico

| Achado anterior | Atualização em 05/11/2026 |
|---|---|
| `main` e `dev` divergentes | **Confirmado**, com nova contagem: 161 à frente / 21 atrás |
| Infraestrutura vazia na `main` | Não extrapolar esse achado para a `dev`: há `docker-compose.yaml` com configuração PostgreSQL, mas caminhos SQL precisam de validação |
| Ausência de backend demonstrável | **Diagnóstico superado parcialmente**: há código de autenticação, sessões, banco e cálculo de resultado na `dev`; execução integrada não comprovada |
| Falta de DoD dedicada | **Correção documental realizada** na branch de adequação; aprovação e aplicação da DoD ainda dependem de evidências |
| Falta de histórias de usuário rastreáveis | **Correção documental realizada** no backlog, inclusive US-04 → RF03/RF04 |
| Falta de separação por Sprint no Project | Auditoria anterior registra visualização Sprint 02 filtrada; não reabrir ajuste cosmético sem evidência de problema real |
| Títulos de Issues repetidos | Permanecem como achado histórico a avaliar por escopo e vínculos; não encerrar, excluir ou reorganizar automaticamente |

## 6. Planejamento e acompanhamento Scrum

### Decisões ainda dependentes de validação da equipe

- [ ] Confirmar Sprint Goal aprovado e conjunto efetivo de User Stories comprometidas com a Sprint 02.
- [ ] Registrar Story Points, responsáveis e dependências conforme decisões reais da equipe e Scrum Poker.
- [ ] Confirmar quais Issues foram concluídas com evidências e atendimento à DoD.
- [ ] Registrar PRs revisadas, resultados de testes e demonstração integrada.
- [ ] Registrar a aprovação formal da DoD pela equipe/PO, quando ocorrer.

### Quadro de evidências

| Evidência | Referência disponível | Estado nesta revisão |
|---|---|---|
| Backlog e rastreabilidade | `docs/backlog.md` | **Documento verificado**; não equivale a aceite da implementação |
| DoD revisada | `docs/dod.md`, commit `9f3f4be` | **Revisão confirmada**; aprovação formal não comprovada |
| PR de adequação | PR #131 | **PR identificada**; merge não realizado na verificação anterior |
| Código backend de autenticação | `backend/src/routes/authRoutes.js` na `dev` | **Código presente**; integração e testes pendentes |
| Cálculo de resultados e testes escritos | `backend/src/services/calcularResultado.js`; `backend/test/calcularResultados.test.js` | **Arquivos presentes**; execução não comprovada |
| Banco operacional | `docker-compose.yaml` e arquivos SQL | **Pendente de validação** dos scripts e inicialização |
| Sprint Goal, Planning e Story Points | GitHub Projects / registro de cerimônia | **Não comprovado nesta consulta** |
| Daily Scrum | Arquivos em `docs/` na `dev` | **Arquivos identificados**; datas, autoria e abrangência ainda a conferir |
| Burndown real | `docs/burndown/sprint-02.md` | **Dados insuficientes** para curva validada |
| Vídeo e demonstração da Sprint 02 | Link e evidência de apresentação | **Não verificado** |
| Sprint Review e feedback | Ata ou registro da equipe | **Não verificado**; registrar após realização |

## 7. Ações objetivas recomendadas, em ordem de prioridade

1. **Validar execução do ambiente:** conferir scripts SQL referenciados pelo Compose, variáveis e inicialização do PostgreSQL; registrar resultado sem divulgar segredos.
2. **Testar autenticação integrada:** ligar frontend ao backend e ao banco; validar cadastro, login, logout, sessões e falhas de acesso, sem `localStorage` de credenciais como solução final.
3. **Executar testes automatizados:** rodar os testes de cálculo e anexar evidências; ampliar cobertura dos fluxos prioritários.
4. **Conferir a segurança do repositório:** verificar se `backend/.env` foi versionado com segredos reais e tomar medidas de remediação se necessário.
5. **Consolidar evidências da Sprint:** identificar entregas efetivas, PRs, testes, cerimônias e aprovação da DoD; atualizar a tabela acima somente com comprovação.
6. **Planejar integração controlada:** revisar diferenças `dev` × `main`, conflitos e critérios de aceite antes de qualquer merge autorizado.

## 8. Datas e encerramento

- **04/11/2026:** data prevista no planejamento institucional para envio do link do vídeo ao Focal Point.
- **05/11/2026:** data prevista para Sprint Review e encerramento do período da Sprint 02.

**Não afirmar cumprimento de prazo, apresentação realizada ou conclusão da Sprint sem evidência.** Após a Review, registrar o que foi demonstrado, feedback recebido, pendências assumidas e encaminhamento para a Sprint 03. A apresentação deve evidenciar o trabalho coletivo.

---

**Controle de alterações:** documento proposto para substituir `docs/sprints/sprint-02.md` **somente após revisão pelo responsável**. Não altera a `main`, a `dev`, as Issues nem o GitHub Projects.
