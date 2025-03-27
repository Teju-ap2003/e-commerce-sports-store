let cart = [];
let total = 0;
let currentPage = 1;
const itemsPerPage = 3;

document.addEventListener("DOMContentLoaded", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();
    restoreButtons();
    showPage(currentPage);
});

function searchProducts() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let productName = product.dataset.name.toLowerCase();
        product.style.display = productName.includes(input) ? "block" : "none";
    });
}

function addToCart(name, price, button) {
    let product = button.closest(".product");
    let images= product.querySelector(".image").src;

    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1,image:images });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    updateButtonUI(button, name, price);
}

function updateCart() {
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("count").innerText = count;
}

function updateButtonUI(button, name, price) {
    let item = cart.find(product => product.name === name);

    if (item) {
        let quantityWrapper = document.createElement("div");
        quantityWrapper.className = "quantity-wrapper";

        let minusButton = document.createElement("button");
        minusButton.innerText = "−";
        minusButton.className = "qty-btn";
        minusButton.onclick = () => updateQuantity(name, price, -1, quantityWrapper);

        let quantityDisplay = document.createElement("span");
        quantityDisplay.innerText = item.quantity;
        quantityDisplay.className = "qty-display";

        let plusButton = document.createElement("button");
        plusButton.innerText = "+";
        plusButton.className = "qty-btn";
        plusButton.onclick = () => updateQuantity(name, price, 1, quantityWrapper);

        quantityWrapper.appendChild(minusButton);
        quantityWrapper.appendChild(quantityDisplay);
        quantityWrapper.appendChild(plusButton);

        button.parentNode.replaceChild(quantityWrapper, button);
    }
}

function updateQuantity(name, price, change, quantityWrapper) {
    let item = cart.find(product => product.name === name);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.name !== name);
            let newButton = document.createElement("button");
            newButton.innerText = "Add to cart";
            newButton.onclick = function() { addToCart(name, price, newButton); };
            quantityWrapper.parentNode.replaceChild(newButton, quantityWrapper);
        } else {
            quantityWrapper.querySelector(".qty-display").innerText = item.quantity;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function restoreButtons() {
    document.querySelectorAll(".product").forEach(product => {
        let name = product.getAttribute("data-name");
        let price = parseInt(product.getAttribute("data-price"));
        let button = product.querySelector("button");

        let item = cart.find(product => product.name === name);
        if (item) {
            updateButtonUI(button, name, price);
        }
    });
}

function toggleCartPopup() {
    window.location.href = "cart.html";
}

function showPage(page) {
    let products = document.querySelectorAll(".product");
    let totalPages = Math.ceil(products.length / itemsPerPage);
    
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    products.forEach((product, index) => {
        product.style.display = (index >= (currentPage - 1) * itemsPerPage && index < currentPage * itemsPerPage) ? "block" : "none";
    });

    document.getElementById("pageNumber").innerText = `Page ${currentPage} of ${totalPages}`;
}

function nextPage() {
    let totalPages = Math.ceil(document.querySelectorAll(".product").length / itemsPerPage);
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

document.addEventListener("DOMContentLoaded", () => showPage(1));
