// ملف api/services.js - وظائف الخدمات لـ Vercel
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
    
    const { type } = req.query;
    
    switch(type) {
        case 'sites':
            return getSites(req, res);
        case 'apps':
            return getApps(req, res);
        case 'files':
            return getFiles(req, res);
        case 'music':
            return getMusic(req, res);
        default:
            return getAllServices(req, res);
    }
};

// الحصول على جميع الخدمات
async function getAllServices(req, res) {
    const services = {
        free: [
            { id: 1, name: 'المواقع المجانية', description: 'مواقع مجانية مفيدة', type: 'site' },
            { id: 2, name: 'التطبيقات الأساسية', description: 'تطبيقات مجانية أساسية', type: 'app' },
            { id: 3, name: 'الملفات العامة', description: 'ملفات عامة للتحميل', type: 'file' }
        ],
        vip: [
            { id: 4, name: 'المواقع الحصرية', description: 'مواقع حصرية لأعضاء VIP', type: 'site' },
            { id: 5, name: 'التطبيقات المدفوعة', description: 'تطبيقات مدفوعة مجاناً', type: 'app' },
            { id: 6, name: 'الملفات السرية', description: 'ملفات سرية وحصرية', type: 'file' },
            { id: 7, name: 'الموسيقى الحصرية', description: 'أغاني حصرية بدون إعلانات', type: 'music' }
        ]
    };
    
    return res.status(200).json(services);
}

// الحصول على المواقع
async function getSites(req, res) {
    const sites = [
        {
            id: 1,
            title: 'موقع القراصنة المخفي',
            description: 'بوابة الدخول إلى عالم القراصنة',
            category: 'قرصنة',
            url: 'https://example.com',
            vip: true
        },
        {
            id: 2,
            title: 'منصة الأدوات السرية',
            description: 'أدوات حصرية للقراصنة',
            category: 'أدوات',
            url: 'https://tools.example.com',
            vip: false
        }
    ];
    
    return res.status(200).json(sites);
}

// الحصول على التطبيقات
async function getApps(req, res) {
    const apps = [
        {
            id: 1,
            title: 'هاكر مانجر Pro',
            description: 'إدارة أدوات القرصنة',
            platform: 'Android',
            size: '25MB',
            vip: true
        },
        {
            id: 2,
            title: 'شبكة الظل',
            description: 'تصفح آمن وغير قابل للتتبع',
            platform: 'iOS',
            size: '15MB',
            vip: false
        }
    ];
    
    return res.status(200).json(apps);
}

// الحصول على الملفات
async function getFiles(req, res) {
    const files = [
        {
            id: 1,
            title: 'دليل القرصنة الكامل',
            description: 'كتاب شامل عن القرصنة',
            type: 'PDF',
            size: '5MB',
            vip: true
        },
        {
            id: 2,
            title: 'أدوات الأمان المتقدمة',
            description: 'مجموعة أدوات الحماية',
            type: 'ZIP',
            size: '10MB',
            vip: false
        }
    ];
    
    return res.status(200).json(files);
}

// الحصول على الموسيقى
async function getMusic(req, res) {
    const music = [
        {
            id: 1,
            title: 'ظلام الليل',
            artist: 'قراصنة الظلام',
            duration: '3:45',
            url: 'https://example.com/music1.mp3',
            vip: false
        },
        {
            id: 2,
            title: 'شفرات السرية',
            artist: 'مجهول',
            duration: '4:20',
            url: 'https://example.com/music2.mp3',
            vip: true
        }
    ];
    
    return res.status(200).json(music);
}