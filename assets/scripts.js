// Function to load and display products from local storage
function loadCatalogue() {
    const catalogueContainer = document.querySelector('.catalogue');
    catalogueContainer.innerHTML = ''; // Clear existing items

    // Retrieve products from local storage
    const productsJSON = localStorage.getItem('products');
    if (!productsJSON) {
        console.log('No products found in local storage.');
        return;
    }

    // Parse products from JSON
    let products;
    try {
        products = JSON.parse(productsJSON);
    } catch (error) {
        console.error('Error parsing products from local storage:', error);
        return;
    }

    // Check if products is an array
    if (Array.isArray(products)) {
        products.forEach(product => {
            if (product.visible) { // Only show visible products
                const productHTML = `
                    <div class="product-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-details">
                            <h3>${product.name}</h3>
                            <p>Price: ₹${product.price.toFixed(2)}</p>
                            <p>${product.description}</p>
                            <button class="add-to-cart" onclick="openQuantityModal('${product.id}')">Add to Cart</button>
                        </div>
                    </div>
                `;
                catalogueContainer.insertAdjacentHTML('beforeend', productHTML);
            }
        });
    } else {
        console.log('Products is not an array or is undefined.');
    }
}

// Function to open the quantity modal
function openQuantityModal(productId) {
    document.getElementById('modalProductId').value = productId;
    document.getElementById('quantityModal').style.display = 'block';
}

// Function to close the quantity modal
function closeQuantityModal() {
    document.getElementById('quantityModal').style.display = 'none';
}

// Function to add a product to the cart from the quantity modal
function addToCartFromModal() {
    const productId = document.getElementById('modalProductId').value;
    const quantity = parseFloat(document.getElementById('productQuantity').value);

    if (quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity = quantity; // Update quantity if already in cart
        } else {
            cart.push({ id: productId, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        closeQuantityModal();
        alert('Product added to cart!');
        loadCatalogue(); // Update catalog to show "Item Added to Cart"
    } else {
        console.log('Product not found.');
    }
}
// Function to load cart items from local storage and display them
function loadCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalContainer = document.getElementById('cartTotal');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    // Retrieve cart items from local storage
    const cartJSON = localStorage.getItem('cart');
    if (!cartJSON) {
        console.log('No items found in the cart.');
        cartTotalContainer.innerText = 'Total: ₹0.00';
        return;
    }

    // Parse cart items from JSON
    let cart;
    try {
        cart = JSON.parse(cartJSON);
    } catch (error) {
        console.error('Error parsing cart items from local storage:', error);
        return;
    }

    // Retrieve products from local storage
    const productsJSON = localStorage.getItem('products');
    let products;
    try {
        products = JSON.parse(productsJSON);
    } catch (error) {
        console.error('Error parsing products from local storage:', error);
        return;
    }

    // Check if products is an array
    if (Array.isArray(cart)) {
        let total = 0;
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                total += itemTotal;

                const cartItemHTML = `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${product.name}</div>
                            <div class="cart-item-price">₹${product.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <input type="number" class="quantity-input" id="quantity-${product.id}" value="${cartItem.quantity.toFixed(2)}" step="0.01" min="0.01" onchange="updateQuantity('${product.id}')">
                            </div>
                            <button class="remove-button" onclick="removeFromCart('${product.id}')">Remove</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            }
        });

        cartTotalContainer.innerText = `Total: ₹${total.toFixed(2)}`;
    } else {
        console.log('Cart is not an array or is undefined.');
    }
}

// Function to update quantity of a product in the cart
function updateQuantity(productId) {
    const quantity = parseFloat(document.getElementById(`quantity-${productId}`).value);
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Reload cart to reflect changes
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Reload cart to reflect changes
}

// Function to open the checkout modal
function openModal() {
    document.getElementById('checkoutModal').style.display = 'block';
}

// Function to close the checkout modal
function closeModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Function to submit the order and send details to WhatsApp
function submitOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value || 'Not provided';

    if (!name || !phone) {
        alert('Name and Phone Number are required.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Construct order details message
    let orderMessage = `Order Details:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nProducts:\n`;

    const productsJSON = localStorage.getItem('products');
    let products;
    try {
        products = JSON.parse(productsJSON);
    } catch (error) {
        console.error('Error parsing products from local storage:', error);
        return;
    }

    let total = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            const itemTotal = product.price * cartItem.quantity;
            total += itemTotal;
            orderMessage += `- ${product.name}: ₹${product.price.toFixed(2)} x ${cartItem.quantity.toFixed(2)} kg = ₹${itemTotal.toFixed(2)}\n`;
        }
    });

    orderMessage += `\nTotal Amount: ₹${total.toFixed(2)}`;

    // Send order details to WhatsApp
    const whatsappNumber = '+919633070912'; // Replace with your WhatsApp number
    const whatsappMessage = encodeURIComponent(orderMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    window.location.href = whatsappUrl;

    // Clear cart after submission
    localStorage.removeItem('cart');
    closeModal();
    loadCart(); // Update cart page to reflect changes
}

// Load cart on page load
document.addEventListener('DOMContentLoaded', loadCart);

// Load catalogue on page load
document.addEventListener('DOMContentLoaded', loadCatalogue);
