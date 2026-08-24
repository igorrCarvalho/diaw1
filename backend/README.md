# API RESTful de Produtos

Atividade pratica: API REST em Node.js + Express, com dados mantidos em memoria
(array JavaScript), sem banco de dados.

## Como rodar localmente

```bash
npm install
npm start
```

O servidor sobe em `http://localhost:3000`.

## Rotas

| Metodo | Rota            | Operacao                    | Status de sucesso |
| ------ | --------------- | --------------------------- | ----------------- |
| GET    | `/produtos`     | Lista todos os produtos     | 200               |
| GET    | `/produtos/:id` | Consulta um produto         | 200 (404 se nao existir) |
| POST   | `/produtos`     | Cadastra um novo produto    | 201 (400 se dados invalidos) |
| PUT    | `/produtos/:id` | Altera um produto existente | 200 (404 / 400) |
| DELETE | `/produtos/:id` | Exclui um produto           | 204 (404 se nao existir) |

Exemplo de corpo para POST e PUT:

```json
{
  "descricao": "Monitor 24 polegadas",
  "preco": 899.90,
  "categoria": "Monitores",
  "estoque": 8
}
```

## Publicacao no Render

O servico no Render esta configurado como **Docker**, por isso existe o `Dockerfile`
na pasta `backend`.

Configuracao usada no Render:

- **Root Directory:** `backend`
- **Dockerfile Path:** `backend/./Dockerfile`
- **Docker Build Context Directory:** `backend/.`

A porta e lida de `process.env.PORT`, que o Render define automaticamente, entao
nao e preciso configurar mais nada. Depois do push, use **Manual Deploy > Deploy
latest commit** e anote a URL gerada, por exemplo
`https://minha-api-produtos.onrender.com`.

Para testar a imagem localmente antes de subir:

```bash
docker build -t api-produtos .
docker run -p 3000:3000 -e PORT=3000 api-produtos
```

## Plano de testes no Postman

Arquivo obrigatorio da entrega: a **collection**. O environment e opcional.

- `API-Produtos.postman_collection.json` — collection com os 10 casos de teste
- `API-Produtos.postman_environment.json` — environment opcional com a URL do Render

### Importar

1. No Postman: **Import** > arraste os dois arquivos JSON.
2. A collection ja vem com a variavel `baseUrl = http://localhost:3000` definida
   em **Collection > Variables**, entao ela funciona sem environment nenhum.
3. Para testar a API publicada, faca uma das duas coisas:
   - selecione o environment **API-Produtos - Render** no canto superior direito
     (troque o valor de `baseUrl` pela sua URL real); ou
   - edite `baseUrl` direto em **Collection > Variables** (mudar a coluna
     *Current value*) e salve com `Ctrl+S`.

### Executar

Use o **Collection Runner** (botao *Run* na collection) e rode as 10 requisicoes
na ordem. A ordem importa: o teste 04 cadastra um produto e guarda o id gerado na
variavel `idProduto` com

```js
pm.collectionVariables.set("idProduto", pm.response.json().id);
```

e os testes 05, 06, 07, 09 e 10 usam esse id na URL (`{{baseUrl}}/produtos/{{idProduto}}`).
Assim os testes funcionam mesmo que a API ja tenha outros produtos cadastrados.

### Casos de teste cobertos

| #  | Requisicao                       | Cenario                                  | Esperado |
| -- | -------------------------------- | ---------------------------------------- | -------- |
| 01 | GET `/produtos`                  | Consultar todos os produtos              | 200 + array |
| 02 | GET `/produtos/1`                | Consultar um produto existente           | 200 + atributos |
| 03 | GET `/produtos/999`              | Consultar um produto inexistente         | 404 |
| 04 | POST `/produtos`                 | Cadastrar um novo produto                | 201 + id gerado |
| 05 | GET `/produtos/{{idProduto}}`    | Consultar o produto recem-cadastrado     | 200 + dados iguais aos enviados |
| 06 | PUT `/produtos/{{idProduto}}`    | Alterar um produto existente             | 200 + dados alterados |
| 07 | GET `/produtos/{{idProduto}}`    | Verificar se a alteracao foi realizada   | 200 + dados alterados |
| 08 | PUT `/produtos/999`              | Alterar um produto inexistente           | 404 |
| 09 | DELETE `/produtos/{{idProduto}}` | Excluir um produto existente             | 204 sem corpo |
| 10 | GET `/produtos/{{idProduto}}`    | Verificar que o produto nao existe mais  | 404 |

Total: 26 assercoes na aba **Tests** (status HTTP, tipo da resposta, presenca dos
atributos `id`, `descricao`, `preco`, `categoria`, `estoque` e conferencia dos
valores gravados).

### Exportar a collection

Se voce alterar alguma coisa no Postman, exporte de novo antes de entregar:
**clique nos tres pontos ao lado da collection > Export > Collection v2.1 > Export**.
Para o environment: **Environments > tres pontos > Export**.

### Rodar os testes pelo terminal (opcional)

Com a API rodando localmente:

```bash
npx newman run API-Produtos.postman_collection.json
```

Contra a API publicada:

```bash
npx newman run API-Produtos.postman_collection.json --env-var baseUrl=https://minha-api-produtos.onrender.com
```
