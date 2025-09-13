import { createSidebar, createMusicPlayer } from './components.js';
import { Feed } from './feed.js';
import { Notifications } from './notifications.js';
import { Profile } from './profile.js';
import { Chat } from './chat.js';
import { Explore } from './explore.js';
import { Game } from './game.js';
import { Call } from './call.js';
import { Comunidade } from './comunidade.js';
import { Pagamento } from './pagamento.js';
import { Serve } from './serve.js';


document.addEventListener('DOMContentLoaded', () => {
    // Determina o contexto da página para os caminhos relativos
    const path = window.location.pathname;
    const pageName = path.split("/").pop();
    const isIndexPage = pageName === 'index.html' || pageName === '';
    const pathPrefix = isIndexPage ? './' : '../';

    // Encontra os containers e injeta os componentes reutilizáveis (Sidebar e Player)
    const sidebarContainer = document.getElementById('sidebar-container');
    const musicPlayerContainer = document.getElementById('music-player-container');

    if (sidebarContainer) {
        sidebarContainer.innerHTML = createSidebar(pageName, isIndexPage);
    }
    if (musicPlayerContainer) {
        musicPlayerContainer.innerHTML = createMusicPlayer(isIndexPage);
    }

    console.log(`Conectare DOM loaded on ${pageName}. Initializing scripts.`);

    // ======= Inicializador Global =======
    const initializeApp = () => {
        // Expor módulos para serem acessíveis globalmente
        window.Notifications = Notifications;
        window.Explore = Explore;

        // Inicializa componentes globais primeiro
        ThemeManager.init();
        ProfileCustomizer.init();
        MusicPlayer.init(pathPrefix);
        EventManager.init(); // NOVO: Inicia o gerenciador de eventos


        // ======= Inicializadores Específicos da Página =======
        console.log(`Página atual: ${pageName}. Verificando qual módulo inicializar.`);
        switch(pageName) {
            case 'feed.html':
                Feed.init();
                break;
            case 'notificacoes.html':
                Notifications.init();
                break;
            case 'profile.html':
                console.log("Página de perfil detectada. Chamando Profile.init().");
                Profile.init();
                break;
            case 'chat.html':
                Chat.init();
                break;
            case 'search.html':
                 Explore.init();
                break;
            case 'game.html':
                Game.init();
                break;
            case 'pagamento.html':
                Pagamento.init();
                break;
            case 'call.html': // Rota genérica para a chamada
                Call.init();
                break;
            case 'comunidade.html':
                Comunidade.init();
                break;
            case 'serve.html': // Adiciona a rota para o hub da comunidade
                Serve.init();
                break;
        }
    };

    // Inicia a aplicação
    initializeApp();
});


// =================================
//  GERENCIADOR DE TEMA
// =================================
const ThemeManager = {
    body: document.body,
    lightThemeBtn: null,
    darkThemeBtn: null,

    init() {
        // Atraso para garantir que os botões injetados via JS existam
        setTimeout(() => {
            this.lightThemeBtn = document.getElementById('theme-toggle-light');
            this.darkThemeBtn = document.getElementById('theme-toggle-dark');

            if (this.lightThemeBtn && this.darkThemeBtn) {
                this.lightThemeBtn.addEventListener('click', () => this.setTheme('light-theme'));
                this.darkThemeBtn.addEventListener('click', () => this.setTheme('dark-theme'));
            }
             this.loadTheme();
        }, 0);
    },

    setTheme(themeName) {
        localStorage.setItem('theme', themeName);
        document.documentElement.className = themeName;
        this.updateButtons(themeName);
    },

    loadTheme() {
        const storedTheme = localStorage.getItem('theme') || 'dark-theme';
        document.documentElement.className = storedTheme;
        this.updateButtons(storedTheme);
    },

    updateButtons(activeTheme) {
        if (!this.lightThemeBtn || !this.darkThemeBtn) return;

        if (activeTheme === 'light-theme') {
            this.lightThemeBtn.classList.add('active');
            this.darkThemeBtn.classList.remove('active');
        } else {
            this.darkThemeBtn.classList.add('active');
            this.lightThemeBtn.classList.remove('active');
        }
    }
};


// =================================
//  CUSTOMIZADOR DE PERFIL
// =================================
const ProfileCustomizer = {
    init() {
        this.applyCustomAccentColor();
    },

    applyCustomAccentColor() {
        const accentColor = sessionStorage.getItem('accentColor');
        
        let styleTag = document.getElementById('custom-accent-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'custom-accent-style';
            document.head.appendChild(styleTag);
        }
        
        if (accentColor) {
            const adjustColor = (color, amount) => {
                return '#' + color.replace(/^#/, '').replace(/../g, c => ('0'+Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).substr(-2));
            };

            const accentHoverColor = adjustColor(accentColor, 30);

            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
            }
            
            const accentRgb = hexToRgb(accentColor);

            styleTag.innerHTML = `
                :root {
                    --user-accent-color: ${accentColor};
                    --user-accent-hover-color: ${accentHoverColor};
                    --user-accent-rgb: ${accentRgb};
                }
            `;
        } else {
            styleTag.innerHTML = '';
        }
    }
};

window.ProfileCustomizer = ProfileCustomizer;


// =================================
//  MUSIC PLAYER
// =================================
const MusicPlayer = {
    isInitialized: false,
    isPlaying: false,
    isPanelOpen: false, 
    isPlaylistVisible: false, 
    currentTrackIndex: 0,
    playlist: [
        { title: "Comfort", artist: "Aventure (Bensound)", src: "https://www.bensound.com/bensound-music/bensound-comfort.mp3", artwork: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" },
        { title: "Orange Clouds", artist: "Aventure (Bensound)", src: "https://www.bensound.com/bensound-music/bensound-orangeclouds.mp3", artwork: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop" },
        { title: "The Sunday", artist: "Melatone (Bensound)", src: "https://www.bensound.com/bensound-music/bensound-thesunday.mp3", artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop" },
        { title: "Creative Minds", artist: "Bensound", src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3", artwork: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop" }
    ],
    isSeeking: false,
    isDragging: false,
    didDrag: false, 
    dragOffsetX: 0,
    dragOffsetY: 0,
    currentVolume: 0.5,

    init(pathPrefix = './') {
        if (!document.getElementById('audio-element') || this.isInitialized) return;
        this.isInitialized = true;

        this.playlist.forEach(track => {
            if (track.src && !track.src.startsWith('http')) track.src = pathPrefix + track.src;
            if (track.artwork && !track.artwork.startsWith('http')) track.artwork = pathPrefix + track.artwork;
        });

        this.cacheDOMElements();
        this.addEventListeners();
        this.loadTrack(this.currentTrackIndex, false);
        this.renderPlaylist();
        this.audio.volume = this.currentVolume;
        if (this.dppVolumeSlider) this.dppVolumeSlider.value = this.currentVolume;
        this.updatePlayerVisibility();
        this.updateVolumeIcon();
    },

    cacheDOMElements() {
        this.audio = document.getElementById('audio-element');
        this.musicPlayerContainer = document.getElementById('music-player-container');
        
        // Player Desktop
        this.playerDraggableIcon = document.getElementById('music-player-draggable-icon');
        this.draggableArtwork = document.getElementById('draggable-artwork');
        this.desktopPlaylistPanel = document.getElementById('desktop-playlist-panel');
        this.dppArtwork = document.getElementById('dpp-artwork');
        this.dppTitle = document.getElementById('dpp-title');
        this.dppArtist = document.getElementById('dpp-artist');
        this.dppPrevBtn = document.getElementById('dpp-prev-btn');
        this.dppPlayPauseBtn = document.getElementById('dpp-play-pause-btn');
        this.dppNextBtn = document.getElementById('dpp-next-btn');
        this.dppPlaylistContainer = document.getElementById('dpp-playlist-container');
        this.dppTogglePlaylistBtn = document.getElementById('dpp-toggle-playlist-btn');
        this.dppPlaylistList = document.getElementById('dpp-playlist-list');
        this.dppMuteBtn = document.getElementById('dpp-mute-btn');
        this.dppVolumeSlider = document.getElementById('dpp-volume-slider');
        this.dragHandle = this.playerDraggableIcon;

        // Player Mobile
        this.playerBarMobile = document.getElementById('music-player-mobile');
        this.mobileArtwork = document.getElementById('mobile-artwork');
        this.mobileTitle = document.getElementById('mobile-title');
        this.mobileArtist = document.getElementById('mobile-artist');
        this.mobilePrevBtn = document.getElementById('mobile-prev-btn');
        this.mobilePlayPauseBtn = document.getElementById('mobile-play-pause-btn');
        this.mobileNextBtn = document.getElementById('mobile-next-btn');
        this.expandPlayerMobileBtn = document.getElementById('expand-player-mobile-btn');
        
        // Fullscreen Player (Mobile)
        this.fullscreenPlayer = document.getElementById('music-player-fullscreen');
        this.fullscreenBg = document.getElementById('fullscreen-bg-blur');
        this.collapsePlayerBtn = document.getElementById('collapse-player-btn');
        this.fullscreenArtwork = document.getElementById('fullscreen-artwork');
        this.fullscreenTitle = document.getElementById('fullscreen-title');
        this.fullscreenArtist = document.getElementById('fullscreen-artist');
        this.fullscreenProgressBar = document.getElementById('fullscreen-progress-bar');
        this.fullscreenCurrentTime = document.getElementById('fullscreen-current-time');
        this.fullscreenTotalDuration = document.getElementById('fullscreen-total-duration');
        this.fullscreenPrevBtn = document.getElementById('fullscreen-prev-btn');
        this.fullscreenPlayPauseBtn = document.getElementById('fullscreen-play-pause-btn');
        this.fullscreenNextBtn = document.getElementById('fullscreen-next-btn');
        this.fullscreenPlaylistBtn = document.getElementById('fullscreen-playlist-btn');
        this.fullscreenPlaylistView = document.getElementById('fullscreen-playlist-view');
        this.fullscreenPlaylistList = document.getElementById('fullscreen-playlist-list');
    },

    addEventListeners() {
        // Play/Pause, Next, Prev
        [this.dppPlayPauseBtn, this.mobilePlayPauseBtn, this.fullscreenPlayPauseBtn].forEach(btn => btn?.addEventListener('click', (e) => { e.stopPropagation(); this.togglePlayPause(); }));
        [this.dppNextBtn, this.mobileNextBtn, this.fullscreenNextBtn].forEach(btn => btn?.addEventListener('click', (e) => { e.stopPropagation(); this.nextTrack(); }));
        [this.dppPrevBtn, this.mobilePrevBtn, this.fullscreenPrevBtn].forEach(btn => btn?.addEventListener('click', (e) => { e.stopPropagation(); this.prevTrack(); }));

        // Progress Bars
        this.fullscreenProgressBar?.addEventListener('input', e => this.seekToTime(e.target.value));
        
        // Volume Controls
        this.dppVolumeSlider?.addEventListener('input', e => this.setVolume(e.target.value));
        this.dppMuteBtn?.addEventListener('click', () => this.toggleMute());


        // Audio Events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => { this.isPlaying = true; this.updatePlayPauseIcons(); });
        this.audio.addEventListener('pause', () => { this.isPlaying = false; this.updatePlayPauseIcons(); });
        this.audio.addEventListener('volumechange', () => this.updateVolumeIcon());

        // Player UI
        this.expandPlayerMobileBtn?.addEventListener('click', (e) => { e.stopPropagation(); this.togglePanel(true); });
        this.collapsePlayerBtn?.addEventListener('click', () => this.togglePanel(false));
        this.fullscreenPlayer?.addEventListener('click', e => { if (e.target === this.fullscreenPlayer) this.togglePanel(false); });
        this.fullscreenPlaylistBtn?.addEventListener('click', () => this.togglePlaylist());
        
        // Desktop Playlist Toggle
        this.dppTogglePlaylistBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDesktopPlaylist();
        });
        
        // Drag-and-Drop for Desktop
        if (this.dragHandle) {
            this.dragHandle.addEventListener('mousedown', this.startDrag.bind(this));
            this.dragHandle.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
        }

        // Window Resize
        window.addEventListener('resize', () => this.updatePlayerVisibility());
    },

    startDrag(e) {
        e.preventDefault();
        this.didDrag = false;
        this.isDragging = true;
        
        const event = e.touches ? e.touches[0] : e;
        const rect = this.playerDraggableIcon.getBoundingClientRect();
        this.dragOffsetX = event.clientX - rect.left;
        this.dragOffsetY = event.clientY - rect.top;

        this.playerDraggableIcon.style.transition = 'none';
        this.desktopPlaylistPanel.style.transition = 'none';
        this.playerDraggableIcon.style.cursor = 'grabbing';

        // Bind move and end events to the document/window
        this.boundDrag = this.drag.bind(this);
        this.boundEndDrag = this.endDrag.bind(this);
        document.addEventListener('mousemove', this.boundDrag);
        document.addEventListener('mouseup', this.boundEndDrag);
        document.addEventListener('touchmove', this.boundDrag, { passive: false });
        document.addEventListener('touchend', this.boundEndDrag);
    },

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        this.didDrag = true;
        
        const event = e.touches ? e.touches[0] : e;
        let newX = event.clientX - this.dragOffsetX;
        let newY = event.clientY - this.dragOffsetY;

        const iconWidth = this.playerDraggableIcon.offsetWidth;
        const iconHeight = this.playerDraggableIcon.offsetHeight;
        newX = Math.max(0, Math.min(newX, window.innerWidth - iconWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - iconHeight));

        this.playerDraggableIcon.style.left = `${newX}px`;
        this.playerDraggableIcon.style.top = `${newY}px`;
        this.playerDraggableIcon.style.right = 'auto';
        this.playerDraggableIcon.style.bottom = 'auto';

        this.positionDesktopPanel();
    },

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        if (!this.didDrag) {
            this.toggleDesktopPanel();
        }
        
        this.playerDraggableIcon.style.transition = '';
        this.desktopPlaylistPanel.style.transition = '';
        this.playerDraggableIcon.style.cursor = 'grab';

        // Unbind move and end events
        document.removeEventListener('mousemove', this.boundDrag);
        document.removeEventListener('mouseup', this.boundEndDrag);
        document.removeEventListener('touchmove', this.boundDrag);
        document.removeEventListener('touchend', this.boundEndDrag);
    },

    updatePlayerVisibility() {
        if (window.innerWidth <= 768) {
            this.playerDraggableIcon.classList.add('hidden');
            this.desktopPlaylistPanel.classList.add('hidden');
            this.playerBarMobile.classList.remove('hidden');
        } else {
            this.playerDraggableIcon.classList.remove('hidden');
            this.playerBarMobile.classList.add('hidden');
        }
    },
    
    positionDesktopPanel() {
        const iconRect = this.playerDraggableIcon.getBoundingClientRect();
        const panel = this.desktopPlaylistPanel;
        if (!panel) return;

        panel.style.top = 'auto';
        panel.style.bottom = 'auto';
        panel.style.left = 'auto';
        panel.style.right = 'auto';

        if (iconRect.top + (iconRect.height / 2) > window.innerHeight / 2) {
            panel.style.bottom = `${window.innerHeight - iconRect.top + 10}px`;
        } else {
            panel.style.top = `${iconRect.bottom + 10}px`;
        }

        if (iconRect.left + (iconRect.width / 2) > window.innerWidth / 2) {
            panel.style.right = `${window.innerWidth - iconRect.right}px`;
        } else {
            panel.style.left = `${iconRect.left}px`;
        }
    },

    toggleDesktopPanel(forceState) {
        const shouldBeVisible = forceState !== undefined ? forceState : this.desktopPlaylistPanel.classList.contains('hidden');
        if (shouldBeVisible) {
            this.positionDesktopPanel();
        }
        this.desktopPlaylistPanel.classList.toggle('hidden', !shouldBeVisible);
    },

    toggleDesktopPlaylist() {
        this.dppPlaylistContainer?.classList.toggle('playlist-collapsed');
    },

    togglePanel(open) { // For mobile fullscreen
        this.isPanelOpen = open;
        this.fullscreenPlayer.classList.toggle('hidden', !open);
        if(!open) {
            this.isPlaylistVisible = false;
            if(this.fullscreenPlaylistView) this.fullscreenPlaylistView.classList.remove('visible');
        }
    },

    togglePlaylist() { // For mobile fullscreen
        this.isPlaylistVisible = !this.isPlaylistVisible;
        if(this.fullscreenPlaylistView) this.fullscreenPlaylistView.classList.toggle('visible', this.isPlaylistVisible);
    },

    togglePlayPause() {
        if (this.audio.src && this.audio.src !== window.location.href) {
            this.audio.paused ? this.audio.play() : this.audio.pause();
        } else {
            this.loadTrack(0, true);
        }
    },

    updatePlayPauseIcons() {
        const iconClass = this.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        if (this.dppPlayPauseBtn) this.dppPlayPauseBtn.querySelector('i').className = iconClass;
        if (this.mobilePlayPauseBtn) this.mobilePlayPauseBtn.querySelector('i').className = iconClass;
        if (this.fullscreenPlayPauseBtn) this.fullscreenPlayPauseBtn.querySelector('i').className = iconClass;
    },

    loadTrack(index, shouldPlay = true) {
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        this.audio.src = track.src;
        this.updateAllUI(track);
        if (shouldPlay) {
            this.audio.play().catch(e => console.error("Playback failed", e));
        }
    },

    updateAllUI(track) {
        // Desktop
        if (this.draggableArtwork) this.draggableArtwork.src = track.artwork;
        if (this.dppArtwork) this.dppArtwork.src = track.artwork;
        if (this.dppTitle) this.dppTitle.textContent = track.title;
        if (this.dppArtist) this.dppArtist.textContent = track.artist;
        
        // Mobile Bar
        if (this.mobileArtwork) this.mobileArtwork.src = track.artwork;
        if (this.mobileTitle) this.mobileTitle.textContent = track.title;
        if (this.mobileArtist) this.mobileArtist.textContent = track.artist;

        // Fullscreen
        if (this.fullscreenArtwork) this.fullscreenArtwork.src = track.artwork;
        if (this.fullscreenTitle) this.fullscreenTitle.textContent = track.title;
        if (this.fullscreenArtist) this.fullscreenArtist.textContent = track.artist;
        if (this.fullscreenBg) this.fullscreenBg.style.backgroundImage = `url(${track.artwork})`;

        this.updatePlaylistUI();
    },

    nextTrack() {
        const newIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(newIndex, this.isPlaying);
    },

    prevTrack() {
        const newIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(newIndex, this.isPlaying);
    },

    seekToTime(value) {
        if(this.audio.duration) {
            this.audio.currentTime = value;
        }
    },

    setVolume(value) {
        this.audio.volume = value;
        this.currentVolume = value;
        if (value > 0) {
            this.audio.muted = false;
        }
    },

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        if (!this.audio.muted) {
            if (this.audio.volume === 0) {
                this.setVolume(this.currentVolume > 0 ? this.currentVolume : 0.5);
                if (this.dppVolumeSlider) this.dppVolumeSlider.value = this.audio.volume;
            }
        }
    },

    updateVolumeIcon() {
        const icon = this.dppMuteBtn?.querySelector('i');
        if (!icon) return;
        if (this.audio.muted || this.audio.volume === 0) {
            icon.className = 'fa-solid fa-volume-xmark';
        } else if (this.audio.volume < 0.5) {
            icon.className = 'fa-solid fa-volume-low';
        } else {
            icon.className = 'fa-solid fa-volume-high';
        }
    },

    updateProgress() {
        if (this.audio.duration && !this.isSeeking) {
            if(this.fullscreenProgressBar) this.fullscreenProgressBar.value = this.audio.currentTime;
        }
        if(this.fullscreenCurrentTime) this.fullscreenCurrentTime.textContent = this.formatTime(this.audio.currentTime);
    },

    updateDuration() {
        if (this.audio.duration) {
            if(this.fullscreenTotalDuration) this.fullscreenTotalDuration.textContent = this.formatTime(this.audio.duration);
            if(this.fullscreenProgressBar) this.fullscreenProgressBar.max = this.audio.duration;
        }
    },
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    },

    renderPlaylist() {
        [this.dppPlaylistList, this.fullscreenPlaylistList].forEach(list => {
            if (!list) return;
            list.innerHTML = '';
            this.playlist.forEach((track, index) => {
                const li = document.createElement('li');
                li.dataset.index = index;
                li.innerHTML = `<span>${track.title}</span><small>${track.artist}</small>`;
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadTrack(index);
                    if (this.fullscreenPlaylistView) this.fullscreenPlaylistView.classList.remove('visible');
                });
                list.appendChild(li);
            });
        });
        this.updatePlaylistUI();
    },

    updatePlaylistUI() {
        [this.dppPlaylistList, this.fullscreenPlaylistList].forEach(list => {
            if (!list) return;
            list.querySelectorAll('li').forEach(li => {
                li.classList.toggle('playing', parseInt(li.dataset.index) === this.currentTrackIndex);
            });
        });
    }
};

window.MusicPlayer = MusicPlayer;

// =================================
//  NOVO: GERENCIADOR DE EVENTOS DINÂMICOS
// =================================
const EventManager = {
    eventInterval: null,
    simulatedEvents: [
        {
            type: 'live_event',
            user: 'Carlos Souza',
            avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg',
            image: 'https://cdn.akamai.steamstatic.com/steam/apps/2778580/capsule_616x353.jpg?t=1708533808',
            title: 'AO VIVO: Zerando o novo Elden Ring!',
            message: 'iniciou uma transmissão: Zerando o novo Elden Ring!',
            actionBtn: { text: 'Assistir', class: 'btn-primary', action: 'view-profile' }
        },
        {
            type: 'live_event',
            community: 'Devs & Café',
            avatar: 'https://i.pinimg.com/736x/e3/19/36/e31936c2ffddedc3123b0ae87e916cb4.jpg',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
            title: 'AO VIVO: Q&A com a moderação!',
            message: 'está ao vivo: Q&A com a moderação!',
            actionBtn: { text: 'Participar', class: 'btn-primary', action: 'view-community' }
        }
    ],

    init() {
        // Inicia o gerador de eventos após um tempo inicial para não sobrecarregar o carregamento
        setTimeout(() => {
            this.startEventGenerator();
        }, 15000); // Inicia após 15 segundos
    },

    startEventGenerator() {
        this.eventInterval = setInterval(() => {
            this.triggerRandomEvent();
        }, 30000); // Gera um novo evento a cada 30 segundos
    },

    triggerRandomEvent() {
        const eventData = this.simulatedEvents[Math.floor(Math.random() * this.simulatedEvents.length)];
        
        // 1. Enviar notificação
        if (window.Notifications) {
            const notificationData = {
                type: eventData.type,
                user: eventData.user || eventData.community,
                avatar: eventData.avatar,
                message: eventData.message,
                actionBtn: eventData.actionBtn
            };
            window.Notifications.addNotification(notificationData);
        }

        // 2. Adicionar sinal "AO VIVO" no Radar Cósmico (se a página estiver ativa)
        if (window.Explore && window.location.pathname.includes('search.html')) {
             const signalData = {
                type: 'live_event',
                user: eventData.user,
                name: eventData.community, // Para o data-searchable-text
                avatar: eventData.avatar,
                image: eventData.image,
                title: eventData.title,
                isLive: true
            };
            window.Explore.addLiveEventSignal(signalData);
        }
    }
};
