document.addEventListener("DOMContentLoaded", function() {
    // التحقق من وجود العناصر قبل استخدامها
    const infoEmail = document.getElementById("infoEmail");
    const infoDate = document.getElementById("infoDate");
    const infoUsername = document.getElementById("infoUsername");

    // جلب بيانات المستخدم المسجل
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const loggedInUser = localStorage.getItem("loggedInUser");

    // إذا مفيش user مسجل دلوقتي، اروح لصفحة اللوجين
    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    // عرض البيانات في الصفحة
    if (infoUsername) infoUsername.textContent = currentUser?.username || "غير محدد";
    if (infoEmail) infoEmail.textContent = currentUser?.email || "غير محدد";
    if (infoDate) infoDate.textContent = currentUser?.registerDate || new Date().toLocaleDateString();

    // التابات - التحويل بين الأقسام
    const tabs = document.querySelectorAll(".tab");
    if (tabs.length > 0) {
        tabs.forEach(btn => {
            btn.addEventListener("click", function() {
                // إخفاء كل التابات
                document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
                
                // إظهار التاب المختار
                btn.classList.add("active");
                const tabId = btn.getAttribute("data-tab");
                if (tabId) {
                    const tabContent = document.getElementById(tabId);
                    if (tabContent) tabContent.classList.remove("hidden");
                }
            });
        });
    }

    // زر الرجوع للصفحة الرئيسية
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", function() {
            window.location.href = "index.html";
        });
    }

    // زر تسجيل الخروج
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    // زر تغيير كلمة المرور
    const changePasswordBtn = document.getElementById("changePasswordBtn");
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", function() {
            const newPasswordInput = document.getElementById("newPassword");
            if (!newPasswordInput) return;
            
            const newPassword = newPasswordInput.value.trim();
            
            // تحقق من الحقول الفارغة
            if (!newPassword) {
                alert("Please enter new password!");
                return;
            }

            // تحقق من طول الباسورد الجديد
            if (newPassword.length < 6) {
                alert("Password must be at least 6 characters!");
                return;
            }

            // تحديث كلمة المرور في جميع المستخدمين
            let users = JSON.parse(localStorage.getItem("users")) || [];
            
            const updatedUsers = users.map(user => {
                if (user.email === currentUser.email) {
                    return { 
                        ...user, 
                        password: newPassword 
                    };
                }
                return user;
            });
            
            // تحديث الـ currentUser
            const updatedCurrentUser = { 
                ...currentUser, 
                password: newPassword 
            };
            
            // حفظ في localStorage
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
            
            // رسالة نجاح
            alert("✅ Password updated successfully!");
            
            // مسح الحقول
            newPasswordInput.value = "";
        });
    }

    // إضافة دعم زر Enter للحقول
    const newPasswordInput = document.getElementById("newPassword");
    if (newPasswordInput && changePasswordBtn) {
        newPasswordInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                changePasswordBtn.click();
            }
        });
    }

    console.log("Profile loaded for user:", currentUser?.username);
});