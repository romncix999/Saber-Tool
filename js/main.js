// ملف js/main.js - الوظائف الرئيسية للموقع
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع المكونات
    initComponents();
    
    // تحميل محتوى الصفحة الأولى
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadHomeContent();
    }
});

// تهيئة جميع المكونات
function initComponents() {
    // تحديث السنة الحالية
    updateCurrentYear();
    
    // إضافة أنماط إضافية للـ VIP
    addVipStyles();
    
    // إعداد أحداث إضافية
    setupAdditionalEvents();
    
    // تحميل المحتوى الديناميكي
    loadDynamicContent();
}

// إضافة أنماط إضافية للـ VIP
function addVipStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .vip-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(45deg, #ffd700, #ff9500);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 700;
            z-index: 2;
        }
        
        .vip-lock {
            position: absolute;
            top: 5px;
            left: 5px;
            color: #ff9500;
            background: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
        }
        
        .card-rating {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #FF9800;
            font-weight: 600;
        }
        
        .card-os {
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--gray-color);
        }
        
        .file-meta {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 15px;
            font-size: 0.8rem;
            color: var(--gray-color);
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
        }
    `;
    
    document.head.appendChild(style);
}

// إعداد الأحداث الإضافية
function setupAdditionalEvents() {
    // زر الاتصال بالدعم
    const contactSupport = document.getElementById('contact-support');
    if (contactSupport) {
        contactSupport.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة الاتصال بالدعم قريباً', 'info');
        });
    }
    
    // رابط الأسئلة الشائعة
    const faqLink = document.getElementById('faq-link');
    if (faqLink) {
        faqLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة الأسئلة الشائعة قريباً', 'info');
        });
    }
    
    // رابط شروط الاستخدام
    const termsLink = document.getElementById('terms-link');
    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة شروط الاستخدام قريباً', 'info');
        });
    }
    
    // رابط سياسة الخصوصية
    const privacyLink = document.getElementById('privacy-link');
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة سياسة الخصوصية قريباً', 'info');
        });
    }
    
    // زر تغيير كلمة المرور
    const changePassword = document.getElementById('change-password');
    if (changePassword) {
        changePassword.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('ميزة تغيير كلمة المرور ستكون متاحة قريباً', 'info');
        });
    }
    
    // إعدادات الملف الشخصي
    const profileSettings = document.getElementById('profile-settings');
    if (profileSettings) {
        profileSettings.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('ميزة إعدادات الملف الشخصي ستكون متاحة قريباً', 'info');
        });
    }
    
    // إدارة VIP
    const vipManagement = document.getElementById('vip-management');
    if (vipManagement) {
        vipManagement.addEventListener('click', function(e) {
            e.preventDefault();
            // فتح نافذة VIP
            const vipModal = document.getElementById('vip-modal');
            if (vipModal) {
                vipModal.classList.add('active');
                updateVipStatus();
            }
        });
    }
}

// تحميل المحتوى الديناميكي
function loadDynamicContent() {
    // في الإصدار الحقيقي، سيتم جلب البيانات من Netlify Functions
    // حالياً، نستخدم بيانات تجريبية
}

// تحميل محتوى الصفحة الرئيسية
function loadHomeContent() {
    // تم نقله إلى auth.js
}

// تحديث السنة الحالية
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year, #footer-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });
}

// إظهار الإشعارات (تم تعريفها في auth.js، نعيد تعريفها هنا للتأكد)
if (typeof showNotification !== 'function') {
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';
        if (type === 'warning') icon = 'fas fa-exclamation-triangle';
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="${icon}"></i>
            <div class="notification-content">
                <h4>${type === 'success' ? 'نجاح' : type === 'error' ? 'خطأ' : type === 'warning' ? 'تحذير' : 'ملاحظة'}</h4>
                <p>${message}</p>
            </div>
        `;
        
        container.appendChild(notification);
        
        // إزالة الإشعار بعد 5 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}