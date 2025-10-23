// ===================== تأثير تحريك الشريط عند التمرير =====================
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);

  // ظهور العناصر عند النزول
  document.querySelectorAll(".fade-in").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) el.classList.add("visible");
  });
});

// ===================== عند تحميل الصفحة =====================
document.addEventListener("DOMContentLoaded", () => {
  // العناصر الرئيسية
  const serviceBtn = document.getElementById("servicesBtn");
  const contactBtn = document.getElementById("contactBtn");
  const popups = document.querySelectorAll(".popup");
  const closes = document.querySelectorAll(".close");

  // فتح popups
  if (serviceBtn)
    serviceBtn.onclick = () =>
      document.getElementById("servicesPopup").style.display = "flex";

  if (contactBtn)
    contactBtn.onclick = () =>
      document.getElementById("contactPopup").style.display = "flex";

  // غلق النوافذ
  closes.forEach((c) =>
    c.addEventListener("click", () =>
      popups.forEach((p) => (p.style.display = "none"))
    )
  );

  window.addEventListener("click", (e) =>
    popups.forEach((p) => {
      if (e.target === p) p.style.display = "none";
    })
  );

  // زر Home
  const homeLink = document.querySelector(".nav-link[href='#home']");
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== عناصر تسجيل الدخول =====
  const loginBtn = document.getElementById("loginBtn");
  const username = localStorage.getItem("loggedInUser");
  const userMenu = document.querySelector(".user-menu");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (username && userMenu && usernameDisplay) {
    // إخفاء زر login
    if (loginBtn) loginBtn.style.display = "none";

    // عرض القائمة واسم المستخدم
    userMenu.style.display = "inline-block";
    usernameDisplay.textContent = username;

    // ===== عرض/إخفاء القايمة =====
    usernameDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle("active");
    });

    // إغلاق القايمة عند الضغط خارجها
    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove("active");
      }
    });

    // ===== أزرار القايمة =====
    const profileLink = document.getElementById("profileLink");
    if (profileLink) {
      profileLink.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
    }

    // تسجيل الخروج
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("currentUser");
        window.location.reload();
      });
    }
  }
});

// نظام عربة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحديث عداد العربة
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// فتح عربة التسوق
document.getElementById('cartIcon')?.addEventListener('click', function() {
    document.getElementById('cartPopup').style.display = 'flex';
    updateCartDisplay();
});

// إضافة منتج للعربة
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.getAttribute('data-product');
        const price = parseFloat(this.getAttribute('data-price'));
        
        // تأثير النقر
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // التحقق إذا المنتج موجود في العربة
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product: product,
                price: price,
                quantity: 1
            });
        }
        
        // حفظ في localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // تحديث العداد
        updateCartCount();
        
        // رسالة نجاح
        showCartNotification(`${product} added to cart!`);
    });
});

// عرض إشعار
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #00bfff, #007acc);
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// تحديث عرض العربة
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                </div>
                <button class="remove-item" data-index="${index}">🗑️</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // إضافة event listeners لأزرار الإزالة
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
            });
        });
    }
}

// زر الشراء
document.getElementById('checkoutBtn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('🛒 Your cart is empty!');
        return;
    }
    
    // إنشاء رسالة الطلب
    let message = "🛍️ *NEW ORDER* 🛍️\n\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `• ${item.product}\n   Quantity: ${item.quantity}\n   Price: $${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}\n\n`;
        total += itemTotal;
    });
    
    message += `💰 *TOTAL: $${total.toFixed(2)}* 💰\n\n`;
    message += "Please contact me to complete the payment and delivery. Thank you! 🎉";
    
    // ترميز الرسالة للرابط
    const encodedMessage = encodeURIComponent(message);
    
    // الرابط إلى الإنستجرام
    const instagramUrl = `https://www.instagram.com/double.a.media1/?igsh=em9wemZlc2l2ZGRn${encodedMessage}`;
    
    // فتح الإنستجرام في نافذة جديدة
    window.open(instagramUrl, '_blank');
    
    // تفريغ العربة بعد الشراء
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // إغلاق نافذة العربة
    document.getElementById('cartPopup').style.display = 'none';
});

// تحديث عداد العربة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// إغلاق نافذة العربة عند الضغط على X
document.querySelector('#cartPopup .close')?.addEventListener('click', function() {
    document.getElementById('cartPopup').style.display = 'none';
});

// إغلاق نافذة العربة عند الضغط خارجها
document.getElementById('cartPopup')?.addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});