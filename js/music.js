// ملف js/music.js - مشغل الموسيقى
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة مشغل الموسيقى
    initMusicPlayer();
});

// مشغل الموسيقى
let musicPlayer = {
    audio: null,
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    volume: 0.7,
    init: function() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        
        // تحميل قائمة التشغيل الافتراضية
        this.loadDefaultPlaylist();
        
        // تهيئة الأحداث
        this.initEvents();
        
        // تحديث واجهة المستخدم
        this.updateUI();
    },
    loadDefaultPlaylist: function() {
        // قائمة تشغيل افتراضية
        this.playlist = [
            {
                id: 1,
                title: 'أغنية رائعة',
                artist: 'فنان مميز',
                album: 'ألبوم رائع',
                duration: '3:45',
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                image: 'images/default-album.jpg'
            },
            {
                id: 2,
                title: 'موسيقى هادئة',
                artist: 'ملحن مشهور',
                album: 'موسيقى الاسترخاء',
                duration: '4:20',
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                image: 'images/default-album.jpg'
            },
            {
                id: 3,
                title: 'أغنية سعيدة',
                artist: 'مغني محبوب',
                album: 'أجمل الأغاني',
                duration: '3:15',
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                image: 'images/default-album.jpg'
            },
            {
                id: 4,
                title: 'موسيقى حزينة',
                artist: 'فنان قدير',
                album: 'أجمل اللحظات',
                duration: '5:10',
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                image: 'images/default-album.jpg'
            },
            {
                id: 5,
                title: 'أغنية حماسية',
                artist: 'مغني مبدع',
                album: 'الأفضل',
                duration: '3:55',
                src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                image: 'images/default-album.jpg'
            }
        ];
        
        // عرض قائمة التشغيل
        this.renderPlaylist();
    },
    initEvents: function() {
        // أزرار التحكم
        const playBtn = document.getElementById('play-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const shuffleBtn = document.getElementById('shuffle-btn');
        const repeatBtn = document.getElementById('repeat-btn');
        const volumeIcon = document.getElementById('volume-icon');
        const volumeLevel = document.getElementById('volume-level');
        const volumeBar = document.querySelector('.volume-bar');
        
        // شريط التقدم
        const progressBar = document.querySelector('.progress-bar');
        const musicProgress = document.getElementById('music-progress');
        
        // المشغل المصغر
        const miniPlayBtn = document.getElementById('mini-play');
        const miniPrevBtn = document.getElementById('mini-prev');
        const miniNextBtn = document.getElementById('mini-next');
        const expandPlayer = document.getElementById('expand-player');
        
        // تشغيل/إيقاف
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (miniPlayBtn) {
            miniPlayBtn.addEventListener('click', () => this.togglePlay());
        }
        
        // السابق/التالي
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSong());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSong());
        }
        
        if (miniPrevBtn) {
            miniPrevBtn.addEventListener('click', () => this.prevSong());
        }
        
        if (miniNextBtn) {
            miniNextBtn.addEventListener('click', () => this.nextSong());
        }
        
        // تشغيل عشوائي
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        
        // تكرار
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }
        
        // التحكم في الصوت
        if (volumeBar) {
            volumeBar.addEventListener('click', (e) => {
                const rect = volumeBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.setVolume(percent);
            });
        }
        
        if (volumeIcon) {
            volumeIcon.addEventListener('click', () => {
                if (this.volume > 0) {
                    this.setVolume(0);
                } else {
                    this.setVolume(0.7);
                }
            });
        }
        
        // شريط تقدم الأغنية
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.seek(percent);
            });
        }
        
        // تحديث شريط التقدم
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // عند انتهاء الأغنية
        this.audio.addEventListener('ended', () => this.onSongEnd());
        
        // التوسيع إلى المشغل الكامل
        if (expandPlayer) {
            expandPlayer.addEventListener('click', () => {
                const musicPage = document.getElementById('music-page');
                if (musicPage) {
                    // التبديل لصفحة الموسيقى
                    switchPage('music');
                }
            });
        }
        
        // البحث عن الموسيقى
        const searchMusicBtn = document.getElementById('search-music');
        if (searchMusicBtn) {
            searchMusicBtn.addEventListener('click', () => {
                showNotification('ميزة البحث عن الموسيقى ستكون متاحة قريباً', 'info');
            });
        }
        
        // إنشاء قائمة تشغيل جديدة
        const createPlaylistBtn = document.getElementById('create-playlist');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', () => {
                showNotification('ميزة إنشاء قوائم التشغيل ستكون متاحة قريباً', 'info');
            });
        }
    },
    togglePlay: function() {
        if (this.playlist.length === 0) return;
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },
    play: function() {
        if (this.playlist.length === 0) return;
        
        const song = this.playlist[this.currentIndex];
        
        // إذا كان مصدر الأغنية مختلفاً عن الحالي
        if (this.audio.src !== song.src) {
            this.audio.src = song.src;
        }
        
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.updateUI();
                this.updatePlaylistUI();
                this.updateMiniPlayer();
            })
            .catch(error => {
                console.error('خطأ في تشغيل الموسيقى:', error);
                showNotification('تعذر تشغيل الموسيقى. يرجى المحاولة لاحقاً.', 'error');
            });
    },
    pause: function() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        this.updateMiniPlayer();
    },
    prevSong: function() {
        if (this.playlist.length === 0) return;
        
        if (this.isShuffle) {
            // اختيار أغنية عشوائية
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.playlist.length - 1;
            }
        }
        
        this.play();
    },
    nextSong: function() {
        if (this.playlist.length === 0) return;
        
        if (this.isShuffle) {
            // اختيار أغنية عشوائية
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex++;
            if (this.currentIndex >= this.playlist.length) {
                this.currentIndex = 0;
            }
        }
        
        this.play();
    },
    toggleShuffle: function() {
        this.isShuffle = !this.isShuffle;
        this.updateUI();
        
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            if (this.isShuffle) {
                shuffleBtn.style.color = 'var(--primary-color)';
                showNotification('تم تفعيل التشغيل العشوائي', 'info');
            } else {
                shuffleBtn.style.color = '';
                showNotification('تم إيقاف التشغيل العشوائي', 'info');
            }
        }
    },
    toggleRepeat: function() {
        this.isRepeat = !this.isRepeat;
        this.updateUI();
        
        const repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            if (this.isRepeat) {
                repeatBtn.style.color = 'var(--primary-color)';
                showNotification('تم تفعيل التكرار', 'info');
            } else {
                repeatBtn.style.color = '';
                showNotification('تم إيقاف التكرار', 'info');
            }
        }
    },
    setVolume: function(percent) {
        this.volume = Math.max(0, Math.min(1, percent));
        this.audio.volume = this.volume;
        this.updateUI();
        
        const volumeLevel = document.getElementById('volume-level');
        const volumeIcon = document.getElementById('volume-icon');
        
        if (volumeLevel) {
            volumeLevel.style.width = `${this.volume * 100}%`;
        }
        
        if (volumeIcon) {
            if (this.volume === 0) {
                volumeIcon.className = 'fas fa-volume-mute';
            } else if (this.volume < 0.5) {
                volumeIcon.className = 'fas fa-volume-down';
            } else {
                volumeIcon.className = 'fas fa-volume-up';
            }
        }
    },
    seek: function(percent) {
        if (!this.audio.duration) return;
        
        const time = this.audio.duration * percent;
        this.audio.currentTime = time;
    },
    updateProgress: function() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const currentTime = this.formatTime(this.audio.currentTime);
        const duration = this.formatTime(this.audio.duration);
        
        // تحديث شريط التقدم الرئيسي
        const musicProgress = document.getElementById('music-progress');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        
        if (musicProgress) {
            musicProgress.style.width = `${progress}%`;
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = currentTime;
        }
        
        if (durationEl) {
            durationEl.textContent = duration;
        }
        
        // تحديث المشغل المصغر
        this.updateMiniPlayerProgress();
    },
    updateMiniPlayerProgress: function() {
        if (!this.audio.duration) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const miniProgress = document.getElementById('mini-progress');
        
        if (miniProgress) {
            miniProgress.style.width = `${progress}%`;
        }
    },
    onSongEnd: function() {
        if (this.isRepeat) {
            // إعادة تشغيل الأغنية الحالية
            this.audio.currentTime = 0;
            this.play();
        } else {
            // الانتقال للأغنية التالية
            this.nextSong();
        }
    },
    updateUI: function() {
        const playBtn = document.getElementById('play-btn');
        const miniPlayBtn = document.getElementById('mini-play');
        const song = this.playlist[this.currentIndex];
        
        if (!song) return;
        
        // تحديث أزرار التشغيل/الإيقاف
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        }
        
        if (miniPlayBtn) {
            miniPlayBtn.innerHTML = this.isPlaying ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        }
        
        // تحديث معلومات الأغنية الحالية
        this.updateSongInfo(song);
        
        // تحديث أزرار التشغيل العشوائي والتكرار
        const shuffleBtn = document.getElementById('shuffle-btn');
        const repeatBtn = document.getElementById('repeat-btn');
        
        if (shuffleBtn) {
            shuffleBtn.style.color = this.isShuffle ? 'var(--primary-color)' : '';
        }
        
        if (repeatBtn) {
            repeatBtn.style.color = this.isRepeat ? 'var(--primary-color)' : '';
        }
    },
    updateSongInfo: function(song) {
        const songTitle = document.getElementById('song-title');
        const songArtist = document.getElementById('song-artist');
        const songAlbum = document.getElementById('song-album');
        const albumArt = document.getElementById('album-art');
        
        const miniTitle = document.getElementById('mini-title');
        const miniArtist = document.getElementById('mini-artist');
        const miniAlbum = document.getElementById('mini-album');
        
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;
        if (songAlbum) songAlbum.textContent = song.album;
        
        if (miniTitle) miniTitle.textContent = song.title;
        if (miniArtist) miniArtist.textContent = song.artist;
        if (miniAlbum) miniAlbum.src = song.image;
        
        if (albumArt) {
            const img = albumArt.querySelector('img');
            if (img) img.src = song.image;
        }
    },
    updateMiniPlayer: function() {
        const miniPlayer = document.getElementById('mini-player');
        const song = this.playlist[this.currentIndex];
        
        if (!song || !miniPlayer) return;
        
        // إظهار المشغل المصغر إذا كانت هناك أغنية
        miniPlayer.style.display = 'flex';
        
        // تحديث معلومات الأغنية
        const miniTitle = document.getElementById('mini-title');
        const miniArtist = document.getElementById('mini-artist');
        const miniAlbum = document.getElementById('mini-album');
        
        if (miniTitle) miniTitle.textContent = song.title;
        if (miniArtist) miniArtist.textContent = song.artist;
        if (miniAlbum) miniAlbum.src = song.image;
    },
    updatePlaylistUI: function() {
        const playlistItems = document.querySelectorAll('.playlist li');
        playlistItems.forEach((item, index) => {
            item.classList.remove('playing');
            
            if (index === this.currentIndex) {
                item.classList.add('playing');
            }
        });
    },
    renderPlaylist: function() {
        const playlistEl = document.getElementById('playlist');
        if (!playlistEl) return;
        
        playlistEl.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            
            li.innerHTML = `
                <div class="play-icon">
                    <i class="fas fa-play"></i>
                </div>
                <div class="song-details">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-duration">${song.duration}</div>
            `;
            
            li.addEventListener('click', () => {
                this.currentIndex = index;
                this.play();
            });
            
            playlistEl.appendChild(li);
        });
        
        // تحديث واجهة قائمة التشغيل
        this.updatePlaylistUI();
    },
    formatTime: function(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
};

// تهيئة مشغل الموسيقى
function initMusicPlayer() {
    musicPlayer.init();
}