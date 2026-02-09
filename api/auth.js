// ملف api/auth.js - وظائف المصادقة لـ Vercel
module.exports = async (req, res) => {
    // السماح لجميع المصادر (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    // التعامل مع طلبات OPTIONS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { action } = req.query;
    
    switch(action) {
        case 'login':
            return handleLogin(req, res);
        case 'register':
            return handleRegister(req, res);
        case 'check':
            return handleCheck(req, res);
        case 'logout':
            return handleLogout(req, res);
        default:
            return res.status(400).json({ error: 'Action not specified' });
    }
};

// معالجة تسجيل الدخول
async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;
        
        // في الإصدار النهائي، سيتم التحقق من قاعدة بيانات
        if (email && password) {
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    id: 'user_' + Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    plan: 'free'
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// معالجة التسجيل
async function handleRegister(req, res) {
    try {
        const { name, email, password } = req.body;
        
        if (name && email && password) {
            return res.status(200).json({
                success: true,
                message: 'Registration successful',
                user: {
                    id: 'user_' + Date.now(),
                    name: name,
                    email: email,
                    plan: 'free'
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// التحقق من الحالة
async function handleCheck(req, res) {
    try {
        const { token } = req.body;
        
        if (token) {
            return res.status(200).json({
                valid: true,
                user: {
                    id: 'user_123',
                    name: 'Test User',
                    email: 'test@example.com',
                    plan: 'free'
                }
            });
        } else {
            return res.status(400).json({
                valid: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// تسجيل الخروج
async function handleLogout(req, res) {
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
}