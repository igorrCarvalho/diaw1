const API_URL = "/produtos"

const tableContainer = document.getElementById("productsTableContainer")
const form = document.getElementById("productForm")
const feedback = document.getElementById("feedback")

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
        await createProduct(readForm())
        resetForm()
        await loadProducts()
        showFeedback("Produto cadastrado com sucesso")
    } catch (error) {
        showFeedback(error.message, true)
    }
})

async function main() {
    try {
        await loadProducts()
    } catch (error) {
        showFeedback(error.message, true)
    }
}

main()
