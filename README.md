<div align="right">
  <sub>Desenvolvido por <a href="https://github.com/paulodiasred"><strong>Paulo Dias</strong></a> 🚀</sub>
</div>

# Autoflex Challenge — Sistema de Capacidade de Produção

<div align="center">

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://autoflex-lemon.vercel.app)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://autoflex-backend-0r3b.onrender.com)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=java)](https://adoptium.net/)
[![Quarkus](https://img.shields.io/badge/Quarkus-3.20-4695EB?style=for-the-badge&logo=quarkus)](https://quarkus.io/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Oracle](https://img.shields.io/badge/Oracle-23ai-F80000?style=for-the-badge&logo=oracle)](https://www.oracle.com/database/)

</div>

Sistema web fullstack para gerenciamento de produtos e matérias-primas, com cálculo automático de capacidade de produção com base no estoque disponível.

---

## 🌐 Acesse o projeto online

O sistema está disponível nos seguintes links:

| Serviço | URL |
|---------|-----|
| **Frontend** | [https://autoflex-lemon.vercel.app](https://autoflex-lemon.vercel.app) |
| **Backend** | [https://autoflex-backend-0r3b.onrender.com](https://autoflex-backend-0r3b.onrender.com) |
| **Swagger UI** | [https://autoflex-backend-0r3b.onrender.com/q/swagger-ui](https://autoflex-backend-0r3b.onrender.com/q/swagger-ui) |

> ⚠️ **Nota:** O backend no Render utiliza plano gratuito e pode demorar de 30 a 50 segundos para responder após períodos de inatividade.

---

## 👨‍💻 Sobre o desenvolvedor

**Paulo Dias** é um desenvolvedor fullstack com experiência em Java, Quarkus, React e bancos de dados relacionais. 
Este projeto foi desenvolvido como parte do desafio técnico para a vaga de desenvolvedor na Autoflex.

📫 **Contato:** pauloalberto13@gmail.com  
🔗 **LinkedIn:** [linkedin.com/in/paulodiasdeveloper](https://linkedin.com/in/paulodiasdeveloper)  
🐙 **GitHub:** [github.com/paulodiasred](https://github.com/paulodiasred)


## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Back-end | Java 21 + Quarkus 3.20 |
| Front-end | React 18 + Redux Toolkit |
| Banco de dados | Oracle 23ai (local/Docker) + PostgreSQL 16 (produção) |
| Testes back-end | JUnit 5 + Mockito |
| Testes E2E | Cypress |
| Deploy | Vercel (frontend) + Render (backend + PostgreSQL) |
| Container | Docker + Docker Compose |

---

## 📋 Pré-requisitos

Instale antes de começar:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Java 21](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/download.cgi)
- [Node.js LTS](https://nodejs.org/)

> Após instalar, feche e abra o terminal para o PATH atualizar.

---

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone https://github.com/paulodiasred/autoflex.git
cd autoflex
```


### 2. Suba o banco Oracle

```bash
docker compose up -d
```

Aguarde o status ficar `healthy`:

```bash
docker compose ps
```

### 3. Suba o back-end(com perfil local)

```bash
cd backend
QUARKUS_PROFILE=local ./mvnw quarkus:dev
```

Acesse para confirmar que está rodando:
- API: http://localhost:8080/api/health
- Swagger UI: http://localhost:8080/q/swagger-ui

### 4. Suba o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse o sistema em: **http://localhost:5173**

###🗄️ Configuração do banco de dados

Local (desenvolvimento) - Oracle no Docker
```bash
URL:    jdbc:oracle:thin:@localhost:1521/FREEPDB1
Usuário: app_user
Senha:   app_password
```
Produção (Render) - PostgreSQL
O banco PostgreSQL está hospedado no próprio Render. As variáveis de ambiente são configuradas automaticamente:

| Variável | Valor |
|----------|-------|
| `QUARKUS_DATASOURCE_JDBC_URL` | postgresql://... (gerada pelo Render) |
| `QUARKUS_DATASOURCE_USERNAME` | autoflex_user |
| `QUARKUS_DATASOURCE_PASSWORD` | (gerada pelo Render) |

> O Quarkus utiliza **perfis diferentes** (`%local` e `%prod`) para alternar automaticamente entre as configurações.

---

## Funcionalidades

- **Produtos** — cadastro completo com criar, editar e excluir, **com indicador visual de materiais associados**
- **Matérias-Primas** — cadastro com controle de estoque e unidade, **ordenadas por prioridade (estoque zerado/baixo primeiro)**
- **Associação** — vincule matérias-primas a cada produto com quantidade necessária
- **Capacidade de Produção** — calcula quantas unidades de cada produto podem ser produzidas com o estoque atual
- **Busca em tempo real** — filtro por nome, ID ou descrição em todas as listagens

### Regra de cálculo

Para cada produto, a quantidade possível é:

```
min( estoque_disponível / quantidade_necessária )
```

calculado para cada insumo — o mais escasso é o limitante.

**Exemplo:** Cadeira precisa de 2kg de Aço (estoque: 100kg) e 3kg de Plástico (estoque: 30kg)
→ min(100/2=50, 30/3=10) = **10 unidades**

---

## Rodando os testes

### Testes unitários (back-end)

```bash
cd backend
mvn test "-Dquarkus.datasource.devservices.enabled=false" "-Dquarkus.hibernate-orm.database.generation=none"
```

Resultado esperado: **20 testes, 0 falhas**

### Testes E2E (Cypress)

> Requer o sistema completo rodando (banco + back-end + front-end).

```bash
cd frontend
npm run cy:open   # interface visual (recomendado)
npm run cy:run    # terminal
```

---

## Estrutura do projeto

```
/
├── backend/               # API REST em Java + Quarkus
│   ├── src/
│   │   ├── main/java/     # Código fonte
│   │   └── test/java/     # Testes unitários
│   └── pom.xml
│
├── frontend/              # Interface React + Redux
│   ├── src/
│   ├── cypress/           # Testes E2E
│   └── package.json
│
├── docker-compose.yml     # Oracle via Docker
└── README.md
```

---

## Configuração do banco

### Local (desenvolvimento) - Oracle no Docker
URL: jdbc:oracle:thin:@localhost:1521/FREEPDB1
Usuário: app_user
Senha: app_password
### Produção (Render) - PostgreSQL
O banco PostgreSQL está hospedado no próprio Render. As variáveis de ambiente são configuradas automaticamente:
- `QUARKUS_DATASOURCE_JDBC_URL`
- `QUARKUS_DATASOURCE_USERNAME`  
- `QUARKUS_DATASOURCE_PASSWORD`

> O Quarkus usa **perfis diferentes** (`local` e `prod`) para alternar entre Oracle e PostgreSQL automaticamente.

Definida em `backend/src/main/resources/application.properties`:

```
URL:    jdbc:oracle:thin:@localhost:1521/FREEPDB1
Usuário: app_user
Senha:   app_password
```

As tabelas e sequences são criadas automaticamente pelo Hibernate ao subir o back-end.

---

## Requisitos atendidos

| Requisito | Status |
|---|---|
| RF001 — CRUD de produtos (back-end) | ✅ |
| RF002 — CRUD de matérias-primas (back-end) | ✅ |
| RF003 — Associação produto ↔ matéria-prima (back-end) | ✅ |
| RF004 — Cálculo de capacidade de produção | ✅ |
| RF005 — Interface CRUD de produtos (front-end) | ✅ |
| RF006 — Interface CRUD de matérias-primas (front-end) | ✅ |
| RF007 — Associação de materiais na tela de produtos | ✅ |
| RF008 — Tela de capacidade de produção | ✅ |
| RNF001 — Plataforma web (Chrome, Firefox, Edge) | ✅ |
| RNF002 — Back-end e front-end separados (API) | ✅ |
| RNF003 — Telas responsivas | ✅ |
| RNF004 — Banco de dados Oracle | ✅ |
| RNF005 — Framework Quarkus | ✅ |
| RNF006 — Framework React + Redux | ✅ |
| RNF007 — Código em inglês | ✅ |
| Desejável — Testes unitários back-end | ✅ |
| Desejável — Testes E2E com Cypress | ✅ |
| Extra — Busca em tempo real | ✅ |
| Extra — Ordenação inteligente (estoque baixo) | ✅ |
| Extra — Indicador visual de materiais | ✅ |

## 🌍 Deploy

### Frontend (Vercel)
- **Plataforma:** [Vercel](https://vercel.com)
- **URL:** [https://autoflex-lemon.vercel.app](https://autoflex-lemon.vercel.app)
- **Variável de ambiente:** `VITE_API_URL=https://autoflex-backend-0r3b.onrender.com/api`

### Backend (Render)
- **Plataforma:** [Render](https://render.com)
- **URL:** [https://autoflex-backend-0r3b.onrender.com](https://autoflex-backend-0r3b.onrender.com)
- **Tipo:** Docker (Java 21 + Quarkus)
- **Banco de dados:** PostgreSQL gerenciado pelo Render

### Banco de dados (Render)
- **Tipo:** PostgreSQL 16
- **Plano:** Free Tier
- **Backups automáticos:** Sim (diários)

## 📌 Observação

Este projeto foi desenvolvido integralmente por **Paulo Dias** como parte do processo seletivo da Autoflex. 
Todo o código, documentação e decisões técnicas refletem minha abordagem pessoal para resolver o desafio proposto.

**Data de entrega:** Fevereiro de 2026