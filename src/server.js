const express = require("express");

const app = express();

// permite receber JSON no corpo das requisicoes
app.use(express.json());

const PORTA = process.env.PORT || 3000;

// "banco de dados" em memoria
let produtos = [
  {
    id: 1,
    descricao: "Teclado Mecânico",
    preco: 249.9,
    categoria: "Periféricos",
    estoque: 15,
  },
  {
    id: 2,
    descricao: "Mouse sem fio",
    preco: 89.9,
    categoria: "Periféricos",
    estoque: 25,
  },
  {
    id: 3,
    descricao: "Monitor 24 polegadas",
    preco: 899.9,
    categoria: "Monitores",
    estoque: 8,
  },
  {
    id: 4,
    descricao: "Cadeira Gamer",
    preco: 1199.0,
    categoria: "Móveis",
    estoque: 5,
  },
  {
    id: 5,
    descricao: "Headset Bluetooth",
    preco: 199.9,
    categoria: "Periféricos",
    estoque: 30,
  },
];

// guarda o proximo id que sera usado no cadastro
let proximoId = 6;

// verifica se os dados enviados pelo usuario estao corretos
function validarProduto(dados) {
  const erros = [];

  if (typeof dados.descricao !== "string" || dados.descricao.trim() === "") {
    erros.push("descricao e obrigatoria e deve ser um texto");
  }

  if (typeof dados.preco !== "number" || dados.preco < 0) {
    erros.push("preco e obrigatorio e deve ser um numero maior ou igual a zero");
  }

  if (typeof dados.categoria !== "string" || dados.categoria.trim() === "") {
    erros.push("categoria e obrigatoria e deve ser um texto");
  }

  if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
    erros.push("estoque e obrigatorio e deve ser um numero inteiro maior ou igual a zero");
  }

  return erros;
}

// rota inicial, so para saber que a API esta no ar
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Produtos",
    rotas: [
      "GET /produtos",
      "GET /produtos/:id",
      "POST /produtos",
      "PUT /produtos/:id",
      "DELETE /produtos/:id",
    ],
  });
});

// GET /produtos - lista todos os produtos
app.get("/produtos", (req, res) => {
  res.status(200).json(produtos);
});

// GET /produtos/:id - busca um produto pelo id
app.get("/produtos/:id", (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: "Produto nao encontrado" });
  }

  res.status(200).json(produto);
});

// POST /produtos - cadastra um novo produto
app.post("/produtos", (req, res) => {
  const erros = validarProduto(req.body);

  if (erros.length > 0) {
    return res.status(400).json({ erro: "Dados invalidos", detalhes: erros });
  }

  const novoProduto = {
    id: proximoId,
    descricao: req.body.descricao,
    preco: req.body.preco,
    categoria: req.body.categoria,
    estoque: req.body.estoque,
  };

  proximoId = proximoId + 1;
  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
});

// PUT /produtos/:id - altera um produto existente
app.put("/produtos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = produtos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Produto nao encontrado" });
  }

  const erros = validarProduto(req.body);

  if (erros.length > 0) {
    return res.status(400).json({ erro: "Dados invalidos", detalhes: erros });
  }

  const produtoAtualizado = {
    id: id,
    descricao: req.body.descricao,
    preco: req.body.preco,
    categoria: req.body.categoria,
    estoque: req.body.estoque,
  };

  produtos[indice] = produtoAtualizado;

  res.status(200).json(produtoAtualizado);
});

// DELETE /produtos/:id - exclui um produto
app.delete("/produtos/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = produtos.findIndex((p) => p.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: "Produto nao encontrado" });
  }

  produtos.splice(indice, 1);

  res.status(204).send();
});
app.use(express.static("public"));
app.listen(PORTA, () => {
  console.log("Servidor rodando na porta " + PORTA);
});
