// ملف js/auth.js - إدارة المصادقة والتسجيل
document.addEventListener('DOMContentLoaded', function() {
    // التحقق مما إذا كان المستخدم مسجلاً
    checkAuthStatus();
    
    // تهيئة أحداث الصفحة
    initAuthEvents();
    initPageNavigation();
});

// التحقق من حالة المصادقة
function checkAuthStatus() {
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname === '/';
    const isLoggedIn = localStorage.getItem('saber_user_logged_in') === 'true';
    const loginExpiry = localStorage.getItem('saber_login_expiry');
    
    // التحقق من انتهاء صلاحية تسجيل الدخول (شهر)
    if (loginExpiry) {
        const now = new Date().getTime();
        if (now > parseInt(loginExpiry)) {
            localStorage.removeItem('saber_user_logged_in');
            localStorage.removeItem('saber_login_expiry');
            localStorage.removeItem('saber_user_data');
            
            if (!isLoginPage) {
                window.location.href = 'login.html';
                return;
            }
        }
    }
    
    // إذا كان المستخدم مسجلاً وهو في صفحة الدخول، يتم توجيهه للصفحة الرئيسية
    if (isLoggedIn && isLoginPage) {
        window.location.href = 'index.html';
        return;
    }
    
    // إذا لم يكن المستخدم مسجلاً وهو في الصفحة الرئيسية، يتم توجيهه لصفحة الدخول
    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }
    
    // إذا كان المستخدم في الصفحة الرئيسية وكان مسجلاً، يتم تحميل بياناته
    if (isLoggedIn && !isLoginPage) {
        loadUserData();
    }
}

// تهيئة أحداث المصادقة
function initAuthEvents() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const rememberMe = document.getElementById('remember-me');
    
    // تبديل بين تسجيل الدخول والتسجيل
    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => switchAuthTab('login'));
        registerTab.addEventListener('click', () => switchAuthTab('register'));
    }
    
    // تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // التسجيل
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// تبديل بين تبويبي الدخول والتسجيل
function switchAuthTab(tab) {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
}

// معالجة تسجيل الدخول
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const authMessage = document.getElementById('auth-message');
    
    // التحقق من البيانات
    if (!email || !password) {
        showMessage(authMessage, 'يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    // محاكاة الاتصال بالخادم (في الإصدار الحقيقي، سيكون اتصال بـ Netlify Functions)
    const users = JSON.parse(localStorage.getItem('saber_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // حفظ حالة تسجيل الدخول
        localStorage.setItem('saber_user_logged_in', 'true');
        localStorage.setItem('saber_user_data', JSON.stringify(user));
        
        // حساب تاريخ انتهاء الصلاحية (شهر)
        const expiryDate = new Date();
        if (rememberMe) {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
            expiryDate.setDate(expiryDate.getDate() + 7); // أسبوع إذا لم يختار "تذكرني"
        }
        
        localStorage.setItem('saber_login_expiry', expiryDate.getTime().toString());
        
        showMessage(authMessage, 'تم تسجيل الدخول بنجاح! يتم توجيهك...', 'success');
        
        // التوجيه للصفحة الرئيسية بعد تأخير قصير
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage(authMessage, 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    }
}

// معالجة التسجيل
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const acceptTerms = document.getElementById('accept-terms').checked;
    const authMessage = document.getElementById('auth-message');
    
    // التحقق من البيانات
    if (!name || !email || !password || !confirmPassword) {
        showMessage(authMessage, 'يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage(authMessage, 'كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(authMessage, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showMessage(authMessage, 'يرجى الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
    const users = JSON.parse(localStorage.getItem('saber_users')) || [];
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showMessage(authMessage, 'هذا البريد الإلكتروني مسجل بالفعل', 'error');
        return;
    }
    
    // إنشاء مستخدم جديد
    const newUser = {
        id: generateId(),
        name: name,
        email: email,
        password: password,
        plan: 'free',
        vipExpiry: null,
        registrationDate: new Date().toISOString(),
        avatar: 'images/default-avatar.png'
    };
    
    users.push(newUser);
    localStorage.setItem('saber_users', JSON.stringify(users));
    
    showMessage(authMessage, 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
    
    // التبديل لتبويب تسجيل الدخول
    setTimeout(() => {
        switchAuthTab('login');
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = password;
    }, 2000);
}

// معالجة تسجيل الخروج
function handleLogout() {
    localStorage.removeItem('saber_user_logged_in');
    localStorage.removeItem('saber_login_expiry');
    localStorage.removeItem('saber_user_data');
    
    showNotification('تم تسجيل الخروج بنجاح', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// تحميل بيانات المستخدم
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('saber_user_data'));
    if (!userData) return;
    
    // تحديث اسم المستخدم في الشريط العلوي
    const userNameElements = document.querySelectorAll('#user-name, #dropdown-name');
    userNameElements.forEach(el => {
        if (el) el.textContent = userData.name;
    });
    
    // تحديث البريد الإلكتروني
    const userEmail = document.getElementById('dropdown-email');
    if (userEmail) userEmail.textContent = userData.email;
    
    // تحديث صورة المستخدم
    const userAvatarElements = document.querySelectorAll('#user-avatar, #dropdown-avatar');
    userAvatarElements.forEach(el => {
        if (el) el.src = userData.avatar || 'images/default-avatar.png';
    });
    
    // تحديث حالة VIP
    const userPlanElements = document.querySelectorAll('#user-plan, #user-type, #dropdown-plan');
    const isVip = userData.vipExpiry && new Date(userData.vipExpiry) > new Date();
    const planText = isVip ? 'VIP' : 'مجاني';
    
    userPlanElements.forEach(el => {
        if (el) el.textContent = planText;
    });
    
    // تحديث الأيام المتبقية
    const userDays = document.getElementById('user-days');
    if (userDays) {
        if (isVip) {
            const expiryDate = new Date(userData.vipExpiry);
            const now = new Date();
            const diffTime = expiryDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            userDays.textContent = diffDays > 0 ? diffDays : 0;
        } else {
            userDays.textContent = '0';
        }
    }
    
    // تحديث حالة VIP في نافذة VIP
    updateVipStatus();
}

// تحديث حالة VIP
function updateVipStatus() {
    const userData = JSON.parse(localStorage.getItem('saber_user_data'));
    if (!userData) return;
    
    const vipStatus = document.getElementById('vip-status');
    if (!vipStatus) return;
    
    const isVip = userData.vipExpiry && new Date(userData.vipExpiry) > new Date();
    
    if (isVip) {
        const expiryDate = new Date(userData.vipExpiry);
        const formattedDate = expiryDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        vipStatus.innerHTML = `
            <h3><i class="fas fa-crown"></i> أنت عضو VIP</h3>
            <p>عضوية VIP الخاصة بك صالحة حتى ${formattedDate}</p>
        `;
    } else {
        vipStatus.innerHTML = `
            <h3><i class="fas fa-crown"></i> ليست لديك عضوية VIP</h3>
            <p>تفعيل VIP يمنحك وصولاً كاملاً لجميع الميزات لمدة 10 أيام</p>
        `;
    }
}

// تهيئة التنقل بين الصفحات
function initPageNavigation() {
    // التنقل بين الصفحات
    const navLinks = document.querySelectorAll('.nav-link, .quick-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                switchPage(page);
            }
        });
    });
    
    // قائمة الملف الشخصي المنسدلة
    const userProfile = document.getElementById('user-profile');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // إغلاق القائمة المنسدلة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // زر VIP
    const vipBtn = document.getElementById('vip-btn');
    const vipModal = document.getElementById('vip-modal');
    const closeVip = document.getElementById('close-vip');
    
    if (vipBtn && vipModal) {
        vipBtn.addEventListener('click', () => {
            vipModal.classList.add('active');
            updateVipStatus();
        });
    }
    
    if (closeVip && vipModal) {
        closeVip.addEventListener('click', () => {
            vipModal.classList.remove('active');
        });
    }
    
    // تفعيل كود VIP
    const activateVipBtn = document.getElementById('activate-vip');
    if (activateVipBtn) {
        activateVipBtn.addEventListener('click', activateVipCode);
    }
    
    // رابط أكواد VIP
    const vipCodesLink = document.getElementById('vip-codes-link');
    if (vipCodesLink) {
        vipCodesLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('سيتم توجيهك إلى صفحة أكواد VIP قريباً', 'info');
            // في الإصدار النهائي، سيتم توجيه المستخدم لصفحة خارجية
        });
    }
}

// تبديل الصفحات
function switchPage(pageId) {
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // إزالة النشاط من جميع روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // تفعيل رابط التنقل المقابل
    const activeNavLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
    
    // إغلاق القائمة المنسدلة للمستخدم إذا كانت مفتوحة
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
        userDropdown.classList.remove('show');
    }
    
    // تحميل محتوى الصفحة إذا لزم الأمر
    loadPageContent(pageId);
}

// تحميل محتوى الصفحة
function loadPageContent(pageId) {
    // في الإصدار النهائي، سيتم جلب البيانات من Netlify Functions
    // حالياً، نستخدم بيانات تجريبية
    
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
            // سيتم التعامل معها في music.js
            break;
    }
}

// تحميل محتوى الصفحة الرئيسية
function loadHomeContent() {
    const recentGrid = document.getElementById('recent-grid');
    if (!recentGrid) return;
    
    // بيانات تجريبية للمحتوى المضاف حديثاً
    const recentContent = [
        {
            id: 1,
            title: 'موقع تصميم جرافيك متميز',
            description: 'موقع يحتوي على أدوات تصميم جرافيك متقدمة',
            category: 'تصميم',
            type: 'site',
            image: 'https://via.placeholder.com/300x150/6a11cb/ffffff?text=Design+Site'
        },
        {
            id: 2,
            title: 'تطبيق إدارة المهام',
            description: 'تطبيق يساعدك على تنظيم وإدارة مهامك اليومية',
            category: 'إنتاجية',
            type: 'app',
            image: 'https://via.placeholder.com/300x150/2575fc/ffffff?text=Task+App'
        },
        {
            id: 3,
            title: 'مكتبة الأيقونات المميزة',
            description: 'مكتبة تحتوي على آلاف الأيقونات عالية الجودة',
            category: 'تصميم',
            type: 'file',
            image: 'https://via.placeholder.com/300x150/ff6b6b/ffffff?text=Icons+Pack'
        },
        {
            id: 4,
            title: 'موقع تعلم البرمجة',
            description: 'موقع يعلمك البرمجة من الصفر إلى الاحتراف',
            category: 'تعليم',
            type: 'site',
            image: 'https://via.placeholder.com/300x150/4CAF50/ffffff?text=Coding+Site'
        }
    ];
    
    recentGrid.innerHTML = '';
    
    recentContent.forEach(item => {
        const card = createContentCard(item);
        recentGrid.appendChild(card);
    });
}

// تحميل محتوى المواقع
function loadSitesContent() {
    const sitesGrid = document.getElementById('sites-grid');
    if (!sitesGrid) return;
    
    // بيانات تجريبية للمواقع
    const sites = [
        {
            id: 1,
            title: 'موقع التصميم الإبداعي',
            description: 'منصة شاملة لمصممي الجرافيك والويب',
            category: 'تصميم',
            rating: 4.8,
            isVip: true,
            image: 'https://via.placeholder.com/300x150/6a11cb/ffffff?text=Creative+Design'
        },
        {
            id: 2,
            title: 'منصة التعلم الذاتي',
            description: 'آلاف الدورات التعليمية في مختلف المجالات',
            category: 'تعليم',
            rating: 4.7,
            isVip: false,
            image: 'https://via.placeholder.com/300x150/2575fc/ffffff?text=Learning+Platform'
        },
        {
            id: 3,
            title: 'موقع التجارة الإلكترونية',
            description: 'حل متكامل لإنشاء متاجر إلكترونية',
            category: 'أعمال',
            rating: 4.5,
            isVip: true,
            image: 'https://via.placeholder.com/300x150/ff6b6b/ffffff?text=E-commerce'
        },
        {
            id: 4,
            title: 'منصة العمل الحر',
            description: 'ربط العملاء بأفضل المستقلين حول العالم',
            category: 'أعمال',
            rating: 4.6,
            isVip: false,
            image: 'https://via.placeholder.com/300x150/4CAF50/ffffff?text=Freelance'
        },
        {
            id: 5,
            title: 'موقع الترفيه والألعاب',
            description: 'ألعاب أونلاين ومحتوى ترفيهي متنوع',
            category: 'ترفيه',
            rating: 4.4,
            isVip: false,
            image: 'https://via.placeholder.com/300x150/FF9800/ffffff?text=Entertainment'
        },
        {
            id: 6,
            title: 'موقع البرمجة المتقدمة',
            description: 'أدوات وموارد للمبرمجين المحترفين',
            category: 'برمجة',
            rating: 4.9,
            isVip: true,
            image: 'https://via.placeholder.com/300x150/9C27B0/ffffff?text=Advanced+Coding'
        }
    ];
    
    sitesGrid.innerHTML = '';
    
    sites.forEach(site => {
        const card = createSiteCard(site);
        sitesGrid.appendChild(card);
    });
    
    // إضافة أحداث الفلترة
    initFilterEvents();
}

// تحميل محتوى التطبيقات
function loadAppsContent() {
    const appsGrid = document.getElementById('apps-grid');
    if (!appsGrid) return;
    
    // بيانات تجريبية للتطبيقات
    const apps = [
        {
            id: 1,
            title: 'تطبيق تحرير الصور',
            description: 'تطبيق احترافي لتحرير الصور على الهاتف',
            os: 'android',
            rating: 4.6,
            isVip: false,
            image: 'https://via.placeholder.com/300x150/6a11cb/ffffff?text=Photo+Editor'
        },
        {
            id: 2,
            title: 'تطبيق إدارة المشاريع',
            description: 'إدارة مشاريعك وفريقك بكفاءة',
            os: 'ios',
            rating: 4.8,
            isVip: true,
            image: 'https://via.placeholder.com/300x150/2575fc/ffffff?text=Project+Manager'
        },
        {
            id: 3,
            title: 'تطبيق الترجمة الفورية',
            description: 'ترجمة نصوص وصوت وفيديو في الوقت الحقيقي',
            os: 'windows',
            rating: 4.5,
            isVip: false,
            image: 'https://via.placeholder.com/300x150/ff6b6b/ffffff?text=Translator'
        },
        {
            id: 4,
            title: 'تطبيق تحليل البيانات',
            description: 'تحليل وعرض البيانات بشكل احترافي',
            os: 'android',
            rating: 4.7,
            isVip: true,
            image: 'https://via.placeholder.com/300x150/4CAF50/ffffff?text=Data+Analyzer'
        }
    ];
    
    appsGrid.innerHTML = '';
    
    apps.forEach(app => {
        const card = createAppCard(app);
        appsGrid.appendChild(card);
    });
    
    // إضافة أحداث تصفية التطبيقات حسب نظام التشغيل
    initAppFilterEvents();
}

// تحميل محتوى الملفات
function loadFilesContent() {
    const filesGrid = document.getElementById('files-grid');
    if (!filesGrid) return;
    
    // بيانات تجريبية للملفات
    const files = [
        {
            id: 1,
            title: 'مكتبة الأيقونات المميزة',
            description: 'أكثر من 5000 أيقونة عالية الجودة',
            type: 'zip',
            size: '45 MB',
            downloads: 1250,
            isVip: true
        },
        {
            id: 2,
            title: 'دورة تصميم UI/UX كاملة',
            description: 'دورة شاملة لتعلم تصميم واجهات المستخدم',
            type: 'pdf',
            size: '120 MB',
            downloads: 890,
            isVip: false
        },
        {
            id: 3,
            title: 'قوالب تصميم مواقع جاهزة',
            description: 'مجموعة قواقع HTML/CSS جاهزة للاستخدام',
            type: 'zip',
            size: '85 MB',
            downloads: 2100,
            isVip: false
        },
        {
            id: 4,
            title: 'مكتبة صور احترافية',
            description: 'مجموعة صور عالية الجودة للاستخدام التجاري',
            type: 'image',
            size: '320 MB',
            downloads: 1560,
            isVip: true
        }
    ];
    
    filesGrid.innerHTML = '';
    
    files.forEach(file => {
        const card = createFileCard(file);
        filesGrid.appendChild(card);
    });
    
    // إضافة أحداث تصفية الملفات
    initFileFilterEvents();
}

// إنشاء بطاقة محتوى
function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    let typeIcon = 'fas fa-globe';
    if (item.type === 'app') typeIcon = 'fas fa-mobile-alt';
    if (item.type === 'file') typeIcon = 'fas fa-file';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="card-content">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-description">${item.description}</p>
            <div class="card-footer">
                <span class="card-category">${item.category}</span>
                <div class="card-actions">
                    <button class="action-btn" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="تحميل">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// إنشاء بطاقة موقع
function createSiteCard(site) {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    const vipBadge = site.isVip ? '<span class="vip-badge">VIP</span>' : '';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${site.image}" alt="${site.title}">
            ${vipBadge}
        </div>
        <div class="card-content">
            <h3 class="card-title">${site.title}</h3>
            <p class="card-description">${site.description}</p>
            <div class="card-footer">
                <span class="card-category">${site.category}</span>
                <div class="card-rating">
                    <i class="fas fa-star"></i> ${site.rating}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// إنشاء بطاقة تطبيق
function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'content-card';
    
    let osIcon = 'fab fa-android';
    if (app.os === 'ios') osIcon = 'fab fa-apple';
    if (app.os === 'windows') osIcon = 'fab fa-windows';
    
    const vipBadge = app.isVip ? '<span class="vip-badge">VIP</span>' : '';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${app.image}" alt="${app.title}">
            ${vipBadge}
        </div>
        <div class="card-content">
            <h3 class="card-title">${app.title}</h3>
            <p class="card-description">${app.description}</p>
            <div class="card-footer">
                <div class="card-os">
                    <i class="${osIcon}"></i> ${app.os.toUpperCase()}
                </div>
                <div class="card-rating">
                    <i class="fas fa-star"></i> ${app.rating}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// إنشاء بطاقة ملف
function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    
    let fileIcon = 'fas fa-file-pdf';
    let fileTypeClass = 'pdf';
    
    if (file.type === 'zip') {
        fileIcon = 'fas fa-file-archive';
        fileTypeClass = 'zip';
    } else if (file.type === 'image') {
        fileIcon = 'fas fa-file-image';
        fileTypeClass = 'image';
    } else if (file.type === 'doc') {
        fileIcon = 'fas fa-file-word';
        fileTypeClass = 'doc';
    }
    
    const vipLock = file.isVip ? '<i class="fas fa-lock vip-lock" title="يحتاج عضوية VIP"></i>' : '';
    
    card.innerHTML = `
        <div class="file-icon ${fileTypeClass}">
            <i class="${fileIcon}"></i>
            ${vipLock}
        </div>
        <h4 class="file-name">${file.title}</h4>
        <p class="file-description">${file.description}</p>
        <div class="file-meta">
            <span><i class="fas fa-hdd"></i> ${file.size}</span>
            <span><i class="fas fa-download"></i> ${file.downloads}</span>
        </div>
        <div class="file-actions">
            <button class="file-btn preview">معاينة</button>
            <button class="file-btn download">تحميل</button>
        </div>
    `;
    
    return card;
}

// تهيئة أحداث الفلترة
function initFilterEvents() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const siteSearch = document.getElementById('site-search');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterSites(category);
        });
    });
    
    if (siteSearch) {
        siteSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterSitesBySearch(searchTerm);
        });
    }
}

// فلترة المواقع حسب التصنيف
function filterSites(category) {
    // في الإصدار النهائي، سيتم تطبيق الفلترة على البيانات الحقيقية
    // حالياً، نعرض رسالة بسيطة
    if (category === 'all') {
        showNotification('عرض جميع المواقع', 'info');
    } else {
        showNotification(`عرض المواقع في فئة "${category}"`, 'info');
    }
}

// فلترة المواقع حسب البحث
function filterSitesBySearch(searchTerm) {
    if (searchTerm.length > 2) {
        showNotification(`البحث عن: ${searchTerm}`, 'info');
    }
}

// تهيئة أحداث تصفية التطبيقات
function initAppFilterEvents() {
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        category.addEventListener('click', function() {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const os = this.getAttribute('data-os');
            filterApps(os);
        });
    });
}

// فلترة التطبيقات حسب نظام التشغيل
function filterApps(os) {
    if (os === 'all') {
        showNotification('عرض جميع التطبيقات', 'info');
    } else {
        showNotification(`عرض تطبيقات نظام ${os.toUpperCase()}`, 'info');
    }
}

// تهيئة أحداث تصفية الملفات
function initFileFilterEvents() {
    const fileTypeBtns = document.querySelectorAll('.file-type-btn');
    
    fileTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            fileTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.getAttribute('data-type');
            filterFiles(type);
        });
    });
    
    // زر رفع الملف
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            showNotification('ميزة رفع الملفات ستكون متاحة قريباً', 'info');
        });
    }
}

// فلترة الملفات حسب النوع
function filterFiles(type) {
    if (type === 'all') {
        showNotification('عرض جميع الملفات', 'info');
    } else {
        showNotification(`عرض ملفات من نوع ${type.toUpperCase()}`, 'info');
    }
}

// تفعيل كود VIP
function activateVipCode() {
    const vipCode = document.getElementById('vip-code').value;
    const activationResult = document.getElementById('activation-result');
    
    if (!vipCode) {
        showMessage(activationResult, 'يرجى إدخال كود VIP', 'error');
        return;
    }
    
    // في الإصدار الحقيقي، سيتم التحقق من الكود عبر Netlify Functions
    // حالياً، نتحقق من بعض الأكواد التجريبية
    
    const validCodes = ['SABERVIP2024', 'TOOLS1234', 'PREMIUM5678'];
    
    if (validCodes.includes(vipCode.toUpperCase())) {
        // تفعيل VIP للمستخدم
        const userData = JSON.parse(localStorage.getItem('saber_user_data'));
        if (userData) {
            // إضافة 10 أيام للعضوية
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 10);
            
            userData.plan = 'vip';
            userData.vipExpiry = expiryDate.toISOString();
            
            localStorage.setItem('saber_user_data', JSON.stringify(userData));
            
            // تحديث واجهة المستخدم
            loadUserData();
            
            showMessage(activationResult, 'تم تفعيل عضوية VIP بنجاح لمدة 10 أيام!', 'success');
            showNotification('مبروك! تم تفعيل عضوية VIP بنجاح', 'success');
            
            // تفريغ حقل الإدخال
            document.getElementById('vip-code').value = '';
            
            // تحديث حالة VIP في النافذة
            setTimeout(updateVipStatus, 500);
        }
    } else {
        showMessage(activationResult, 'كود VIP غير صالح أو منتهي الصلاحية', 'error');
    }
}

// عرض رسالة
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = 'auth-message ' + type;
    element.style.display = 'block';
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// عرض إشعار
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

// إنشاء معرف فريد
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// تحديث السنة الحالية في التذييل
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year, #footer-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });
}

// تحديث السنة عند تحميل الصفحة
updateCurrentYear();