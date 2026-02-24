<div align="right">
  <sub>Desenvolvido por <a href="https://github.com/paulodiasred"><strong>Paulo Dias</strong></a> 🚀</sub>
</div>

# Autoflex Challenge — Sistema de Capacidade de Produção

Sistema web fullstack para gerenciamento de produtos e matérias-primas, com cálculo automático de capacidade de produção com base no estoque disponível.

---

## 👨‍💻 Sobre o desenvolvedor

**Paulo Dias** é um desenvolvedor fullstack com experiência em Java, Quarkus, React e bancos de dados relacionais. 
Este projeto foi desenvolvido como parte do desafio técnico para a vaga de desenvolvedor na Autoflex.

📫 **Contato:** pauloalberto13@gmail.com  
🔗 **LinkedIn:** [linkedin.com/in/paulodiasdeveloper](https://linkedin.com/in/paulodiasdeveloper)  
🐙 **GitHub:** [github.com/paulodiasred](https://github.com/paulodiasred)


## Tecnologias

| Camada | Tecnologia |
|---|---|
| Back-end | Java 21 + Quarkus |
| Front-end | React + Redux Toolkit |
| Banco de dados | Oracle (via Docker) |
| Testes back-end | JUnit 5 + Mockito |
| Testes E2E | Cypress |

---

## Pré-requisitos

Instale antes de começar:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Java 21](https://adoptium.net/)
- [Maven 3.9+](https://maven.apache.org/download.cgi)
- [Node.js LTS](https://nodejs.org/)

> Após instalar, feche e abra o terminal para o PATH atualizar.

---

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO
```

### 2. Suba o banco Oracle

```bash
docker compose up -d
```

Aguarde o status ficar `healthy`:

```bash
docker compose ps
```

### 3. Suba o back-end

```bash
cd backend
mvn quarkus:dev
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
├── backend/          # API REST em Java + Quarkus
├── frontend/         # Interface React + Redux
├── docker-compose.yml    # Oracle via Docker
```

---

## Configuração do banco

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

## 📌 Observação

Este projeto foi desenvolvido integralmente por **Paulo Dias** como parte do processo seletivo da Autoflex. 
Todo o código, documentação e decisões técnicas refletem minha abordagem pessoal para resolver o desafio proposto.

**Data de entrega:** Fevereiro de 2026