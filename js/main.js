// ChickBites - Main Script

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar on scroll
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Testimonial slider
  const reviews = [
    {
      quote: "ChickBites is simply amazing! The chicken is so crispy and delicious. Highly recommended!",
      author: "— Sara Khan"
    },
    {
      quote: "Best chicken burger and wings in town! The flavor is deeply seasoned and juicy to the bone.",
      author: "— Hamza Ali"
    },
    {
      quote: "The Ultimate Feast combo is incredible value. Fast delivery and piping hot food every time!",
      author: "— Fatima Noor"
    }
  ];

  let currentReview = 0;
  const quoteEl = document.querySelector('.testimonial-quote');
  const authorEl = document.querySelector('.testimonial-author');

  function showReview(index) {
    quoteEl.textContent = `“${reviews[index].quote}”`;
    authorEl.textContent = reviews[index].author;
  }

  document.querySelector('.carousel-prev')?.addEventListener('click', () => {
    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
    showReview(currentReview);
  });

  document.querySelector('.carousel-next')?.addEventListener('click', () => {
    currentReview = (currentReview + 1) % reviews.length;
    showReview(currentReview);
  });

  // Shopping Cart logic
  let cart = [];
  const cartCounter = document.querySelector('.cart-counter');
  const cartList = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');
  const toast = document.getElementById('cartToast');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function updateCart() {
    let count = 0;
    let subtotal = 0;
    cartList.innerHTML = '';

    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="fa-solid fa-basket-shopping fa-3x mb-3 text-warning"></i>
          <p class="mb-0">Your tray is empty.</p>
        </div>
      `;
    } else {
      cart.forEach((item, index) => {
        count += item.qty;
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        cartList.innerHTML += `
          <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
            <div class="d-flex align-items-center gap-2">
              <img src="${item.img}" width="45" height="45" style="object-fit: contain;">
              <div>
                <h6 class="mb-0 text-dark" style="font-size: 0.9rem;">${item.name}</h6>
                <small class="text-muted">$${item.price.toFixed(2)}</small>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="changeQty(${index}, -1)">-</button>
              <span class="fw-bold px-1">${item.qty}</span>
              <button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="changeQty(${index}, 1)">+</button>
              <span class="fw-bold ms-2 text-orange">$${itemTotal.toFixed(2)}</span>
            </div>
          </div>
        `;
      });
    }

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    cartCounter.textContent = count;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  window.changeQty = function(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCart();
  };

  // Add to order buttons
  document.querySelectorAll('.btn-add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const img = button.dataset.image;

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }

      updateCart();
      showToast(`Added ${name} to order!`);
    });
  });

  // Checkout button
  document.getElementById('btnCheckout')?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your tray is empty! Please add some delicious food.');
      return;
    }
    alert('Thank you! Your ChickBites order has been placed.');
    cart = [];
    updateCart();
    bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'))?.hide();
  });

  // Table reservation form
  document.getElementById('reservationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('resName').value;
    alert(`Thank you, ${name}! Your table reservation is confirmed.`);
    bootstrap.Modal.getInstance(document.getElementById('reservationModal'))?.hide();
    e.target.reset();
  });

  // Initial cart display
  updateCart();
});
