const API_URL = "/produtos"

const tableContainer = document.getElementById("productsTableContainer")
const form = document.getElementById("productForm")
const feedback = document.getElementById("feedback")
const formTitle = document.getElementById("formTitle")
const submitButton = document.getElementById("submitButton")
const cancelButton = document.getElementById("cancelButton")

// id do produto em edicao; null significa que o formulario esta em modo de cadastro
let editingId = null

// faz a requisicao e transforma erro da API em Error com mensagem legivel
async function request(url, options) {
    const response = await fetch(url, options)

    if (!response.ok) {
        const corpo = await response.json().catch(() => null)
        const mensagem = corpo?.erro ?? `Erro ${response.status}`
        const detalhes = corpo?.detalhes ? `: ${corpo.detalhes.join(", ")}` : ""
        throw new Error(mensagem + detalhes)
    }

    // DELETE responde 204 sem corpo
    return response.status === 204 ? null : response.json()
}

async function getProducts() {
    return request(API_URL)
}

async function getProduct(id) {
    return request(`${API_URL}/${id}`)
}

async function updateProduct(id, product) {
    return request(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    })
}

async function deleteProduct(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" })
}

async function createProduct(product) {
    return request(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    })
}

function showFeedback(message, isError = false) {
    feedback.textContent = message
    feedback.className = isError ? "text-sm text-red-600" : "text-sm text-green-700"
}

// le os campos do formulario ja convertidos para os tipos que a API espera
function readForm() {
    return {
        descricao: document.getElementById("descricao").value.trim(),
        preco: Number(document.getElementById("preco").value),
        categoria: document.getElementById("categoria").value.trim(),
        estoque: Number(document.getElementById("estoque").value),
    }
}

function resetForm() {
    form.reset()
    editingId = null
    formTitle.textContent = "Novo produto"
    submitButton.textContent = "Cadastrar"
    cancelButton.classList.add("hidden")
}

// busca o produto na API e coloca o formulario em modo de edicao
async function startEdit(id) {
    const product = await getProduct(id)

    document.getElementById("descricao").value = product.descricao
    document.getElementById("preco").value = product.preco
    document.getElementById("categoria").value = product.categoria
    document.getElementById("estoque").value = product.estoque

    editingId = product.id
    formTitle.textContent = `Editando produto ${product.id}`
    submitButton.textContent = "Salvar"
    cancelButton.classList.remove("hidden")
}

function buildProductCard(product) {
    const card = document.createElement("article")
    card.className = "productCard productRow w-full py-1"
    card.dataset.id = product.id

    const valores = [
        product.id,
        product.descricao,
        product.preco.toFixed(2),
        product.categoria,
        product.estoque,
    ]

    // textContent evita que a descricao cadastrada seja interpretada como html
    valores.forEach((valor) => {
        const celula = document.createElement("p")
        celula.textContent = valor
        card.appendChild(celula)
    })

    const acoes = document.createElement("p")
    acoes.className = "flex gap-2"
    acoes.innerHTML = `
        <button type="button" data-action="edit"
            class="border border-zinc-300 rounded px-2 cursor-pointer">Editar</button>
        <button type="button" data-action="delete"
            class="border border-red-300 text-red-700 rounded px-2 cursor-pointer">Excluir</button>
    `
    card.appendChild(acoes)

    return card
}

function buildProductsTable(products) {
    // limpa antes de redesenhar, senao as linhas se acumulam a cada atualizacao
    tableContainer.innerHTML = ""

    products.forEach((product) => {
        tableContainer.appendChild(buildProductCard(product))
    })
}

async function loadProducts() {
    const products = await getProducts()
    buildProductsTable(products)
}

// um listener no container atende os botoes de todas as linhas
tableContainer.addEventListener("click", async (event) => {
    const botao = event.target.closest("button[data-action]")

    if (!botao) {
        return
    }

    const id = Number(botao.closest(".productCard").dataset.id)

    if (botao.dataset.action === "edit") {
        try {
            await startEdit(id)
            showFeedback("")
        } catch (error) {
            showFeedback(error.message, true)
        }

        return
    }

    if (botao.dataset.action === "delete") {
        if (!confirm(`Excluir o produto ${id}?`)) {
            return
        }

        try {
            await deleteProduct(id)
            await loadProducts()
            showFeedback("Produto excluido com sucesso")
        } catch (error) {
            showFeedback(error.message, true)
        }
    }
})

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    try {
        const product = readForm()

        if (editingId === null) {
            await createProduct(product)
        } else {
            await updateProduct(editingId, product)
        }

        const mensagem = editingId === null
            ? "Produto cadastrado com sucesso"
            : "Produto alterado com sucesso"

        resetForm()
        await loadProducts()
        showFeedback(mensagem)
    } catch (error) {
        showFeedback(error.message, true)
    }
})

cancelButton.addEventListener("click", () => {
    resetForm()
    showFeedback("")
})

async function main() {
    try {
        await loadProducts()
    } catch (error) {
        showFeedback(error.message, true)
    }
}

main()
