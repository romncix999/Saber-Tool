// ملف netlify/functions/vip.js
exports.handler = async function(event, context) {
    // هذه وظيفة Netlify للتحقق من أكواد VIP
    // في الإصدار الحقيقي، ستتحقق من قاعدة بيانات الأكواد
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'الطريقة غير مسموح بها' })
        };
    }
    
    try {
        const { code } = JSON.parse(event.body);
        
        // أكواد VIP صالحة (في الإصدار الحقيقي، ستكون في قاعدة بيانات)
        const validCodes = {
            'SABERVIP2024': true,
            'TOOLS1234': true,
            'PREMIUM5678': true
        };
        
        const isValid = validCodes[code] || false;
        
        if (isValid) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    valid: true,
                    message: 'كود VIP صالح',
                    days: 10
                })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    valid: false,
                    message: 'كود VIP غير صالح أو منتهي الصلاحية'
                })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'حدث خطأ في الخادم',
                details: error.message 
            })
        };
    }
}