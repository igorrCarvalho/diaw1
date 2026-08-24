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
];

// guarda o proximo id que sera usado no cadastro
let proximoId = 4;

// GET /produtos - lista todos os produtos
app.get("/produtos", (req, res) => {
  res.status(200).json(produtos);
});

app.listen(PORTA, () => {
  console.log("Servidor rodando na porta " + PORTA);
});
