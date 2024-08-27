// Show specific admin section
function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Add a new product to local storage
function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (imageFile && price && name && description) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = e.target.result;
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const newProduct = {
                id: new Date().getTime().toString(),
                name,
                price,
                description,
                image,
                visible: true
            };
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            alert('Product added successfully!');
            document.getElementById('addProductForm').reset();
            showSection('manageProducts'); // Show manage products section after adding
            renderProducts();
        };
        reader.readAsDataURL(imageFile);
    } else {
        alert('Please fill out all fields and select an image.');
    }
}

// Render products in manage products section
function renderProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const productHTML = `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                    <p>${product.description}</p>
                    <button onclick="editProduct('${product.id}')">Edit</button>
                    <button onclick="deleteProduct('${product.id}')">Delete</button>
                    <select onchange="toggleVisibility('${product.id}', this.value)">
                        <option value="show" ${product.visible ? 'selected' : ''}>Show</option>
                        <option value="hide" ${!product.visible ? 'selected' : ''}>Hide</option>
                    </select>
                </div>
            </div>
        `;
        productList.insertAdjacentHTML('beforeend', productHTML);
    });
}

// Edit a product
function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    if (product) {
        // Implement your editing functionality here
        // For example, pre-fill a form with the product's details
        alert('Edit functionality not implemented yet.');
    }
}

// Delete a product
function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

// Toggle product visibility
function toggleVisibility(id, visibility) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    if (product) {
        product.visible = visibility === 'show';
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    }
}

// Initial render
renderProducts();
