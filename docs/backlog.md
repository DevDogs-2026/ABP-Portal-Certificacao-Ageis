# Product Backlog — DevDogs

**Versão proposta para revisão do Product Owner em 03/11/2026.**

## Visão e regras confirmadas no README do repositório

Portal web de certificação em metodologias ágeis, com estudo por temas, simulado e certificado. O README descreve 12 temas, uma questão sorteada por tema dentre quatro, quatro alternativas por questão, 150 segundos por questão, aprovação a partir de 65%, histórico das tentativas e certificado com QR Code.

## User Stories orientadas ao candidato

| ID | User Story | Critérios de aceite propostos | Issues técnicas existentes | Prioridade sugerida |
|---|---|---|---|---|
| US-01 | Como visitante, quero conhecer o portal e acessar suas páginas, para decidir entre estudar e realizar a avaliação. | Página inicial navegável; links corretos; versão responsiva. | #113–#114 | P1 |
| US-02 | Como candidato, quero criar uma conta, para acessar o portal com segurança. | Campos validados; CPF único; senha não armazenada em texto puro; feedback de cadastro. | #115–#116 | P0 |
| US-03 | Como candidato, quero entrar com CPF e senha, para acessar meus dados e avaliações. | Credenciais válidas autenticam; inválidas não autenticam; sessão protegida. | #117–#118 | P0 |
| US-04 | Como candidato, quero recuperar meu acesso, para voltar a utilizar minha conta. | Fluxo de redefinição seguro; não revelar existência de contas; token com validade. | #119–#120 | P1 |
| US-05 | Como candidato, quero consultar materiais organizados por tema, para estudar antes da certificação. | Conteúdo acessível por tema; navegação funcional; exibição adequada em mobile. | #121–#122 | P0 |
| US-06 | Como candidato, quero responder uma avaliação com questões sorteadas por tema, para demonstrar meus conhecimentos. | 12 questões, uma por tema; 4 alternativas; cronômetro de 150s por questão; tempo esgotado registra erro; tentativas persistidas. | #123–#124 | P0 |
| US-07 | Como candidato, quero visualizar minha pontuação e aprovação, para compreender meu desempenho. | Resultado correto; limiar ≥65%; resultado persistido; apresentação clara. | #125–#126 | P0 |
| US-08 | Como candidato aprovado, quero obter certificado eletrônico verificável, para comprovar a certificação. | Certificado só para aprovados; QR Code verificável; privacidade protegida. | #127–#128 | P1 |
| US-09 | Como candidato, quero consultar meu histórico e progresso, para acompanhar minhas tentativas. | Histórico íntegro; visualização por candidato; bloqueio de acesso a dados alheios. | #129–#130 | P1 |

## Rastreabilidade e ressalvas

- A correspondência numérica **RF01–RF21 / RNF01–RNF08 / RP01–RP09** deve ser validada contra a matriz oficial; não foi possível comprová-la apenas pelo README e pelas Issues.
- Os pares de Issues acima usam o conjunto **#113–#130**, que já possui User Stories preliminares. Foram identificadas outras três cópias de cada título em **#59–#112**; não criar novas cópias. A equipe deve escolher quais manter e quais marcar como duplicadas, após examinar histórico, vínculos e status.
- A prioridade P0/P1 é uma **proposta**, não uma decisão formal do Product Owner.
- O escopo da Sprint 02 e os Story Points permanecem **a confirmar** em Sprint Planning; não presumir que todas as histórias cabem nesta Sprint.

## Links

- [Repositório](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis)
- [Issues](https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis/issues)
- [GitHub Projects](https://github.com/users/DevDogs-2026/projects/4/views/1)
