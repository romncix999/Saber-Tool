// ملف js/music.js - نظام توب 4 توب
document.addEventListener('DOMContentLoaded', function() {
    initMusicSystem();
});

function initMusicSystem() {
    // تحميل قائمة توب 4 توب
    loadTop4Top();
    
    // تهيئة المشغل المصغر
    initMiniPlayer();
    
    // إضافة أنماط CSS للمشغل
    addPlayerStyles();
}

// تحميل قائمة توب 4 توب
function loadTop4Top() {
    // البيانات ستحمل من auth.js
    // إضافة الأحداث للأزرار
    setTimeout(() => {
        initMusicEvents();
    }, 1000);
}

// تهيئة المشغل المصغر
function initMiniPlayer() {
    const miniPlayer = document.getElementById('mini-player');
    if (!miniPlayer) return;
    
    // إخفاء المشغل في البداية
    miniPlayer.style.display = 'none';
    
    // تهيئة الأحداث
    document.getElementById('mini-play-btn')?.addEventListener('click', togglePlay);
    document.getElementById('mini-prev-btn')?.addEventListener('click', playPrev);
    document.getElementById('mini-next-btn')?.addEventListener('click', playNext);
    
    // حدث شريط التقدم
    const progressBar = document.getElementById('mini-player-progress');
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seek(percent);
        });
    }
}

// إضافة أنماط CSS
function addPlayerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(17, 17, 17, 0.95);
            border: 1px solid var(--card-border);
            border-left: 4px solid var(--toxic-green);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            max-width: 300px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        @keyframes slideIn {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification.success {
            border-left-color: var(--toxic-green);
        }
        
        .notification.error {
            border-left-color: var(--blood-red);
        }
        
        .notification.info {
            border-left-color: var(--electric-blue);
        }
        
        .notification.warning {
            border-left-color: var(--gold-vip);
        }
        
        .page-title {
            font-size: var(--font-xxl);
            color: var(--toxic-green);
            margin-bottom: var(--space-sm);
            text-shadow: var(--glow-green);
        }
        
        .page-subtitle {
            color: var(--text-secondary);
            margin-bottom: var(--space-xl);
        }
    `;
    
    document.head.appendChild(style);
}

// تهيئة أحداث الموسيقى
function initMusicEvents() {
    // أزرار التشغيل
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const songId = this.getAttribute('data-id');
            playSong(songId);
        });
    });
    
    // أزرار التحميل
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const songId = this.getAttribute('data-id');
            downloadSong(songId);
        });
    });
}

// بيانات الأغاني
const songsData = [
    {
        id: '1',
        title: 'ظلام الليل',
        artist: 'قراصنة الظلام',
        duration: '3:45',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: '2',
        title: 'شفرات السرية',
        artist: 'مجهول',
        duration: '4:20',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: '3',
        title: 'هاكرز أنونيموس',
        artist: 'مجموعة القراصنة',
        duration: '3:15',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: '4',
        title: 'شبكة الظلال',
        artist: 'قراصنة الإنترنت',
        duration: '5:10',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
];

// المتغيرات العالمية
let currentAudio = null;
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// تشغيل أغنية
function playSong(songId) {
    const songIndex = songsData.findIndex(song => song.id === songId);
    if (songIndex === -1) return;
    
    currentSongIndex = songIndex;
    const song = songsData[songIndex];
    
    // إيقاف المشغل الحالي إذا كان يعمل
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // إنشاء مشغل جديد
    currentAudio = new Audio(song.url);
    currentAudio.volume = 0.7;
    
    // أحداث المشغل
    currentAudio.addEventListener('loadedmetadata', function() {
        updateMiniPlayer(song);
        showMiniPlayer();
    });
    
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', playNext);
    
    // تشغيل الأغنية
    currentAudio.play()
        .then(() => {
            isPlaying = true;
            updatePlayButton();
            showNotification(`جاري تشغيل: ${song.title}`, 'info');
        })
        .catch(error => {
            console.error('خطأ في تشغيل الموسيقى:', error);
            showNotification('تعذر تشغيل الموسيقى. يرجى المحاولة لاحقاً.', 'error');
        });
}

// تبديل التشغيل/الإيقاف
function togglePlay() {
    if (!currentAudio) return;
    
    if (isPlaying) {
        currentAudio.pause();
        isPlaying = false;
    } else {
        currentAudio.play();
        isPlaying = true;
    }
    
    updatePlayButton();
}

// الأغنية التالية
function playNext() {
    if (isShuffle) {
        // تشغيل عشوائي
        currentSongIndex = Math.floor(Math.random() * songsData.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songsData.length;
    }
    
    playSong(songsData[currentSongIndex].id);
}

// الأغنية السابقة
function playPrev() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songsData.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songsData.length) % songsData.length;
    }
    
    playSong(songsData[currentSongIndex].id);
}

// التقدم في الأغنية
function seek(percent) {
    if (!currentAudio) return;
    
    const duration = currentAudio.duration;
    if (duration) {
        currentAudio.currentTime = duration * percent;
        updateProgress();
    }
}

// تحديث شريط التقدم
function updateProgress() {
    if (!currentAudio) return;
    
    const progressBar = document.getElementById('mini-player-progress-bar');
    if (!progressBar) return;
    
    const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBar.style.width = `${progress}%`;
}

// تحديث زر التشغيل
function updatePlayButton() {
    const playBtn = document.getElementById('mini-play-btn');
    if (!playBtn) return;
    
    playBtn.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
}

// تحديث المشغل المصغر
function updateMiniPlayer(song) {
    document.getElementById('mini-player-title').textContent = song.title;
    document.getElementById('mini-player-artist').textContent = song.artist;
    document.getElementById('mini-player-cover').src = song.image;
}

// إظهار المشغل المصغر
function showMiniPlayer() {
    const miniPlayer = document.getElementById('mini-player');
    if (miniPlayer) {
        miniPlayer.style.display = 'flex';
        miniPlayer.classList.add('active');
    }
}

// إخفاء المشغل المصغر
function hideMiniPlayer() {
    const miniPlayer = document.getElementById('mini-player');
    if (miniPlayer) {
        miniPlayer.style.display = 'none';
        miniPlayer.classList.remove('active');
    }
}

// تحميل أغنية
function downloadSong(songId) {
    const song = songsData.find(s => s.id === songId);
    if (!song) return;
    
    showNotification(`جاري تحميل: ${song.title}`, 'info');
    
    // محاكاة التحميل (في الإصدار النهائي، سيكون رابط تحميل حقيقي)
    setTimeout(() => {
        showNotification(`تم تحميل: ${song.title}`, 'success');
    }, 2000);
}

// تبديل وضع التشغيل العشوائي
function toggleShuffle() {
    isShuffle = !isShuffle;
    showNotification(isShuffle ? 'تم تفعيل التشغيل العشوائي' : 'تم إيقاف التشغيل العشوائي', 'info');
}

// تبديل وضع التكرار
function toggleRepeat() {
    isRepeat = !isRepeat;
    showNotification(isRepeat ? 'تم تفعيل التكرار' : 'تم إيقاف التكرار', 'info');
}