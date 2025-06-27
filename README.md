# 🚀 Projeto PDS – Backend de Gestão de Dados

---

## 📚 Descrição  
O **PDS – Backend** é uma API desenvolvida para gerir, processar e disponibilizar dados estruturados de forma eficiente. Ideal para integração com aplicações front-end, dashboards ou sistemas de análise, o projeto aplica boas práticas de arquitetura, autenticação e testes.

---

## 🛠️ Tecnologias e Ferramentas Utilizadas  
- **Linguagem & Framework**: Node.js + Express *(ajusta se necessário)*  
- **Base de Dados**: PostgreSQL *(ou outra)*  
- **ORM/ODM**: Sequelize / TypeORM / Mongoose  
- **Autenticação & Autorização**: JWT (JSON Web Tokens)  
- **Testes**: Jest *(ou outra framework)*  
- **Controlo de Versão**: Git + GitHub  
- **Contêineres**: Docker + Docker Compose *(opcional)*  

---

## 📁 Estrutura do Projeto  
```bash
PDS-Backend/
├── src/
│ ├── controllers/ # Endpoints HTTP
│ ├── services/ # Lógica de negócio
│ ├── models/ # Modelos de dados
│ ├── routes/ # Definição das rotas da API
│ ├── middlewares/ # Autenticação, logging, etc.
│ └── config/ # Configurações (DB, ambiente, JWT)
├── tests/ # Testes unitários e de integração
├── .env.example # Variáveis de ambiente de exemplo
├── Dockerfile # Imagem Docker
├── docker-compose.yml # Orquestração de serviços
└── README.md # Documentação do projeto
---
```
## ⚙️ Instalação e Configuração

1. **Clonar o repositório**
```bash
git clone https://github.com/joaaoribeiro04/PDS-Backend.git
cd PDS-Backend

```

2. **Configurar variáveis de ambiente**
Cria um ficheiro .env com base no .env.example:

```bash
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/pdsdb
JWT_SECRET=umSegredoSuperSeguro

```

3. **Instalar dependências e executar**

```bash
npm install
npm run dev             # Modo desenvolvimento
npm run build && npm start   # Produção

```
