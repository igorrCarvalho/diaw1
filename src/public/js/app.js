async function getProducts() {
    const response = await fetch("/produtos")

    if (!response.ok) {
        throw new Error(`Falha ao buscar produtos: ${response.status}`)
    }

    return response.json()
}

function buildProductCard(product) {
    const card = document.createElement("article")
    card.className = "productCard productRow w-full"

    card.innerHTML = `
        <p>${product.id}</p>
        <p>${product.descricao}</p>
        <p>${product.preco}</p>
        <p>${product.categoria}</p>
        <p>${product.estoque}</p>
        <p></p>
    `

    return card
}

function buildProductsTable(products) {
    const container = document.getElementById("productsTableContainer")

    products.forEach((product) => {
        container.appendChild(buildProductCard(product))
    })
}

async function main() {
    try {
        const products = await getProducts()
        buildProductsTable(products)
    } catch (error) {
        console.error(error)
    }
}

main()
