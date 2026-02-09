// ملف api/vip.js - وظائف VIP لـ Vercel
module.exports = async (req, res) => {
    // إعدادات CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { action } = req.query;
    
    switch(action) {
        case 'check':
            return handleCheck(req, res);
        case 'activate':
            return handleActivate(req, res);
        case 'codes':
            return handleCodes(req, res);
        default:
            return res.status(400).json({ error: 'Action not specified' });
    }
};

// التحقق من كود VIP
async function handleActivate(req, res) {
    try {
        const { code, userId } = req.body;
        
        // أكواد VIP صالحة
        const validCodes = {
            'SABERVIP2024': { days: 10, valid: true },
            'TOOLS1234': { days: 10, valid: true },
            'PREMIUM5678': { days: 10, valid: true },
            'TESTVIP': { days: 1, valid: true }
        };
        
        const codeInfo = validCodes[code];
        
        if (codeInfo && codeInfo.valid) {
            // حساب تاريخ الانتهاء
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + codeInfo.days);
            
            return res.status(200).json({
                success: true,
                message: 'VIP activated successfully',
                expiry: expiryDate.toISOString(),
                days: codeInfo.days
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired VIP code'
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

// التحقق من حالة VIP
async function handleCheck(req, res) {
    try {
        const { userId } = req.body;
        
        // في الإصدار النهائي، سيتم التحقق من قاعدة بيانات
        return res.status(200).json({
            isVip: false,
            expiry: null,
            daysLeft: 0
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// الحصول على أكواد VIP
async function handleCodes(req, res) {
    try {
        // في الإصدار النهائي، سيتم جلب الأكواد من قاعدة بيانات
        return res.status(200).json({
            success: true,
            codes: [
                { code: 'SABERVIP2024', price: 10, currency: 'USD' },
                { code: 'TOOLS1234', price: 10, currency: 'USD' },
                { code: 'PREMIUM5678', price: 15, currency: 'USD' }
            ]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}