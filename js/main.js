// ملف js/main.js - الوظائف الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    initMainSystem();
});

function initMainSystem() {
    // إضافة الأحداث الإضافية
    setupAdditionalEvents();
    
    // تحميل المحتوى الأولي
    loadInitialContent();
}

// إعداد الأحداث الإضافية
function setupAdditionalEvents() {
    // روابط الدعم
    document.getElementById('contact-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('صفحة الاتصال ستكون متاحة قريباً', 'info');
    });
    
    document.getElementById('faq-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('الأسئلة الشائعة ستكون متاحة قريباً', 'info');
    });
    
    document.getElementById('terms-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('شروط الاستخدام ستكون متاحة قريباً', 'info');
    });
    
    document.getElementById('privacy-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('سياسة الخصوصية ستكون متاحة قريباً', 'info');
    });
    
    // روابط وسائل التواصل الاجتماعي
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.split(' ')[1].split('-')[1];
            showNotification(`صفحة ${platform} ستكون متاحة قريباً`, 'info');
        });
    });
    
    // أزرار المواقع
    document.addEventListener('click', function(e) {
        // أزرار عرض المواقع
        if (e.target.closest('.view-btn')) {
            const btn = e.target.closest('.view-btn');
            const siteId = btn.getAttribute('data-id');
            showNotification(`عرض تفاصيل الموقع #${siteId}`, 'info');
        }
        
        // أزرار زيارة المواقع
        if (e.target.closest('.visit-btn')) {
            const btn = e.target.closest('.visit-btn');
            const siteId = btn.getAttribute('data-id');
            showNotification(`جاري تحويلك للموقع #${siteId}`, 'info');
            
            // محاكاة الانتقال لموقع
            setTimeout(() => {
                window.open('https://example.com', '_blank');
            }, 1000);
        }
        
        // أزرار تحميل الملفات
        if (e.target.closest('.download-btn')) {
            const btn = e.target.closest('.download-btn');
            const fileId = btn.getAttribute('data-id');
            showNotification(`جاري تحميل الملف #${fileId}`, 'info');
            
            // محاكاة التحميل
            setTimeout(() => {
                showNotification('تم تحميل الملف بنجاح', 'success');
            }, 2000);
        }
    });
}

// تحميل المحتوى الأولي
function loadInitialContent() {
    // إذا كانت الصفحة الرئيسية هي الصفحة النشطة
    if (document.querySelector('#home-page.active')) {
        loadHomeContent();
    }
}

// تحميل المحتوى الرئيسي
function loadHomeContent() {
    // لا يحتاج لتحميل إضافي
}

// وظيفة مساعدة لعرض الإشعارات
if (typeof showNotification !== 'function') {
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';
        if (type === 'warning') icon = 'fas fa-exclamation-triangle';
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // إزالة الإشعار بعد 5 ثوان
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}