document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const productsContainer = document.getElementById('products-container');
    const categoryFilter = document.getElementById('category-filter');
    const productSelect = document.getElementById('product-select');
    const priceCalculator = document.getElementById('price-calculator');
    const quantityInput = document.getElementById('quantity');
    const totalPriceDisplay = document.getElementById('total-price');
    const lightbox = document.getElementById('lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    // Variáveis globais
    let products = [];
    let categories = [];
    
    // Carregar catálogo via AJAX
    function loadCatalog() {
        fetch('catalog.json')
            .then(response => response.json())
            .then(data => {
                categories = data.categories;
                products = data.products;
                
                // Popular filtro de categorias
                populateCategoryFilter();
                
                // Popular select de produtos
                populateProductSelect();
                
                // Exibir todos os produtos inicialmente
                displayProducts(products);
            })
            .catch(error => {
                console.error('Erro ao carregar o catálogo:', error);
                productsContainer.innerHTML = '<p class="error">Erro ao carregar os produtos. Por favor, recarregue a página.</p>';
            });
    }
    
    // Popular filtro de categorias
    function populateCategoryFilter() {
        categoryFilter.innerHTML = '<option value="all">Todos os produtos</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
    
    // Popular select de produtos
    function populateProductSelect() {
        productSelect.innerHTML = '<option value="">-- Selecione --</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            option.dataset.price = product.price;
            productSelect.appendChild(option);
        });
    }
    
    // Exibir produtos
    function displayProducts(productsToDisplay) {
        productsContainer.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
            return;
        }
        
        productsToDisplay.forEach(product => {
            const categoryName = categories.find(cat => cat.id === product.category)?.name || 'Outros';
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="images/${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                    <p class="product-category">${categoryName}</p>
                    <div class="product-actions">
                        <button class="btn btn-details" data-id="${product.id}">Ver Detalhes</button>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
        
        // Adicionar eventos aos botões de detalhes
        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                showProductDetails(productId);
            });
        });
    }
    
    // Filtrar produtos por categoria
    categoryFilter.addEventListener('change', function() {
        const categoryId = this.value;
        
        if (categoryId === 'all') {
            displayProducts(products);
            return;
        }
        
        const filteredProducts = products.filter(product => product.category === parseInt(categoryId));
        displayProducts(filteredProducts);
    });
    
    // Mostrar detalhes do produto no lightbox
    function showProductDetails(productId) {
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        const categoryName = categories.find(cat => cat.id === product.category)?.name || 'Outros';
        
        document.getElementById('lightbox-image').src = `images/${product.image}`;
        document.getElementById('lightbox-title').textContent = product.name;
        document.getElementById('lightbox-price').textContent = `R$ ${product.price.toFixed(2)} | ${categoryName}`;
        document.getElementById('lightbox-description').textContent = product.description;
        
        lightbox.style.display = 'block';
    }
    
    // Fechar lightbox
    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // Fechar lightbox ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    // Calcular preço total
    priceCalculator.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = productSelect.value;
        const quantity = parseInt(quantityInput.value);
        
        // Validação
        if (!productId) {
            alert('Por favor, selecione um produto.');
            return;
        }
        
        if (isNaN(quantity) || quantity < 1) {
            alert('Por favor, insira uma quantidade válida (número positivo).');
            return;
        }
        
        const selectedProduct = products.find(p => p.id === parseInt(productId));
        const totalPrice = selectedProduct.price * quantity;
        
        totalPriceDisplay.textContent = `Total: R$ ${totalPrice.toFixed(2)}`;
    });
    
    // Inicializar
    loadCatalog();
});