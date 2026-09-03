# CRUD de Produtos

Atividade pratica: API REST em Node.js + Express, com dados mantidos em memoria
(array JavaScript), sem banco de dados, e uma interface web em HTML, CSS e
JavaScript vanilla que consome essa API via `fetch()`.

O Express exerce os dois papeis: disponibiliza a API REST e serve os arquivos
estaticos do frontend a partir de `src/public`.


## Como executar

```bash
cd src
npm install
npm start
```

A aplicacao fica em http://localhost:3000


## Rotas

| Metodo | Rota            | Operacao                    | Status de sucesso |
| ------ | --------------- | --------------------------- | ----------------- |
| GET    | `/`             | Interface web               | 200               |
| GET    | `/api`          | Lista as rotas disponiveis  | 200               |
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

## Interface Web

A pagina em `src/public` lista os produtos em tabela (ID, descricao, preco,
categoria, estoque e acoes) e permite:

- cadastrar um produto pelo formulario (`POST /produtos`);
- editar um produto existente, que carrega os dados no mesmo formulario
  (`GET /produtos/:id` e `PUT /produtos/:id`);
- excluir um produto pela propria linha da tabela (`DELETE /produtos/:id`).

Depois de cada inclusao, alteracao ou exclusao a listagem e recarregada a partir
da API, entao a tela sempre mostra o estado atual dos dados.


## Publicacao no Render

https://diaw1.onrender.com/

