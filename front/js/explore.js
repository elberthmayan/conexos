// =================================
//  MÓDULO DE LÓGICA DO RADAR CÓSMICO (REMAKE DA PÁGINA EXPLORAR)
// =================================
export const Explore = {
    // --- DADOS SIMULADOS ---
    popularSignals: [
        { 
            type: 'post', 
            user: 'Ana Livia', 
            avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', 
            image: 'https://images.unsplash.com/photo-1672719232844-3112a44f0c84?q=80&w=800&auto=format&fit=crop', 
            title: 'Finalmente derrotei o último chefe!' 
        },
        { 
            type: 'comunidade', 
            name: 'Retrô Gaming', 
            avatar: 'https://i.pinimg.com/736x/b5/34/4d/b5344d2b278a5b9a41a45add431e6e39.jpg',
            image: 'https://datalockperu.com/wp-content/uploads/2023/09/Juegos-Retro-en-Kodi-con-un-Addon-Gratuito-Instalacion-de-IAGL.jpg', 
            title: 'Junte-se à nostalgia dos clássicos.' 
        },
        { 
            type: 'post', 
            user: 'Marcos Vale', 
            avatar: 'https://i.pinimg.com/736x/0f/1f/6b/0f1f6bcc56cfa1481fa9c07280cc0717.jpg',
            image: 'https://i.pinimg.com/1200x/92/74/97/9274979699406ca15477a1c299494c13.jpg', 
            title: 'Explorando novos mundos em VR.' 
        },
        { 
            type: 'post', 
            user: 'Carlos Souza', 
            avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg', 
            image: 'https://gameluster.com/wp-content/uploads/2023/05/vg.jpg', 
            title: 'Meu setup finalmente está completo!' 
        },
    ],
    risingCommunities: [
        { id: 2, name: 'Montanhismo BR', description: 'Compartilhe trilhas, dicas e aventuras nas alturas.', banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop', avatar: 'https://i.pinimg.com/736x/1a/07/8c/1a078c1814d2b317ee87f980319988c8.jpg' },
        { id: 3, name: 'Cine-Loucos', description: 'Debates, reviews e teorias sobre a sétima arte.', banner: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?q=80&w=800&auto=format&fit=crop', avatar: 'https://i.pinimg.com/736x/88/c2/5c/88c25cfe14f8e7209ac2941dd7bd440.jpg' },
        { id: 4, name: 'Devs & Café', description: 'Para quem ama código, cafeína e boas conversas.', banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', avatar: 'https://i.pinimg.com/736x/e3/19/36/e31936c2ffddedc3123b0ae87e916cb4.jpg' },
    ],
    newExplorers: [
        { id: 'ana', name: 'Ana Livia', bio: 'Desenvolvedora Web | UI/UX Designer', avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', isFollowing: false },
        { id: 'marcos', name: 'Marcos Vale', bio: 'Engenheiro de Software | Entusiasta de IA', avatar: 'https://i.pinimg.com/736x/0f/1f/6b/0f1f6bcc56cfa1481fa9c07280cc0717.jpg', isFollowing: true },
        { id: 'carlos', name: 'Carlos Souza', bio: 'Criador de Conteúdo | Gamer', avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg', isFollowing: false },
        { id: 'juliana', name: 'Juliana Reis', bio: 'Fotógrafa | Viajante', avatar: 'https://i.pinimg.com/736x/24/91/a6/2491a6aad04c52f42af5b2d100f4efc2.jpg', isFollowing: false }
    ],

    init() {
        if (!document.querySelector('.content-radar')) return;

        this.cacheDOMElements();
        this.loadFollowStatus();
        this.addEventListeners();
        this.renderAll();
    },
    
    cacheDOMElements() {
        this.radarSearchInput = document.getElementById('radar-search-input');
        this.popularSignalsCarousel = document.getElementById('popular-signals-carousel');
        this.risingCommunitiesGrid = document.getElementById('rising-communities-grid');
        this.newExplorersGrid = document.getElementById('new-explorers-grid');
    },

    addEventListeners() {
        if (this.radarSearchInput) {
            this.radarSearchInput.addEventListener('input', (e) => this.filterContent(e.target.value));
        }

        if (this.newExplorersGrid) {
            this.newExplorersGrid.addEventListener('click', (e) => {
                const followBtn = e.target.closest('.follow-btn');
                if (followBtn) {
                    this.toggleFollow(followBtn.dataset.userId);
                }
            });
        }
    },

    renderAll() {
        this.renderPopularSignals();
        this.renderRisingCommunities();
        this.renderNewExplorers();
    },

    // --- NOVO: Adiciona um evento ao vivo no topo do carrossel ---
    addLiveEventSignal(eventData) {
        // Remove eventos ao vivo anteriores para não poluir
        this.popularSignals = this.popularSignals.filter(signal => !signal.isLive);
        
        this.popularSignals.unshift(eventData); // Adiciona no início
        this.renderPopularSignals();
    },

    // --- Renderização dos Sinais Populares ---
    renderPopularSignals() {
        this.popularSignalsCarousel.innerHTML = '';
        this.popularSignals.forEach(signal => {
            const cardHTML = this.createSignalCard(signal);
            this.popularSignalsCarousel.insertAdjacentHTML('beforeend', cardHTML);
        });
    },

    createSignalCard(signal) {
        const isPost = signal.type === 'post';
        const isLive = signal.isLive || false;
        let typeLabel = isPost ? 'Post em Destaque' : 'Comunidade';
        if (isLive) typeLabel = 'Transmissão ao Vivo';

        const userHTML = (isPost || (isLive && signal.user))
            ? `<div class="signal-card-user"><img src="${signal.avatar}" alt="Avatar de ${signal.user}"><span>${signal.user}</span></div>`
            : '';
        
        const liveClass = isLive ? 'live' : '';

        return `
            <div class="signal-card ${liveClass}" data-searchable-text="${signal.title} ${isPost ? signal.user : signal.name}">
                <img src="${signal.image}" alt="${signal.title}" class="signal-card-bg">
                <div class="signal-card-overlay">
                    <span class="signal-card-type">${typeLabel}</span>
                    <h3>${signal.title}</h3>
                    ${userHTML}
                </div>
            </div>`;
    },

    // --- Renderização das Comunidades ---
    renderRisingCommunities() {
        this.risingCommunitiesGrid.innerHTML = '';
        this.risingCommunities.forEach(community => {
            const cardHTML = this.createCommunityCard(community);
            this.risingCommunitiesGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    },

    createCommunityCard(community) {
        // Estilo similar ao da página de comunidades para consistência
        return `
             <div class="community-card" data-searchable-text="${community.name} ${community.description}">
                <div class="card-banner" style="background-image: url('${community.banner}');"></div>
                <div class="card-info">
                    <img src="${community.avatar}" alt="Avatar da Comunidade" class="card-avatar">
                    <h3>${community.name}</h3>
                    <p>${community.description}</p>
                </div>
            </div>
        `;
    },

    // --- Renderização dos Exploradores ---
    renderNewExplorers() {
        this.newExplorersGrid.innerHTML = '';
        this.newExplorers.forEach(user => {
            const cardHTML = this.createUserCard(user);
            this.newExplorersGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    },
    
    createUserCard(user) {
        const buttonClass = user.isFollowing ? 'btn-secondary joined' : 'btn-primary';
        const buttonText = user.isFollowing ? 'Seguindo' : 'Seguir';
        return `
            <div class="user-card" data-searchable-text="${user.name} ${user.bio}">
                <img src="${user.avatar}" alt="Avatar de ${user.name}">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>${user.bio}</p>
                </div>
                <button class="${buttonClass} follow-btn" data-user-id="${user.id}">${buttonText}</button>
            </div>`;
    },

    // --- Lógica de Seguir (Reutilizada) ---
    loadFollowStatus() {
        const savedFollowStatus = JSON.parse(sessionStorage.getItem('followedUsers')) || {};
        this.newExplorers.forEach(user => {
            if (savedFollowStatus[user.id] !== undefined) {
                user.isFollowing = savedFollowStatus[user.id];
            }
        });
    },
    saveFollowStatus() {
        const followStatusToSave = {};
        this.newExplorers.forEach(user => {
            followStatusToSave[user.id] = user.isFollowing;
        });
        sessionStorage.setItem('followedUsers', JSON.stringify(followStatusToSave));
    },
    toggleFollow(userId) {
        const user = this.newExplorers.find(u => u.id === userId);
        if (user) {
            user.isFollowing = !user.isFollowing;
            this.saveFollowStatus();
            this.renderNewExplorers(); // Re-renderiza apenas a seção de exploradores
        }
    },

    // --- Lógica de Filtragem ---
    filterContent(query) {
        const lowerCaseQuery = query.toLowerCase();
        
        document.querySelectorAll('[data-searchable-text]').forEach(item => {
            const textContent = item.dataset.searchableText.toLowerCase();
            const isVisible = textContent.includes(lowerCaseQuery);
            item.classList.toggle('hidden-by-search', !isVisible);
        });
    }
};
