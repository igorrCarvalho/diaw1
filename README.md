# API RESTful de Produtos

Atividade pratica: API REST em Node.js + Express, com dados mantidos em memoria
(array JavaScript), sem banco de dados.


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

https://diaw1.onrender.com/

