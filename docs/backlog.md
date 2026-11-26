# Product Backlog — DevDogs

**Projeto:** ABP — Portal de Certificação em Metodologias Ágeis  
**Referência de planejamento:** Sprint 02 (23/10 a 05/11/2026)

## 1. Objetivo e fontes

Organizar as funcionalidades do portal em histórias orientadas ao candidato, relacionando-as às Issues existentes, com critérios de aceite verificáveis. O planejamento operacional, a prioridade, a atribuição e o andamento das atividades são acompanhados no [GitHub Projects — Sprint 02](https://github.com/users/DevDogs-2026/projects/4/views/6), sem substituição das decisões registradas nos cartões.

Documentos de referência do projeto:

- [Desafio 1DSM - 2026-2.pdf](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto/Desafio%201DSM%20-%202026-2.pdf)
- [1DSM - Proposta de rubrica de avaliação das sprints.pdf](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto/1DSM%20-%20Proposta%20de%20rubrica%20de%20avalia%C3%A7%C3%A3o%20das%20sprints.pdf)
- [1DSM - ABP - Planilha de avaliação - 2026-2.xlsx](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/docs/projeto/1DSM%20-%20ABP%20-%20Planilha%20de%20avalia%C3%A7%C3%A3o%20-%202026-2.xlsx)
- `Backlog.xlsx` — planilha de requisitos e tarefas do projeto (colunas B, C e D; fonte da rastreabilidade funcional).
- [README do projeto](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/blob/docs/sprint02-adequacao-avaliacao-20261103/README.md)

A rastreabilidade funcional utiliza a planilha `Backlog.xlsx` do projeto, considerando as colunas **Tag**, **Descrição** e **Task description**, inclusive referências cruzadas entre requisitos. Os requisitos RNF01–RNF08 e as restrições RP01–RP09 aplicam-se a todos os fluxos funcionais.

## 2. Regras de negócio do portal

- O portal contempla **12 temas** de estudo e certificação.
- Cada avaliação apresenta **12 questões**, uma sorteada de um conjunto de **quatro questões por tema**.
- Cada questão possui **uma imagem**, **quatro alternativas** e **uma única resposta correta**.
- O tempo máximo é de **150 segundos por questão**; o esgotamento do tempo registra a questão como incorreta e apresenta a alternativa correta antes do avanço.
- A aprovação exige aproveitamento **igual ou superior a 65%**. Em 12 questões, isso corresponde a pelo menos **8 acertos**.
- As tentativas devem permanecer registradas no histórico do candidato, independentemente do resultado.
- Candidatos aprovados podem obter certificado eletrônico com nota final e verificação por QR Code.

## 3. Product Backlog — histórias e critérios de aceite

### US-01 — Página inicial e navegação

**História:** Como visitante, quero conhecer o portal e navegar entre suas páginas, para acessar as funcionalidades de estudo e certificação.

**Critérios de aceite:**
- Links, menus e botões conduzem às páginas previstas.
- A apresentação é utilizável em dispositivos móveis e desktop.
- O layout é coerente com o protótipo e permite navegação por teclado.
- Dados dinâmicos ou serviços públicos são implementados apenas quando necessários, sem exposição de informações pessoais; a decisão é documentada.

**Issues:** [#113 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/113) · [#114 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/114)

### US-02 — Cadastro de candidatos

**História:** Como candidato, quero cadastrar meus dados e criar uma senha, para utilizar o portal de forma segura.

**Critérios de aceite:**
- O formulário contempla nome completo, CPF, e-mail e senha, com rótulos e mensagens apropriados.
- Os dados são validados; CPFs duplicados são rejeitados.
- O cadastro é persistido no PostgreSQL; a senha é armazenada somente como hash seguro no servidor.
- O formulário é responsivo e integrado ao serviço de cadastro, com tratamento de erros.

**Issues:** [#115 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/115) · [#116 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/116)

### US-03 — Autenticação e sessão

**História:** Como candidato, quero entrar com CPF e senha, para acessar minhas informações e avaliações.

**Critérios de aceite:**
- O formulário permite autenticação por CPF e senha, com mensagens compreensíveis e layout responsivo.
- Credenciais inválidas não permitem acesso.
- A validação das credenciais ocorre no servidor; sessões e rotas restritas são protegidas.
- O encerramento de sessão é funcional, sem exposição de senhas ou credenciais sensíveis.

**Issues:** [#117 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/117) · [#118 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/118)

### US-04 — Recuperação de acesso

**História:** Como candidato, quero redefinir minha senha quando perder o acesso, para voltar a utilizar minha conta.

**Critérios de aceite:**
- O formulário de recuperação apresenta fluxo claro e mensagens que não revelam a existência de contas.
- A redefinição utiliza token temporário, de uso único e com expiração, conforme escopo aprovado.
- Tokens inválidos, expirados ou reutilizados não permitem redefinir a senha.
- A nova senha é armazenada de forma segura; o fluxo é utilizável em dispositivos móveis.

**Issues:** [#119 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/119) · [#120 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/120)

### US-05 — Área de estudos

**História:** Como candidato, quero consultar materiais organizados por tema, para estudar antes da certificação.

**Critérios de aceite:**
- Os 12 temas previstos estão disponíveis e organizados de forma navegável.
- Textos, imagens e materiais são apresentados de forma legível e responsiva.
- A consulta por tema retorna o conteúdo correspondente; conteúdos ausentes são tratados adequadamente.
- Os dados disponibilizados correspondem aos temas e materiais aprovados para o projeto.

**Issues:** [#121 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/121) · [#122 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/122)

### US-06 — Avaliação e controle de tempo

**História:** Como candidato, quero responder uma questão por tema dentro do tempo disponível, para demonstrar meus conhecimentos.

**Critérios de aceite:**
- A avaliação contém 12 questões, com sorteio de uma questão por tema a partir de quatro disponíveis por tema.
- Cada questão apresenta imagem, enunciado e quatro alternativas, sendo uma correta.
- O cronômetro regressivo de 150 segundos é visível e o limite é controlado no servidor.
- Ao esgotar o tempo, a questão é registrada como incorreta, a resposta correta é apresentada e o fluxo avança para a próxima questão.
- Uma resposta enviada após o encerramento da questão não é aceita.
- Em caso de interrupção, a questão em andamento é encerrada conforme a regra definida na Issue #124; a retomada ocorre no próximo tema ainda não respondido, preservando o progresso registrado.
- Ao finalizar as 12 questões, a tentativa fica disponível para cálculo e apresentação do resultado.
- As respostas, os tempos e o progresso da tentativa são persistidos.

**Issues:** [#123 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/123) · [#124 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/124)

### US-07 — Resultado da avaliação

**História:** Como candidato, quero consultar minha pontuação e situação de aprovação, para compreender meu desempenho.

**Critérios de aceite:**
- A interface apresenta total de questões, acertos, percentual e situação de aprovado ou reprovado.
- O resultado é calculado no servidor e registrado por tentativa.
- O limite de aprovação é de 65%: **7/12 reprova** e **8/12 aprova**.
- O candidato consulta apenas resultados aos quais possui autorização de acesso.
- Os estados de aprovação e reprovação são compreensíveis sem depender exclusivamente de cores.

**Issues:** [#125 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/125) · [#126 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/126)

### US-08 — Certificado eletrônico

**História:** Como candidato aprovado, quero visualizar e obter meu certificado eletrônico, para comprovar minha certificação.

**Critérios de aceite:**
- Somente candidatos aprovados podem receber certificado.
- O certificado apresenta os dados previstos na Issue #127, incluindo identificação, emissão e desempenho.
- O certificado possui identificador único e QR Code que permite verificar sua autenticidade.
- A consulta de autenticidade protege dados pessoais e não expõe informações além das necessárias à validação.
- A apresentação é legível e possui versão adequada para impressão.

**Issues:** [#127 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/127) · [#128 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/128)

### US-09 — Histórico e progresso

**História:** Como candidato, quero acompanhar minhas tentativas e meu progresso, para consultar meu histórico de avaliações.

**Critérios de aceite:**
- A interface apresenta histórico e estados de progresso de maneira legível, acessível e responsiva.
- O histórico registra tentativas, questões, respostas, resultados e dados temporais pertinentes, conforme a modelagem aprovada.
- O progresso é calculado a partir dos registros persistidos.
- As consultas são autenticadas e limitadas ao titular dos dados.
- Tentativas concluídas, aprovadas ou reprovadas permanecem disponíveis no histórico.

**Issues:** [#129 — Frontend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/129) · [#130 — Backend](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues/130)

## 4. Rastreabilidade e acompanhamento

| História | Fluxo funcional | Issues vinculadas | RF e dependências |
|---|---|---|---|
| US-01 | Página inicial | #113–#114 | RF01 |
| US-02 | Cadastro | #115–#116 | RF03 |
| US-03 | Login | #117–#118 | RF04 (dependência de RF03) |
| US-04 | Recuperação de senha | #119–#120 | RF03, RF04 (relação com criação, utilização e redefinição de senha) |
| US-05 | Estudos | #121–#122 | RF07 (interface de progresso relacionada a RF21) |
| US-06 | Avaliação | #123–#124 | RF02, RF05, RF06, RF08–RF15; integração com RF20 |
| US-07 | Resultados | #125–#126 | RF16 (consulta a dados registrados conforme RF09) |
| US-08 | Certificados | #127–#128 | RF17, RF18, RF19 (dados de RF03 e RF09) |
| US-09 | Histórico e progresso | #129–#130 | RF20, RF21 (vínculos com RF09 e RF07) |

**Requisitos transversais:** RNF01–RNF08 e RP01–RP09 aplicam-se a **todos** os fluxos US-01–US-09, conforme definição do projeto.

As Issues vinculadas detalham as tarefas de frontend e backend, as evidências e a Definition of Done. Os respectivos cartões no GitHub Projects constituem a referência operacional para prioridade, responsável, milestone e status.

## 5. Gestão e validação

- A execução das histórias deve seguir os critérios de aceite das respectivas Issues e a [Definition of Done](dod.md) adotada pela equipe.
- As regras de negócio documentadas no desafio institucional prevalecem em caso de divergência; ajustes de escopo devem ser registrados nas Issues correspondentes.

## 6. Links operacionais

- [Repositório](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis)
- [Issues do projeto](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues)
- [GitHub Projects — Sprint 02](https://github.com/users/DevDogs-2026/projects/4/views/6)
