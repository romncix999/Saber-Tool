// ملف netlify/functions/services.js
exports.handler = async function(event, context) {
    // هذه وظيفة Netlify لجلب الخدمات
    // في الإصدار الحقيقي، ستجلب البيانات من قاعدة بيانات
    
    // بيانات تجريبية للخدمات
    const services = {
        free: [
            { id: 1, name: 'المواقع المجانية', description: 'مجموعة من المواقع المجانية المفيدة' },
            { id: 2, name: 'التطبيقات الأساسية', description: 'تطبيقات مجانية لأجهزة مختلفة' },
            { id: 3, name: 'الملفات العامة', description: 'ملفات متنوعة للتحميل مجاناً' }
        ],
        vip: [
            { id: 4, name: 'المواقع المميزة', description: 'مواقع متقدمة وحصرية لأعضاء VIP' },
            { id: 5, name: 'التطبيقات المدفوعة', description: 'تطبيقات مدفوعة مجاناً لأعضاء VIP' },
            { id: 6, name: 'الملفات الحصرية', description: 'ملفات حصرية وعالية الجودة' },
            { id: 7, name: 'الموسيقى بدون إعلانات', description: 'تشغيل الموسيقى بدون مقاطعات إعلانية' },
            { id: 8, name: 'الدعم المميز', description: 'دعم فني سريع ومميز' }
        ]
    };
    
    return {
        statusCode: 200,
        body: JSON.stringify(services)
    };
}