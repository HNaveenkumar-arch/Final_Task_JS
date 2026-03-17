const api = "https://fakestoreapi.com/products";
const productList = document.getElementById("productList");
const errorMsg = document.getElementById("errorMsg");
let allProducts = [];
let cart = [];

fetch(api)
.then(res => res.json())
.then(data => {
    console.log(data);

    document.getElementById("loading").innerText = "";
    allProducts = data;
    showProducts(data);
})
.catch(err => {
    console.log("Error loading data");
    errorMsg.innerHTML = "Error: " + err.message;
});

function showProducts(data) {
    productList.innerHTML = "";

    data.forEach(product => {
        let div = document.createElement("div");
        div.className = "product-item";

        div.innerHTML = `
            <img src="${product.image}"><h3>${product.title.substring(0,50)}</h3>
            <p class="price-tag">$${product.price.toFixed(2)}</p>
            <p>${product.category}</p>
            <p>⭐ ${product.rating.rate}</p>
            <button onclick="addToCart(${product.id})"style = "cursor: pointer;">Add</button>
        `;

        productList.appendChild(div);
    });
}

document.getElementById("search").addEventListener("input", filterData);
document.getElementById("category").addEventListener("change", filterData);

function filterData() {
    let text = document.getElementById("search").value.toLowerCase();
    let cat = document.getElementById("category").value;

    let filtered = allProducts.filter(p =>
        p.title.toLowerCase().includes(text) &&
        (cat === "" || p.category === cat)
    );

    showProducts(filtered);
}
function lowHigh() {
    let sorted = [...allProducts].sort((a,b)=>a.price-b.price);
    showProducts(sorted);
}

function highLow() {
    let sorted = [...allProducts].sort((a,b)=>b.price-a.price);
    showProducts(sorted);
}
function addToCart(id) {
    let item = allProducts.find(p => p.id === id);
    let found = cart.find(c => c.id === id);

    if (found) {
        found.qty++;
    } else {
        cart.push({...item, qty:1});
    }

    updateCart();
}

function updateCart() {
    let html = "";
    let total = 0;
    cart.forEach((c, i) => {
        total += c.price * c.qty;
        html += `
        <div>
            <p>${c.title}</p>
            <p>${c.qty} x $${c.price}</p>
            <button onclick="removeItem(${i})">Remove</button>
        </div>`;
    });
    document.getElementById("cart").innerHTML = html;
    document.getElementById("count").innerText = cart.length;
    document.getElementById("total").innerText = total.toFixed(1);
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}