## 🚀 API Jitterbit - Gestão de Pedidos

Bem-vindo(a) ao API Jitterbit, um desafio técnico focado em um sistema de pedidos. 

## 📦 Tecnologias Utilizadas: 

Runtime: Node.js v20

Framework: Express.js

Banco de Dados: MongoDB (NoSQL)

Containerização: Docker & Docker Compose

Segurança: JWT & Bcryptjs


## ▶️ Como Rodar a Aplicação:

Clone o repositório: https://github.com/larisbitencourt/api-jitterbit

cd api-jitterbit

Suba os containers: docker-compose up -d --build

💡 O que o Docker fará automaticamente:

Baixar as imagens oficiais do Node.js e MongoDB.

Instalar todas as dependências do package.json.

Rodar o Seed: Popular o banco com uma lista de 20 produtos e 2 usuários (admin e user) iniciais.

Hot-reload: A API utiliza nodemon, reiniciando automaticamente a cada alteração no código.

Se precisar visualizar os logs em tempo real, rode: docker logs -f api-jitterbit

Não é necessário rodar comandos dentro do container, todas as depêndencias são instaladas ao subí-lo. 

## 📍  Para acessar a API: 

Endpoint Base: http://localhost:3000

Acesso Direto ao MongoDB: localhost:27018

## 📬 Collection do postman:

Para facilitar a análise no Postman, importe o arquivo postman_collection.json localizado na raiz do projeto. As rotas já estão configuradas para o ambiente local.


## 🛣️ Guia de Requisições (Exemplos de JSON), em caso de não utilização do postman:

1. Criar Usuário (POST /users)

JSON

{
  "name": "Ana",
  "email": "dev@teste.com",
  "password": "senha123",
  "role": "user" 
}

2. Criar Pedido (POST /orders)

JSON

{
  "numeroPedido": "JIT-2026",
  "valorTotal": 1500.50,
  "dataCriacao": "2026-03-07T14:00:00Z",
  "items": [
    {
      "idItem": "1",
      "quantidadeItem": 2,
      "valorItem": 750.25
    }
  ]
}

3. Atualizar Pedido (PUT /orders/:orderId)

JSON

{
  "valorTotal": 1800.00,
  "items": [
    {
      "idItem": "1",
      "quantidadeItem": 3,
      "valorItem": 600.00
    }
  ]
}

## 🔐 Segurança e Autenticação (JWT)

A API utiliza JWT para proteger as rotas de pedidos. A dinâmica funciona da seguinte forma:

Obtenção do Token: O usuário deve realizar um POST em /login com as credenciais cadastradas (E-mail e Senha).

Validação: O sistema verifica se a senha (hasheada com bcryptjs) confere com a do banco.

Geração: Se os dados estiverem corretos, a API retorna um token de acesso.

Uso nas Rotas: Para acessar qualquer rota de Orders, o token deve ser enviado no Header ou Auth da requisição no Postman

Header > Key: Authorization e Value: Bearer <SEU_TOKEN_AQUI>

ou

Auth > Selecionar no Auth Type o Bearer Token para inserir o token gerado

## 📦 Regras de Negócio 

Geração de Estoque: No processo de seed (população inicial), as quantidades dos 20 produtos foram geradas de forma aleatória, garantindo um cenário de teste real para validação de falta de estoque.

Criação de Usuários: Inicialmente já se populam dois usuários, um user e um admin, porém existe a rota POST /users caso queira criar
um novo usuário, e pode validállo na rota POST/login



