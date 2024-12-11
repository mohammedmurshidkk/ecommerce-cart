const apiURL = "https://mocki.io/v1/539c3a78-25e4-4fc6-8b35-6f1550d2b7c6";
let cartItems = [];
let recommendations = [];

const elements = {
  cartDrawer: document.getElementById("cartDrawer"),
  openCartBtn: document.getElementById("openCartBtn"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartItemsContainer: document.getElementById("cartItemsContainer"),
  recommendationsContainer: document.getElementById("recommendationsContainer"),
  totalPriceElement: document.getElementById("totalPrice"),
  totalItemsElement: document.getElementById("totalItems"),
  totalPriceHeaderElement: document.getElementById("totalPriceHeader"),
};

async function fetchRecommendations() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok)
      throw new Error(`Error fetching data: ${response.status}`);
    const data = await response.json();
    recommendations = data.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      images: item.images,
    }));
    renderRecommendations();
  } catch (error) {
    console.error("Failed to load recommendations:", error);
    elements.recommendationsContainer.innerHTML =
      "<p>Failed to load recommendations.</p>";
  }
}

function renderCartItems() {
  elements.cartItemsContainer.innerHTML = cartItems.length
    ? cartItems.map(createCartItem).join("")
    : "<h4 class='cart-empty'>YOUR CART IS EMPTY</h4>";

  elements.totalItemsElement.textContent = `${cartItems.length} Items`;
  updateTotalPrice();
}

function createCartItem(item) {
  return `
    <div class="cart-item">
      <img src="${item.images[0]}" alt="${item.title}">
      <div class="cart-item-details">
        <div class="cart-item-headers">
          <p class="cart-item-title">${item.title}</p>
          <span class="cart-item-price">Rs ${
            item.price * item.quantity
          } /-</span>
        </div>
        <div class="cart-item-actions">
          <button class="delete-btn" onclick="removeFromCart(${item.id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
              <path fill="#000" d="M6 20V6H5V5h4v-.77h6V5h4v1h-1v14zm1-1h10V6H7zm2.808-2h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"/>
            </svg>
          </button>
          <div class="counter-box">
            <button onclick="updateQuantity(${item.id}, -1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                <path fill="#000" d="M5 13v-1h13v1z"/>
              </svg>
            </button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 256 256">
                <path fill="#000" d="M222 128a6 6 0 0 1-6 6h-82v82a6 6 0 0 1-12 0v-82H40a6 6 0 0 1 0-12h82V40a6 6 0 0 1 12 0v82h82a6 6 0 0 1 6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRecommendations() {
  elements.recommendationsContainer.innerHTML = recommendations
    .map(createRecommendationItem)
    .join("");
}

function createRecommendationItem(item) {
  return `
    <div class="recommendation-item">
      <img src="${item.images[0]}" alt="${item.title}">
      <div class="item-details">
        <div class="infos">
          <h4>${item.title}</h4>
          <h3 class="price">Rs ${item.price} /-</h3>
          <div class="sizes">
            <button class="active">S</button>
            <button>M</button>
            <button>L</button>
            <button>XL</button>
          </div>
        </div>
        <button class="add-to-cart" onclick="addToCart(${item.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="#eae2e2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 6h19l-3 10H6zm0 0l-.75-2.5M9.992 11h2m2 0h-2m0 0V9m0 2v2M11 19.5a1.5 1.5 0 0 1-3 0m9 0a1.5 1.5 0 0 1-3 0"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function addToCart(id) {
  const item = recommendations.find((rec) => rec.id === id);
  const existingItem = cartItems.find((cartItem) => cartItem.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }
  renderCartItems();
}

function updateQuantity(id, count) {
  const item = cartItems.find((cartItem) => cartItem.id === id);

  if (item) {
    if (item.quantity + count <= 0) {
      removeFromCart(id);
    } else {
      item.quantity += count;
    }
  }
  renderCartItems();
}

function removeFromCart(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  renderCartItems();
}

function updateTotalPrice() {
  const totalQuantityPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  elements.totalPriceElement.textContent = `Rs ${totalQuantityPrice} /-`;
  elements.totalPriceHeaderElement.textContent = `Rs ${totalPrice || 0} /-`;
}

elements.openCartBtn.addEventListener("click", () => {
  elements.cartDrawer.classList.add("open");
});

elements.closeCartBtn.addEventListener("click", () => {
  elements.cartDrawer.classList.remove("open");
});

renderCartItems();
window.addEventListener("DOMContentLoaded", fetchRecommendations);
