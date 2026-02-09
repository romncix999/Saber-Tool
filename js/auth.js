// ملف js/auth.js - إدارة المصادقة والمستخدم
document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
});

function initAuthSystem() {
    // التحقق من حالة المستخدم
    checkAuthStatus();
    
    // تهيئة الأحداث
    initAuthEvents();
    initNavigation();
    updateCurrentYear();
}

// التحقق من حالة المصادقة
function checkAuthStatus() {
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname === '/';
    const isLoggedIn = localStorage.getItem('saber_user_logged_in') === 'true';
    const loginExpiry = localStorage.getItem('saber_login_expiry');
    
    // التحقق من انتهاء الصلاحية (شهر)
    if (loginExpiry) {
        const now = new Date().getTime();
        if (now > parseInt(loginExpiry)) {
            clearUserData();
            if (!isLoginPage) {
                window.location.href = 'login.html';
                return;
            }
        }
    }
    
    // إعادة التوجيه بناءً على حالة الدخول
    if (isLoggedIn && isLoginPage) {
        window.location.href = 'index.html';
        return;
    }
    
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }
    
    // تحميل بيانات المستخدم إذا كان مسجلاً
    if (isLoggedIn && !isLoginPage) {
        loadUserData();
        initUserMenu();
    }
}

// مسح بيانات المستخدم
function clearUserData() {
    localStorage.removeItem('saber_user_logged_in');
    localStorage.removeItem('saber_login_expiry');
    localStorage.removeItem('saber_user_data');
}

// تهيئة أحداث المصادقة
function initAuthEvents() {
    // تبديل تبويبات الدخول/التسجيل
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchAuthTab(tabId);
        });
    });
    
    // تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // التسجيل
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// تبديل تبويبات الدخول/التسجيل
function switchAuthTab(tabId) {
    // تحديث التبويبات النشطة
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });
    
    // إظهار النموذج المطلوب
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.toggle('active', form.id === `${tabId}-form`);
    });
}

// معالجة تسجيل الدخول
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me')?.checked || false;
    const messageEl = document.getElementById('login-message');
    
    // التحقق من البيانات
    if (!email || !password) {
        showMessage(messageEl, 'يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    // البحث عن المستخدم
    const users = JSON.parse(localStorage.getItem('saber_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // حفظ حالة الدخول
        localStorage.setItem('saber_user_logged_in', 'true');
        localStorage.setItem('saber_user_data', JSON.stringify(user));
        
        // حساب تاريخ انتهاء الصلاحية
        const expiryDate = new Date();
        if (rememberMe) {
            expiryDate.setMonth(expiryDate.getMonth() + 1); // شهر
        } else {
            expiryDate.setDate(expiryDate.getDate() + 7); // أسبوع
        }
        
        localStorage.setItem('saber_login_expiry', expiryDate.getTime().toString());
        
        showMessage(messageEl, 'تم تسجيل الدخول بنجاح!', 'success');
        
        // الانتقال للصفحة الرئيسية
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage(messageEl, 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    }
}

// معالجة التسجيل
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const acceptTerms = document.getElementById('accept-terms')?.checked || false;
    const messageEl = document.getElementById('register-message');
    
    // التحقق من البيانات
    if (!name || !email || !password || !confirmPassword) {
        showMessage(messageEl, 'يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(messageEl, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage(messageEl, 'كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showMessage(messageEl, 'يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    // التحقق من عدم تكرار البريد الإلكتروني
    const users = JSON.parse(localStorage.getItem('saber_users')) || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showMessage(messageEl, 'هذا البريد الإلكتروني مسجل بالفعل', 'error');
        return;
    }
    
    // إنشاء مستخدم جديد
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password,
        plan: 'free',
        vipExpiry: null,
        registrationDate: new Date().toISOString(),
        avatar: 'images/default-avatar.png',
        lastLogin: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('saber_users', JSON.stringify(users));
    
    showMessage(messageEl, 'تم إنشاء الحساب بنجاح!', 'success');
    
    // التبديل لتبويب الدخول
    setTimeout(() => {
        switchAuthTab('login');
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = password;
    }, 2000);
}

// تحميل بيانات المستخدم
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('saber_user_data'));
    if (!userData) return;
    
    // تحديث واجهة المستخدم
    updateUserUI(userData);
    
    // تحميل المحتوى بناءً على صلاحيات المستخدم
    loadContentBasedOnPlan(userData.plan);
}

// تحديث واجهة المستخدم
function updateUserUI(userData) {
    // تحديث الاسم
    const nameElements = document.querySelectorAll('#dropdown-name, .user-name');
    nameElements.forEach(el => {
        if (el) el.textContent = userData.name;
    });
    
    // تحديث البريد الإلكتروني
    const emailElements = document.querySelectorAll('#dropdown-email');
    emailElements.forEach(el => {
        if (el) el.textContent = userData.email;
    });
    
    // تحديث نوع الحساب
    const isVip = userData.vipExpiry && new Date(userData.vipExpiry) > new Date();
    const planType = isVip ? 'VIP' : 'مجاني';
    
    const planElements = document.querySelectorAll('#dropdown-plan-type, .user-plan');
    planElements.forEach(el => {
        if (el) el.textContent = planType;
        if (el && isVip) el.style.color = 'var(--gold-vip)';
    });
    
    // تحديث صورة المستخدم
    const avatarElements = document.querySelectorAll('#user-avatar-img, #dropdown-avatar');
    avatarElements.forEach(el => {
        if (el) el.src = userData.avatar || 'images/default-avatar.png';
    });
}

// تحميل المحتوى بناءً على نوع الخطة
function loadContentBasedOnPlan(plan) {
    const isVip = plan === 'vip' || (localStorage.getItem('saber_user_data') && 
        JSON.parse(localStorage.getItem('saber_user_data')).vipExpiry && 
        new Date(JSON.parse(localStorage.getItem('saber_user_data')).vipExpiry) > new Date());
    
    // إخفاء المحتوى المميز إذا لم يكن VIP
    if (!isVip) {
        document.querySelectorAll('.vip-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // إضافة شعار "يتطلب VIP" على المحتوى المميز
        document.querySelectorAll('.site-card.vip, .app-card.vip, .file-card.vip').forEach(card => {
            if (!card.querySelector('.vip-badge')) {
                const badge = document.createElement('div');
                badge.className = 'vip-badge';
                badge.textContent = 'VIP';
                badge.style.position = 'absolute';
                badge.style.top = '10px';
                badge.style.left = '10px';
                badge.style.zIndex = '2';
                card.appendChild(badge);
            }
        });
    }
}

// تهيئة التنقل
function initNavigation() {
    // التنقل بين الصفحات
    document.querySelectorAll('.nav-link, .action-card').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                switchPage(pageId);
            }
        });
    });
    
    // زر VIP
    const vipBtn = document.getElementById('vip-btn');
    if (vipBtn) {
        vipBtn.addEventListener('click', openVipModal);
    }
    
    // إغلاق نافذة VIP
    const vipCloseBtn = document.getElementById('vip-close-btn');
    if (vipCloseBtn) {
        vipCloseBtn.addEventListener('click', closeVipModal);
    }
    
    // إغلاق النافذة عند النقر خارجها
    const vipModal = document.getElementById('vip-modal');
    if (vipModal) {
        vipModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVipModal();
            }
        });
    }
    
    // تفعيل كود VIP
    const activateVipBtn = document.getElementById('activate-vip-btn');
    if (activateVipBtn) {
        activateVipBtn.addEventListener('click', activateVipCode);
    }
    
    // رابط أكواد VIP
    const vipCodesLink = document.getElementById('vip-codes-link');
    if (vipCodesLink) {
        vipCodesLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة أكواد VIP قريباً', 'info');
        });
    }
}

// تهيئة قائمة المستخدم
function initUserMenu() {
    const avatarBtn = document.getElementById('user-avatar-btn');
    const dropdown = document.getElementById('user-dropdown');
    
    if (avatarBtn && dropdown) {
        avatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // عناصر القائمة المنسدلة
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('vip-management-btn')?.addEventListener('click', openVipModal);
    document.getElementById('profile-btn')?.addEventListener('click', showProfileSettings);
    document.getElementById('settings-btn')?.addEventListener('click', showSettings);
}

// تسجيل الخروج
function handleLogout() {
    clearUserData();
    showNotification('تم تسجيل الخروج بنجاح', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// فتح نافذة VIP
function openVipModal() {
    const vipModal = document.getElementById('vip-modal');
    if (vipModal) {
        vipModal.classList.add('active');
        updateVipStatus();
    }
}

// إغلاق نافذة VIP
function closeVipModal() {
    const vipModal = document.getElementById('vip-modal');
    if (vipModal) {
        vipModal.classList.remove('active');
    }
}

// تحديث حالة VIP
function updateVipStatus() {
    const vipStatus = document.getElementById('vip-status');
    if (!vipStatus) return;
    
    const userData = JSON.parse(localStorage.getItem('saber_user_data'));
    if (!userData) return;
    
    const isVip = userData.vipExpiry && new Date(userData.vipExpiry) > new Date();
    
    if (isVip) {
        const expiryDate = new Date(userData.vipExpiry);
        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        
        vipStatus.innerHTML = `
            <h3><i class="fas fa-crown"></i> أنت عضو VIP</h3>
            <p>عضوية VIP الخاصة بك تنتهي خلال ${daysLeft} أيام</p>
            <p class="expiry-date">تاريخ الانتهاء: ${expiryDate.toLocaleDateString('ar-EG')}</p>
        `;
    } else {
        vipStatus.innerHTML = `
            <h3><i class="fas fa-crown"></i> ليست لديك عضوية VIP</h3>
            <p>تفعيل VIP يمنحك وصولاً كاملاً لجميع الميزات لمدة 10 أيام</p>
        `;
    }
}

// تفعيل كود VIP
function activateVipCode() {
    const codeInput = document.getElementById('vip-code-input');
    const resultEl = document.getElementById('activation-result');
    
    if (!codeInput || !resultEl) return;
    
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        showMessage(resultEl, 'يرجى إدخال كود VIP', 'error');
        return;
    }
    
    // أكواد VIP صالحة (في الإصدار النهائي، سيتم التحقق من Vercel Functions)
    const validCodes = ['SABERVIP2024', 'TOOLS1234', 'PREMIUM5678'];
    
    if (validCodes.includes(code)) {
        // تحديث بيانات المستخدم
        const userData = JSON.parse(localStorage.getItem('saber_user_data'));
        if (userData) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 10); // 10 أيام
            
            userData.plan = 'vip';
            userData.vipExpiry = expiryDate.toISOString();
            
            localStorage.setItem('saber_user_data', JSON.stringify(userData));
            
            showMessage(resultEl, 'تم تفعيل عضوية VIP بنجاح لمدة 10 أيام!', 'success');
            showNotification('مبروك! تم تفعيل عضوية VIP بنجاح', 'success');
            
            // تحديث الواجهة
            updateUserUI(userData);
            loadContentBasedOnPlan('vip');
            updateVipStatus();
            
            // تفريغ الحقل
            codeInput.value = '';
        }
    } else {
        showMessage(resultEl, 'كود VIP غير صالح أو منتهي الصلاحية', 'error');
    }
}

// عرض إعدادات الملف الشخصي
function showProfileSettings() {
    showNotification('ميزة إعدادات الملف الشخصي قريباً', 'info');
}

// عرض الإعدادات
function showSettings() {
    showNotification('ميزة الإعدادات قريباً', 'info');
}

// تبديل الصفحات
function switchPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // تحديث روابط التنقل
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // تفعيل رابط التنقل المقابل
        const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // إغلاق القائمة المنسدلة
        document.getElementById('user-dropdown')?.classList.remove('active');
        
        // تحميل محتوى الصفحة
        loadPageContent(pageId);
    }
}

// تحميل محتوى الصفحة
function loadPageContent(pageId) {
    switch(pageId) {
        case 'home':
            loadHomeContent();
            break;
        case 'sites':
            loadSitesContent();
            break;
        case 'apps':
            loadAppsContent();
            break;
        case 'files':
            loadFilesContent();
            break;
        case 'music':
            loadMusicContent();
            break;
    }
}

// تحميل المحتوى الرئيسي
function loadHomeContent() {
    // لا يحتاج لتحميل إضافي
}

// تحميل المحتوى متعدد الاستخدامات
function loadContent(type, containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    data.forEach((item, index) => {
        const element = createContentElement(type, item, index);
        container.appendChild(element);
    });
}

// إنشاء عناصر المحتوى
function createContentElement(type, item, index) {
    switch(type) {
        case 'site':
            return createSiteElement(item);
        case 'app':
            return createAppElement(item);
        case 'file':
            return createFileElement(item);
        case 'song':
            return createSongElement(item, index);
        default:
            return document.createElement('div');
    }
}

// إنشاء عنصر موقع
function createSiteElement(site) {
    const div = document.createElement('div');
    div.className = `site-card ${site.vip ? 'vip' : ''}`;
    
    div.innerHTML = `
        <div class="site-image">
            <img src="${site.image}" alt="${site.title}" onerror="this.src='images/default-site.jpg'">
        </div>
        <div class="site-content">
            <h3 class="site-title">${site.title}</h3>
            <p class="site-description">${site.description}</p>
            <div class="site-meta">
                <span class="site-category">${site.category}</span>
                <div class="site-actions">
                    <button class="site-btn view-btn" data-id="${site.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="site-btn visit-btn" data-id="${site.id}">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// إنشاء عنصر تطبيق
function createAppElement(app) {
    const div = document.createElement('div');
    div.className = `app-card ${app.vip ? 'vip' : ''}`;
    
    div.innerHTML = `
        <div class="app-icon">
            <i class="${app.icon}"></i>
        </div>
        <div class="app-info">
            <h3>${app.title}</h3>
            <p>${app.description}</p>
            <div class="app-meta">
                <span class="app-rating">
                    <i class="fas fa-star"></i> ${app.rating}
                </span>
                <span class="app-size">${app.size}</span>
            </div>
        </div>
    `;
    
    return div;
}

// إنشاء عنصر ملف
function createFileElement(file) {
    const div = document.createElement('div');
    div.className = `file-card ${file.vip ? 'vip' : ''}`;
    
    div.innerHTML = `
        <div class="file-icon">
            <i class="${file.icon}"></i>
        </div>
        <div class="file-info">
            <h4>${file.title}</h4>
            <p>${file.description}</p>
            <div class="file-actions">
                <button class="btn btn-secondary download-btn" data-id="${file.id}">
                    <i class="fas fa-download"></i> تحميل
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// إنشاء عنصر أغنية (توب 4 توب)
function createSongElement(song, index) {
    const div = document.createElement('div');
    div.className = 'top-song';
    
    div.innerHTML = `
        <div class="song-rank">${index + 1}</div>
        <div class="song-image">
            <img src="${song.image}" alt="${song.title}" onerror="this.src='images/default-album.jpg'">
        </div>
        <div class="song-info">
            <h3 class="song-title">${song.title}</h3>
            <p class="song-artist">${song.artist}</p>
            <div class="song-actions">
                <button class="song-btn play-btn" data-id="${song.id}">
                    <i class="fas fa-play"></i> تشغيل
                </button>
                <button class="song-btn download-btn" data-id="${song.id}">
                    <i class="fas fa-download"></i> تحميل
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// تحميل بيانات المواقع
function loadSitesContent() {
    const sites = [
        {
            id: 1,
            title: 'موقع القراصنة المخفي',
            description: 'بوابة الدخول إلى عالم القراصنة والأدوات الحصرية',
            category: 'قرصنة',
            vip: true,
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            title: 'منصة الأدوات السرية',
            description: 'مجموعة أدوات حصرية للقراصنة والمطورين',
            category: 'أدوات',
            vip: false,
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 3,
            title: 'شبكة الأنظمة المغلقة',
            description: 'وصول حصري للأنظمة والشبكات المغلقة',
            category: 'شبكات',
            vip: true,
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        }
    ];
    
    loadContent('site', 'sites-grid', sites);
}

// تحميل بيانات التطبيقات
function loadAppsContent() {
    const apps = [
        {
            id: 1,
            title: 'هاكر مانجر Pro',
            description: 'إدارة كاملة لأدوات القرصنة والأمان',
            icon: 'fas fa-terminal',
            rating: 4.8,
            size: '25 MB',
            vip: true
        },
        {
            id: 2,
            title: 'شبكة الظل',
            description: 'تصفح آمن وغير قابل للتتبع',
            icon: 'fas fa-user-secret',
            rating: 4.5,
            size: '15 MB',
            vip: false
        },
        {
            id: 3,
            title: 'مفكك الشفرات',
            description: 'أداة متقدمة لفك تشفير الملفات',
            icon: 'fas fa-lock-open',
            rating: 4.9,
            size: '40 MB',
            vip: true
        }
    ];
    
    loadContent('app', 'apps-grid', apps);
}

// تحميل بيانات الملفات
function loadFilesContent() {
    const files = [
        {
            id: 1,
            title: 'دليل القرصنة الكامل',
            description: 'كتاب شامل عن تقنيات القرصنة الأخلاقية',
            icon: 'fas fa-book',
            vip: true
        },
        {
            id: 2,
            title: 'أدوات الأمان المتقدمة',
            description: 'مجموعة أدوات لحماية الأنظمة والشبكات',
            icon: 'fas fa-shield-alt',
            vip: false
        },
        {
            id: 3,
            title: 'قواعد بيانات القراصنة',
            description: 'قواعد بيانات حصرية للقراصنة المحترفين',
            icon: 'fas fa-database',
            vip: true
        }
    ];
    
    loadContent('file', 'files-grid', files);
}

// تحميل بيانات الموسيقى (توب 4 توب)
function loadMusicContent() {
    const songs = [
        {
            id: 1,
            title: 'ظلام الليل',
            artist: 'قراصنة الظلام',
            image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 2,
            title: 'شفرات السرية',
            artist: 'مجهول',
            image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 3,
            title: 'هاكرز أنونيموس',
            artist: 'مجموعة القراصنة',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 4,
            title: 'شبكة الظلال',
            artist: 'قراصنة الإنترنت',
            image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        }
    ];
    
    loadContent('song', 'top4top-grid', songs);
}

// توليد معرف مستخدم فريد
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// عرض رسالة
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = 'form-message ' + type;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// عرض إشعار
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

// تحديث السنة الحالية
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year')?.textContent = currentYear;
    document.getElementById('footer-year')?.textContent = currentYear;
}