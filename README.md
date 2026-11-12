# API 1° Semestre DSM

# DevDogs

# 🎓 Portal de Certificação em Metodologias Ágeis

Este projeto consiste em uma plataforma web desenvolvida como o desafio integrador do curso de **Desenvolvimento de Software Multiplataforma**. O objetivo do sistema é auxiliar estudantes a consolidarem conceitos de Scrum e Engenharia de Software Moderna através de um portal que oferece simulados cronometrados e uma área de estudos dedicada.

## 📝 O Desafio e Regras de Negócio

O portal avalia competências variadas divididas em **12 temas específicos** de metodologias ágeis. 

### Regras do Simulado:
* **Estrutura:** 12 questões por avaliação (1 questão selecionada aleatoriamente por tema, a partir de um banco de 4 questões por tema).
* **Formato:** Todas as questões são objetivas (4 alternativas, apenas 1 correta) e incluem uma imagem para análise.
* **Tempo Limite:** Cronômetro regressivo de **150 segundos** por questão. Estourar o tempo marca a questão como incorreta e exibe a resposta certa antes de avançar.
* **Certificação:** Candidatos com aproveitamento **≥ 65%** recebem um certificado eletrônico com nota final e validação via **QR Code**.
* **Histórico:** Todas as tentativas ficam salvas no perfil do candidato, independente do resultado.

---

## 💻 Tecnologias e Ferramentas Utilizadas

O projeto integra os conhecimentos do semestre abordando do design à infraestrutura:

* **Prototipagem & UI/UX:** Figma;
* **Front-end:** HTML, CSS, JavaScript;
* **Back-end:** Node.js;
* **Banco de Dados:** PostgreSQL;
* **Infraestrutura / DevOps:** Docker;
* **Metodologia de Trabalho:** Scrum

---

## Execução com Docker Compose

1. Copie `.env.example` para `.env`, defina uma senha local do PostgreSQL e gere um segredo de sessão exclusivo com:
   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```
   Guarde o valor gerado somente no arquivo `.env`, nunca no repositório.
2. Inicialize os serviços integrados:
   ```bash
   docker compose up --build
   ```
3. Acesse o portal em `http://localhost:8080`. O frontend encaminha as chamadas `/api` ao backend; o PostgreSQL é inicializado com o esquema e as questões do projeto.
4. Para encerrar os serviços, execute `docker compose down`. Os dados permanecem no volume `postgres_data`; use `docker compose down -v` somente quando quiser apagar esse banco local.

## Execução local da avaliação

1. Copie `.env.example` para `.env` e `backend/.env.example` para `backend/.env`, preenchendo uma senha local do PostgreSQL e um segredo de sessão exclusivo gerado com o comando acima.
2. Inicialize o banco com `docker compose up -d database`. Os arquivos `database/schema.sql` e `database/seed.sql` são executados automaticamente somente quando o volume do banco é criado pela primeira vez.
3. Para um banco existente, aplique `database/migrations/001_assessment_results.sql` e `database/migrations/002_certificate_validation.sql`; execute `database/seed.sql` se as questões ainda não estiverem carregadas.
4. Instale e inicie o backend com `npm --prefix backend install` e `npm --prefix backend run dev`.
5. Sirva a pasta `frontend` em `http://127.0.0.1:5500`; essa origem deve corresponder a `FRONTEND_ORIGIN` no arquivo `backend/.env`.

O fluxo autenticado usa `POST /api/assessments/attempts` para iniciar ou retomar uma avaliação, `GET /api/assessments/attempts` para consultar o histórico, `GET /api/assessments/attempts/:id/current` para obter a próxima questão, `POST /api/assessments/attempts/:id/answers` para registrar respostas e `GET /api/assessments/attempts/:id/result` para consultar o resultado. O servidor valida as alternativas e calcula a aprovação; os identificadores de tentativa são sempre conferidos contra o candidato da sessão.

Certificados aprovados são emitidos sob demanda por `GET /api/certificates/me`, que exige sessão autenticada. O código pode ser validado publicamente por `GET /api/certificates/verify?codigo=...`; a resposta pública não inclui CPF, email nem desempenho do candidato.

---

📅 Cronograma de Sprints

| Sprint | Período |
| :--- | :---:|
| Sprint 1 | 28/09 - 22/10 |
| Sprint 2 | 23/10 - 05/11 |
| Sprint 3 | 06/11 - 26/11 |

---

## 👥 Equipe

| Nome | Função | GitHub |
| :--- | :--- | :--- |
| Gabriel da Fonseca Flauzino | Project Owner | [Gabriel](https://github.com/gabri05el) |
| Hector Saiki Colombani de Faria | Dev Team | [Hector](https://github.com/saikihector) |
| Igor Vinicius de Araujo Pece Dos Santos | Dev Team | [Igor](https://github.com/IgorVinicin) |
| João Vitor Pazzini Theodoro Gama | Dev Team | [João](https://github.com/jaopazzini) |
| Lucas Vilas Boas Fukuoka | Scrum Master | [Lucas](https://github.com/LuFukuo) |
| Marcos Antonio Floreano Gonçalves | Dev Team | [Marcos](https://github.com/MarcosFloreano) |
| Vitor Souza Leal | Dev Team | [Vitor](https://github.com/vitor-leal1) |


1. Clone o repositório da equipe:
   ```bash
   git clone https://github.com/DevDogs-2026/ABP-Portal-Certificacao-Ageis.git
   ```
2. Navegue até a pasta raiz do projeto:
   ```bash
   cd ABP-Portal-Certificacao-Ageis
   ```
