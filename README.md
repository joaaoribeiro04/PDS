# PDS_project

Projeto da Unidade Curricular (UC) de Projeto de Desenvolvimento de Software (PDS).

## Descrição

Este projeto é uma API desenvolvida em Node.js com Express, que implementa funcionalidades para gestão de utilizadores, pedidos, encomendas, avisos, comunicados, faturas e relatórios. Ele utiliza o PostgreSQL como base de dados e inclui autenticação JWT, autorização baseada em papéis e tarefas agendadas com Node-Cron.

## Estrutura do Projeto

```
API/
├── src/
│   ├── app.js          # Configuração principal da aplicação Express
│   ├── server.js       # Inicialização do servidor
│   ├── config/         # Configurações do projeto (rotas, middlewares, autenticação)
│   ├── migrations/     # Ficheiros de migração do banco de dados
│   ├── routes/         # Definição de rotas da API
│   ├── services/       # Serviços e lógica de negócio
│   ├── cron/           # Tarefas agendadas
│   └── errors/         # Tratamento de erros personalizados
├── test/
│   ├── app.test.js     # Testes para a aplicação
│   ├── server.test.js  # Testes para o servidor
│   ├── jest.test.js    # Testes de validação do Jest
│   └── routes/         # Testes relacionados com as rotas
├── package.json        # Configurações do projeto e dependências
├── eslint.config.mjs   # Configuração do ESLint
└── .gitignore          # Ficheiros ignorados pelo Git
```

## Funcionalidades

- **Autenticação e Autorização**:
  - Autenticação via JWT.
  - Controlo de acesso baseado em papéis (Admin, Worker, Resident).

- **Gestão de Recursos**:
  - Utilizadores: CRUD de utilizadores com validação de dados.
  - Pedidos: Registo e atualização de pedidos.
  - Encomendas: Fluxo de trabalho para encomendas (registo, entrega, conclusão).
  - Avisos: Criação e gestão de avisos para residentes.
  - Comunicados: Publicação e atualização de comunicados.
  - Faturas: Emissão e envio de faturas mensais.
  - Relatórios: Emissão de relatórios financeiros mensais.

- **Tarefas Agendadas**:
  - Processamento mensal para emissão de faturas e envio de relatórios.

- **Testes Automatizados**:
  - Testes unitários e de integração para rotas e serviços.

## Scripts Disponíveis

Os seguintes scripts podem ser executados usando `npm run <script>`:

- **start**: Inicia o servidor na porta 3001.
- **test**: Executa os testes automatizados com Jest.
- **lint**: Verifica e corrige problemas de linting no código.
- **secure-mode**: Executa os testes em modo de observação contínua.
- **test:reset**: Restaura a base de dados para o estado inicial.

## Dependências Principais

- **Express**: Framework para criação de APIs.
- **Knex**: Query builder para interagir com a base de dados PostgreSQL.
- **Passport**: Middleware para autenticação.
- **JWT-Simple**: Biblioteca para emissão e verificação de tokens JWT.
- **Node-Cron**: Agendamento de tarefas.
- **Nodemailer**: Envio de e-mails.
- **PDFKit**: Emissão de PDFs.

## Como Executar o Projeto

1. Instalar as dependências:
   ```sh
   npm install
   ```

2. Executar as migrações do banco de dados:
   ```sh
   npx knex migrate:latest --env test
   ```

3. Iniciar o servidor:
   ```sh
   npm run start
   ```

4. Acessar a API em `http://localhost:3001`.

## Como Executar os Testes

Para executar os testes automatizados, utilize o comando:
```sh
npm run secure-mode
```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).