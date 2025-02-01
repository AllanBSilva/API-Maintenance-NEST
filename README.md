<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Descrição

Este repositório é um **esqueleto inicial** para projetos utilizando o framework [NestJS](https://github.com/nestjs/nest) com TypeScript. O NestJS é um framework progressivo para construir aplicativos eficientes e escaláveis do lado do servidor. Ele é baseado em Express (ou Fastify) e utiliza uma arquitetura inspirada no Angular, proporcionando um desenvolvimento mais organizado e modular.


# API de Manutenção de Equipamentos

Este projeto fornece uma API RESTful para gerenciar informações sobre equipamentos e suas manutenções. Ele permite cadastrar, editar, excluir e consultar equipamentos e suas manutenções associadas. Além disso, oferece funcionalidade de filtros para buscas específicas de equipamentos.

## Funcionalidades

- **Equipamentos**: Cadastro, edição, exclusão e consulta de equipamentos.
- **Manutenções**: Cadastro, edição, exclusão e consulta de manutenções associadas aos equipamentos.
- **Filtros**: Suporte a filtros para pesquisa de equipamentos por nome, ID, patrimônio, marca, modelo e setor.
- **Autenticação**: Sistema de login com JWT para autenticação de usuários.
- **Autorização**: Controle de permissões de acesso com base em papéis (roles) de usuários.
- **Usuários**: Cadastro de novos usuários com a definição de papéis (roles), consultar usuários, consultar por nome de usuário, exclusão edição, reset da senha.

## Swagger - Documentação da API

### Como acessar a documentação Swagger

O projeto já está configurado com o [Swagger](https://swagger.io/), o que proporciona uma documentação interativa da API. Após rodar o servidor localmente, você pode acessar a documentação da API no seguinte endereço:

```plaintext
http://localhost:3000/api
```


## Endpoints da API

### Usuários

#### `POST /users/create`

Cria um novo usuário. O campo role é opcional, e se não fornecido, o usuário será criado com o valor 0 (usuário comum).

**Exemplo de corpo da requisição**:

```json
{
  "username": "usuario1",
  "password": "senha123",
  "email": "seuemail@mail.com",
  "role": 1 //Opcional
}
```
**Resposta de sucesso:**:

```json
{
  "username": "usuario1",
  "password": "$2b$10$/oJ4tQfXARvaHooSbR4O9umoGkJploaQt6FMjTIsWDqkw0mhB10hO",
  "email": "seuemail@mail.com",
  "role": 1,
  "id": "19b958a2-eaae-46dc-b95b-8d7faf392306"
}
```
#### `GET /users`

Busca todos os usuários do sistema. Esse endpoint é protegido por autenticação, então é necessário fornecer um token de acesso válido.

**Resposta de sucesso:**:

```json
{
  "username": "usuario1",
  "password": "$2b$10$/oJ4tQfXARvaHooSbR4O9umoGkJploaQt6FMjTIsWDqkw0mhB10hO",
  "email": "seuemail@mail.com",
  "role": 1,
  "id": "19b958a2-eaae-46dc-b95b-8d7faf392306"
}
```

#### `GET /users/:name`

Busca um usuário pelo nome de usuário fornecido na URL.

**Exemplo de URL**:

```bash
GET /users/usuario1
```

**Resposta de sucesso**:

```json
    {
    "username": "usuario1",
    "password": "$2b$10$/oJ4tQfXARvaHooSbR4O9umoGkJploaQt6FMjTIsWDqkw0mhB10hO",
    "email": "seuemail@mail.com",
    "role": 1,
    "id": "19b958a2-eaae-46dc-b95b-8d7faf392306"
    }
```

#### `PUT /users/:id`

Atualiza os dados de um usuário, como o nome de usuário, a senha ou o role. O ID do usuário é fornecido na URL.

**Exemplo de corpo da requisição**:

```json
{
  "username": "testuser", //Opcional
  "password": "testpassword", //Opcional
  "email": "seuemail@mail.com", //Opcional
  "role": 1 //Opcional
}
```

**Resposta de sucesso:**:

```json
{
    "username": "testuser",
    "password": "$2b$10$/oJ4tQfXARvaHooSbR4O9umoGkJploaQt6FMjTIsWDqkw0mhB10hO",
    "email": "seuemail@mail.com",
    "role": 1,
    "id": "19b958a2-eaae-46dc-b95b-8d7faf392306"
}
```
#### `DELETE /users/:id`

Deleta um usuário do sistema, utilizando o ID do usuário fornecido na URL.

**Exemplo de URL**:

```bash
DELETE /user/19b958a2-eaae-46dc-b95b-8d7faf392306
```

**Resposta de sucesso**:

```json
{
  "message": "Usuário deletado com sucesso"
}
```
**Resposta de erro** (quando o usuário não é encontrado):

```json
{
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

#### `POST /users/recover-password`

Envia um e-mail de recuperação de senha para o usuário. O e-mail contém um link com um token único, permitindo que o usuário redefina sua senha.

**Exemplo de corpo da requisição**:

```json
{
  "email": "usuario1@exemplo.com"
}
```

**Resposta de sucesso**:

```json
{
  "message": "E-mail enviado com sucesso"
}
```
**Resposta de erro** (quando o usuário não é encontrado):

```json
{
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

#### `PATCH /users/reset-password`

Reset da senha do usuário utilizando um token de recuperação. O token é enviado no corpo da requisição e validado para garantir que está correto e não expirou.

**Exemplo de corpo da requisição**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsbGFuLWFic25vdm9AaG90bWFpbC5jb20iLCJpYXQiOjE3MzgyNzAyNjQsImV4cCI6MTczODI3Mzg2NH0.2mpcYxj1BmpKMIAbtV88Z6y0K57kwKsJyUUQAeQELHA",
  "newPassword": "novaSenha123"
}
```

**Resposta de sucesso**:

```json
{
  "message": "Senha resetada com sucesso"
}
```
**Resposta de erro** (quando o usuário não é encontrado):

```json
{
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

### Autenticação

#### `POST /auth/login`

Autentica um usuário e gera um token JWT.

**Exemplo de corpo da requisição**:

```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

**Resposta de sucesso:**:

```json
{
  "access_token": "jwt_token_aqui"
}
```

### Equipamentos

#### Controle de Acesso as rotas

Para acessar todas as rotas de equipamentos é exigido que o usuário esteja autenticado para ser acessada.

##### Cabeçalho da requisição:

```headers
Authorization: Bearer jwt_token_aqui
```

Todas as requisições devem possuir um Header.


#### `POST /equipment`

Cria um novo equipamento.

**Exemplo de corpo da requisição**:

```json
{
  "numeroSerie": "ABC123456",
  "patrimonio": "PAT002",
  "nome": "Equipamento Teste2",
  "marca": "Marca A",
  "modelo": "Modelo X",
  "setor": "Setor 1"
}
```

**Resposta de sucesso:**:

```json
{
    "numeroSerie": "ABC123456",
    "patrimonio": "PAT002",
    "nome": "Equipamento Teste2",
    "marca": "Marca A",
    "modelo": "Modelo X",
    "setor": "Setor 1",
    "id": 4
}
```

#### `GET /equipment`

Consulta todos os equipamentos. É possível passar filtros pela query string (por exemplo, nome e setor).

**Resposta de sucesso**:

```json
[
    {
        "id": 1,
        "numeroSerie": "ABC123456",
        "patrimonio": "PAT001",
        "nome": "Equipamento Teste",
        "marca": "Marca A",
        "modelo": "Modelo X",
        "setor": "Setor 1"
    }
]
```

#### `GET /equipment/:id`

Consulta um equipamento específico pelo ID.

**Exemplo de URL**:

```bash
GET /equipment/1
```

**Resposta de sucesso**:

```json
[
    {
        "id": 1,
        "numeroSerie": "ABC123456",
        "patrimonio": "PAT001",
        "nome": "Equipamento Teste",
        "marca": "Marca A",
        "modelo": "Modelo X",
        "setor": "Setor 1"
    }
]
```

#### `PUT /equipment/:id`

Atualiza os dados de um equipamento pelo ID.

**Exemplo de corpo da requisição**:

```json
{
  "numeroSerie": "ABC123456",
  "patrimonio": "PAT001",
  "nome": "Equipamento Teste",
  "marca": "Marca A",
  "modelo": "Modelo X",
  "setor": "Setor 1"
}
```

**Resposta de sucesso**:

```json
  {
    "numeroSerie": "ABC123456",
    "patrimonio": "PAT001",
    "nome": "Equipamento Teste1",
    "marca": "Marca A",
    "modelo": "Modelo X",
    "setor": "Setor 1"
  }
```

#### `DELETE /equipment/:id`

Exclui um equipamento pelo ID.

**Exemplo de URL**:

```bash
DELETE /equipment/1
```

**Resposta de sucesso**:

```json
{
  "message": "Equipamento excluído com sucesso"
}
```

### Manutenção

#### Controle de Acesso as rotas

Para acessar todas as rotas de equipamentos é exigido que o usuário esteja autenticado para ser acessada.

##### Cabeçalho da requisição:

```headers
Authorization: Bearer jwt_token_aqui
```

Todas as requisições devem possuir um Header.

#### `POST /maintenance/:equipmentId`

Cria uma manutenção associada a um equipamento.

**Exemplo de corpo da requisição**:

```json
{
  "tipoManutencao": "Corretiva",
  "ocorrencia": "Verificação de sistema",
  "causa": "Problema de software",
  "solucao": "Atualização do sistema",
  "dataEntrada": "2025-01-23",
  "dataSolucao": "2025-01-24",
  "tecnicoExecutor": "Carlos Silva"
}
```

**Resposta de sucesso:**:

```json
{
    "tipoManutencao": "Corretiva",
    "ocorrencia": "Verificação de sistema",
    "causa": "Problema de software",
    "solucao": "Atualização do sistema",
    "dataEntrada": "2025-01-23",
    "dataSolucao": "2025-01-24",
    "tecnicoExecutor": "Carlos Silva",
    "equipamento": {
        "id": 1,
        "numeroSerie": "ABC123456",
        "patrimonio": "PAT001",
        "nome": "Equipamento Teste",
        "marca": "Marca A",
        "modelo": "Modelo X",
        "setor": "Setor 1"
    },
    "numeroManutencao": "20250000002",
    "id": 3
}
```

#### `GET /maintenance/:id`

Consulta uma manutenção específico pelo ID.

**Exemplo de URL**:

```bash
GET /maintenance/1
```

**Resposta de sucesso**:

```json
{
    "id": 1,
    "numeroManutencao": "20250000001",
    "tipoManutencao": "Preventiva",
    "ocorrencia": "Verificação de sistema",
    "causa": "Problema de software",
    "solucao": "Atualização do sistema",
    "dataEntrada": "2025-01-23",
    "dataSolucao": "2025-01-24",
    "tecnicoExecutor": "Carlos Silva",
    "equipamento": {
        "id": 1,
        "numeroSerie": "ABC123456",
        "patrimonio": "PAT001",
        "nome": "Equipamento Teste",
        "marca": "Marca A",
        "modelo": "Modelo X",
        "setor": "Setor 1"
    }
}
```

#### `PUT /maintenance/:id`

Atualiza os dados de uma manutenção pelo ID.

**Exemplo de corpo da requisição**:

```json
{
  "tipoManutencao": "Corretiva",
  "ocorrencia": "Falha no sistema",
  "causa": "Erro no hardware",
  "solucao": "Substituição de peça",
  "dataEntrada": "2025-01-23",
  "dataSolucao": "2025-01-24",
  "tecnicoExecutor": "Paulo Santos"
}
```

**Resposta de sucesso**:

```json
{
    "id": 3,
    "numeroManutencao": "20250000002",
    "tipoManutencao": "Corretiva",
    "ocorrencia": "Falha no sistema",
    "causa": "Erro no hardware",
    "solucao": "Substituição de peça",
    "dataEntrada": "2025-01-23",
    "dataSolucao": "2025-01-24",
    "tecnicoExecutor": "Paulo Santos"
}
```

#### `DELETE /maintenance/:id`

Exclui uma manutenção pelo ID.

**Exemplo de URL**:

```bash
DELETE /maintenance/1
```

**Resposta de sucesso**:

```json
{
  "message": "Manutenção excluída com sucesso"
}
```
#### `GET /maintenance/equipment/:equipmentId`

Consulta todas as manutenções associadas a um equipamento.

**Exemplo de URL**:

```bash
GET /maintenance/equipment/1
```

**Resposta de sucesso**:

```json
[
    {
        "id": 1,
        "numeroManutencao": "20250000001",
        "tipoManutencao": "Preventiva",
        "ocorrencia": "Verificação de sistema",
        "causa": "Problema de software",
        "solucao": "Atualização do sistema",
        "dataEntrada": "2025-01-23",
        "dataSolucao": "2025-01-24",
        "tecnicoExecutor": "Carlos Silva"
    }
]
```

# Como rodar o projeto

## 1 - Clone este repositório:


```bash

git clone https://github.com/seu-usuario/manutencao-equipamentos.git

```

## 2 - Instale as dependências:


```bash

cd manutencao-equipamentos
npm install

```

## 3 - Rode o servidor:


```bash

npm run start

```
O servidor estará rodando em http://localhost:3000.


# Banco de Dados

- A aplicação utiliza o **SQLite** como banco de dados para persistência de dados.
- A tabela de ***equipamentos e manutenções*** são criadas automaticamente ao iniciar o servidor, usando as entidades definidas no projeto.

# Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## Explicação do conteúdo:
- **Introdução**: Apresenta o propósito da API.
- **Funcionalidades**: Descreve as principais funcionalidades da API (Equipamentos, Manutenções e Filtros).
- **Endpoints**: Explica todos os endpoints disponíveis, com exemplos de requisições e respostas.
- **Como rodar o projeto**: Passos para rodar a API localmente.
- **Banco de Dados**: Informações sobre o banco de dados utilizado (SQLite) e a criação automática de tabelas.
- **Contribuições**: Como os desenvolvedores podem contribuir para o projeto.



