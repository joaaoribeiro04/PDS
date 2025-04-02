# PDS_project

Projeto da Unidade Curricular (UC) de Projeto de Desenvolvimento de Software (PDS).

## Descrição

Brevemente.

## Estrutura do Projeto

```
API/
├── src/
│   ├── app.js          # Configuração principal da aplicação Express
│   ├── server.js       # Inicialização do servidor
│   ├── config/         # Configurações do projeto
│   ├── migrations/     # Ficheiros de migração
│   ├── routes/         # Definição de rotas
│   └── services/       # Serviços e lógica de negócio
├── test/
│   ├── app.test.js     # Testes para a aplicação
│   ├── server.test.js  # Testes para o servidor
│   ├── jest.test.js    # Testes de validação do Jest
│   └── routes/         # Testes relacionados com as rotas
├── package.json        # Configurações do projeto e dependências
├── eslint.config.mjs   # Configuração do ESLint
└── .gitignore          # Ficheiros ignorados pelo Git
```

## Scripts Disponíveis

Os seguintes scripts podem ser executados usando `npm run <script>`:

- **start**: Inicia o servidor na porta 3001.
- **test**: Executa os testes automatizados com Jest.
- **lint**: Verifica e corrige problemas de linting no código.
- **secure-mode**: Executa os testes em modo de observação contínua.

## Dependências Principais

- **Express**: Framework para criação de APIs.
- **Jest**: Framework de testes.
- **Supertest**: Biblioteca para testar APIs HTTP.
- **ESLint**: Ferramenta para análise de código estático.

## Como Executar o Projeto

1. Instale as dependências:
   ```sh
   npm install
   ```

2. Inicie o servidor:
   ```sh
   npm run start
   ```

3. Aceda à API em `http://localhost:3001`.

## Como Executar os Testes

Para executar os testes automatizados, utilize o comando:
```sh
npm run test
```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

