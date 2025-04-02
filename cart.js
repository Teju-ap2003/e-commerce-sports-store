document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
});
function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    const totalPrice = document.getElementById("total");

    if (!cartItems || !totalPrice) return; 

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty</p>";
        totalPrice.textContent = "₹0.00";
        return;
    }

    cart.forEach((item, index) => {
        let price = parseFloat(item.price);
        let itemTotal = price * item.quantity;
        total += itemTotal;

        let li = document.createElement("li");
        li.classList.add("cart-item");
        li.innerHTML = `
            <img src="${item.image}" "${item.name}" class="cart-img">
            <div class="cart-details">
                <span>${item.name}</span>
                <span>₹${itemTotal.toFixed(2)}</span>
                <div class="quantity-controls">
                    <button class="decrease" data-index="${index}">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">🗑</button>
                </div>
            </div>  
        `;
        cartItems.appendChild(li);
    });

    totalPrice.textContent = `₹${total.toFixed(2)}`;

    document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", function () {
            updateQuantity(this.dataset.index, 1);
        });
    });

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", function () {
            updateQuantity(this.dataset.index, -1);
        });
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            removeItemFromCart(this.dataset.index);
        });
    });
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); 
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    }
}

function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

const checkoutButton = document.getElementById("checkout");
if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        const popup = document.createElement("div");
        popup.id = "checkout-popup";
        popup.classList.add("popup");

        popup.innerHTML = `
            <div class="popup-content">
                <p>Processing your order...</p>
                <img src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif" alt="Processing..." />
            </div>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            window.location.href = "checkout.html"; 
        }, 3000);
    });
}
