// ---- تبديل بين النماذج ----
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const forgotBox = document.getElementById("forgotBox");

// تأكد من وجود العناصر قبل إضافة event listeners
document.addEventListener('DOMContentLoaded', function() {
    // تبديل النماذج
    if (document.getElementById("toRegister")) {
        document.getElementById("toRegister").onclick = () => {
            loginBox.style.display = "none";
            registerBox.style.display = "block";
        };
    }
    
    if (document.getElementById("toLogin")) {
        document.getElementById("toLogin").onclick = () => {
            registerBox.style.display = "none";
            loginBox.style.display = "block";
        };
    }
    
    if (document.getElementById("toForgot")) {
        document.getElementById("toForgot").onclick = () => {
            loginBox.style.display = "none";
            forgotBox.style.display = "block";
        };
    }
    
    if (document.getElementById("backToLogin")) {
        document.getElementById("backToLogin").onclick = () => {
            forgotBox.style.display = "none";
            loginBox.style.display = "block";
        };
    }

    // ---- دوال المظهر ----
    function showError(formBox, msgBox, message) {
        if (msgBox) {
            msgBox.textContent = message;
            msgBox.style.display = "block";
        }
        if (formBox) {
            formBox.classList.add("error");
            setTimeout(() => {
                formBox.classList.remove("error");
            }, 600);
        }
    }

    function showSuccessToast(message) {
        const toast = document.createElement("div");
        toast.className = "success-toast";
        toast.innerHTML = `<i>✔</i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ---- التسجيل ----
    if (document.getElementById("registerBtn")) {
        document.getElementById("registerBtn").addEventListener("click", function() {
            const username = document.getElementById("regUsername").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value.trim();
            const regError = document.getElementById("regError");

            if (!username || !email || !password) {
                return showError(registerBox, regError, "Please fill all fields!");
            }

            const userData = {
                username,
                email, 
                password,
                registerDate: new Date().toLocaleDateString(),
                emailVerified: true
            };

            let users = JSON.parse(localStorage.getItem("users")) || [];
            
            if (users.find(user => user.email === email)) {
                return showError(registerBox, regError, "Email already exists!");
            }

            users.push(userData);
            localStorage.setItem("users", JSON.stringify(users));
            
            // تسجيل الدخول تلقائي بعد التسجيل
            localStorage.setItem("loggedInUser", username);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            
            showSuccessToast("Account created successfully!");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        });
    }

    // ---- تسجيل الدخول ----
    if (document.getElementById("loginBtn")) {
        document.getElementById("loginBtn").addEventListener("click", function() {
            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const loginError = document.getElementById("loginError");

            // مسح أي رسائل خطأ قديمة
            if (loginError) loginError.style.display = "none";

            if (!email || !password) {
                showError(loginBox, loginError, "Please fill all fields!");
                return;
            }

            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem("loggedInUser", user.username);
                localStorage.setItem("currentUser", JSON.stringify(user));
                showSuccessToast("Login successful!");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                showError(loginBox, loginError, "Invalid email or password!");
            }
        });
    }

    // ---- نسيان الباسورد ----
    if (document.getElementById("forgotBtn")) {
        document.getElementById("forgotBtn").addEventListener("click", function() {
            const email = document.getElementById("forgotEmail").value.trim();
            const forgotError = document.getElementById("forgotError");

            if (!email) {
                return showError(forgotBox, forgotError, "Please enter your email!");
            }
            
            // نظام بسيط جداً - مجرد رسالة
            showSuccessToast("If you forgot your password, please contact admin for assistance.");
        });
    }

    // إضافة event listeners للحقول لدعم زر Enter
    if (document.getElementById("loginEmail")) {
        document.getElementById("loginEmail").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("loginBtn").click();
            }
        });
    }

    if (document.getElementById("loginPassword")) {
        document.getElementById("loginPassword").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("loginBtn").click();
            }
        });
    }

    if (document.getElementById("regUsername")) {
        document.getElementById("regUsername").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("registerBtn").click();
            }
        });
    }

    if (document.getElementById("regEmail")) {
        document.getElementById("regEmail").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("registerBtn").click();
            }
        });
    }

    if (document.getElementById("regPassword")) {
        document.getElementById("regPassword").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("registerBtn").click();
            }
        });
    }

    if (document.getElementById("forgotEmail")) {
        document.getElementById("forgotEmail").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                document.getElementById("forgotBtn").click();
            }
        });
    }

    // EmailJS Setup
    function initializeEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("uRApmaaLPI790QDSn");
            console.log('✅ EmailJS initialized');
        } else {
            console.log('❌ EmailJS not loaded');
        }
    }
    initializeEmailJS();
});