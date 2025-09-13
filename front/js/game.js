// =================================
//  MÓDULO DE LÓGICA DA PÁGINA DE JOGOS (COM MISSÕES E MOEDAS)
// =================================
export const Game = {
    data: {
        storeGames: [
             { 
                id: 'store1', 
                title: 'Grand Theft Auto VI', 
                description: 'Explore o estado de Leonida, lar das ruas encharcadas de neon de Vice City...', 
                image: 'https://cdn.mos.cms.futurecdn.net/25ttg5Qp7Mcr5sSMyGfS4A-970-80.jpg.webp',
                price: 'R$ 349,90', 
                isFree: false 
            },
            { 
                id: 'store2', 
                title: 'Elden Ring: Shadow of the Erdtree', 
                description: 'Viaje para a Terra das Sombras e explore um novo capítulo da obra-prima da FromSoftware.', 
                image: 'https://cdn.akamai.steamstatic.com/steam/apps/2778580/capsule_616x353.jpg?t=1708533808',
                price: 'R$ 199,90', 
                isFree: false 
            },
            { 
                id: 'store3', 
                title: 'Hades II', 
                description: 'Lute além do Submundo usando magia sombria para desafiar o Titã do Tempo.',
                image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/capsule_616x353.jpg?t=1715022933',
                price: 'R$ 88,99', 
                isFree: false
            },
            { 
                id: 'store4', 
                title: 'Counter-Strike 2', 
                description: 'O próximo capítulo de um dos maiores jogos de FPS competitivos de todos os tempos.',
                image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg?t=1695155293',
                price: 'Gratuito', 
                isFree: true
            },
        ],
        news: [
            { 
                id: 'news1', 
                title: 'Trailer de GTA 6 Quebra a Internet e Confirma Lançamento para 2025', 
                snippet: 'A Rockstar Games finalmente revelou o primeiro trailer de Grand Theft Auto VI...', 
                image: 'https://cdn.mos.cms.futurecdn.net/25ttg5Qp7Mcr5sSMyGfS4A-970-80.jpg.webp',
                source: 'IGN Brasil',
                publishedAt: '05 de Dez, 2023',
                url: 'https://br.ign.com/gta-6/117290/news/gta-6-assista-ao-primeiro-trailer-oficial'
            },
            { 
                id: 'news2', 
                title: 'Elden Ring: Shadow of the Erdtree Promete Ser a Maior Expansão da FromSoftware', 
                snippet: 'A tão aguardada DLC de Elden Ring, Shadow of the Erdtree, ganhou data de lançamento...', 
                image: 'https://cdn.akamai.steamstatic.com/steam/apps/2778580/capsule_616x353.jpg?t=1708533808',
                source: 'The Enemy',
                publishedAt: '21 de Fev, 2024',
                url: 'https://www.theenemy.com.br/elden-ring/elden-ring-shadow-of-the-erdtree-ganha-trailer-e-data-de-lancamento'
            },
            { 
                id: 'news3', 
                title: 'Hades II Chega de Surpresa em Acesso Antecipado na Steam', 
                snippet: 'A Supergiant Games surpreendeu a todos lançando Hades II em Acesso Antecipado...',
                image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/capsule_616x353.jpg?t=1715022933',
                source: 'The Verge',
                publishedAt: '06 de Mai, 2024',
                url: 'https://www.theverge.com/2024/5/6/24150220/hades-2-early-access-release-steam-epic-games-store'
            },
        ],
        onlineGames: [
            { id: 'snake-game', title: 'Cobra Retrô', description: 'O clássico atemporal. Cresça e evite as paredes!', image: 'https://placehold.co/400x225/22c55e/000000?text=COBRA', gameUrl: '../Jogos/cobra.html' },
            { id: 'rabbit-runner', title: 'Rabbit Runner', description: 'Corra, pule e desvie neste corredor infinito 3D.', image: 'https://placehold.co/400x225/ef4444/ffffff?text=COELHO', gameUrl: '../Jogos/coelho..html' },
            { id: 'toast-catcher', title: 'Pega Torrada', description: 'Agilidade é tudo para pegar as torradas voadoras!', image: 'https://placehold.co/400x225/f59e0b/000000?text=PÃO', gameUrl: '../Jogos/pao..html' },
            { id: 'pong', title: 'Pong Clássico', description: 'O lendário jogo de arcade que deu início a tudo.', image: 'https://placehold.co/400x225/3b82f6/ffffff?text=PONG', gameUrl: '../Jogos/pong.html' },
        ],
        missions: [
            { id: 'mission1', icon: 'fa-gamepad', title: 'Jogue um Jogo Casual', description: 'Divirta-se em qualquer jogo da seção casual.', reward: 50, completed: false, claimed: false },
            { id: 'mission2', icon: 'fa-newspaper', title: 'Mantenha-se Informado', description: 'Leia qualquer artigo da seção de notícias.', reward: 25, completed: false, claimed: false },
            { id: 'mission3', icon: 'fa-trophy', title: 'Mestre da Cobrinha', description: 'Marque 10 pontos no Cobra Retrô.', reward: 100, completed: false, claimed: false }
        ]
    },
    musicWasPlaying: false,
    ownedGames: [],
    coinBalance: 0,

    init() {
        if (!document.querySelector('.content-game')) return;
        this.cacheDOMElements();
        this.loadGameState();
        this.addEventListeners();
        this.renderAllContent();
    },

    cacheDOMElements() {
        this.storeGrid = document.getElementById('store-grid');
        this.newsGrid = document.getElementById('news-grid');
        this.onlineGamesGrid = document.getElementById('online-games-grid');
        this.missionsGrid = document.getElementById('missions-grid');
        this.coinBalanceAmount = document.getElementById('coin-balance-amount');
        // Modal de Jogo
        this.gamePlayModal = document.getElementById('game-play-modal');
        this.gameModalTitle = document.getElementById('game-modal-title');
        this.gameIframe = document.getElementById('game-iframe');
        // Modal de Notícias
        this.newsReaderModal = document.getElementById('news-reader-modal');
        this.newsModalImage = document.getElementById('news-modal-image');
        this.newsModalTitle = document.getElementById('news-modal-title');
        this.newsModalSource = document.getElementById('news-modal-source');
        this.newsModalDate = document.getElementById('news-modal-date');
        this.newsModalBody = document.getElementById('news-modal-body');
        // Toast
        this.toastMessage = document.getElementById('toast-message');
    },

    addEventListeners() {
        const mainContent = document.querySelector('.content-game');
        if (!mainContent) return;

        mainContent.addEventListener('click', (e) => {
            const acquireBtn = e.target.closest('.acquire-btn');
            const newsCard = e.target.closest('.news-card-clickable');
            const playBtn = e.target.closest('.play-online-game-btn');
            const claimBtn = e.target.closest('.claim-mission-btn');

            if (acquireBtn && !acquireBtn.disabled) this.handleAcquireClick(acquireBtn.dataset.gameId);
            if (newsCard) this.openNewsModal(newsCard.dataset.newsId);
            if (playBtn) this.openGameModal(playBtn.dataset.gameId);
            if (claimBtn) this.claimMissionReward(claimBtn.dataset.missionId);
        });

        document.body.addEventListener('click', (e) => {
            const closeModalBtn = e.target.closest('.close-modal-btn');
            
            if (closeModalBtn) {
                const modal = closeModalBtn.closest('.modal-overlay');
                if (!modal) return;
                if (modal.id === 'game-play-modal') this.closeGameModal();
                if (modal.id === 'news-reader-modal') this.closeNewsModal();
            }
            if (e.target.classList.contains('modal-overlay')) {
                 if (e.target.id === 'game-play-modal') this.closeGameModal();
                 if (e.target.id === 'news-reader-modal') this.closeNewsModal();
            }
        });
    },

    handleAcquireClick(gameId) {
        const game = this.data.storeGames.find(g => g.id === gameId);
        if (!game) return;

        if (game.isFree) {
            this.ownedGames.push(gameId);
            this.saveGameState();
            this.showToast(`${game.title} foi adicionado à sua biblioteca!`);
            this.renderStore(); // Re-renderiza para atualizar o botão
        } else {
            // Redireciona para a página de pagamento com o ID do jogo
            window.location.href = `pagamento.html?gameId=${gameId}`;
        }
    },
    
    loadGameState() {
        const savedGames = sessionStorage.getItem('ownedGames');
        this.ownedGames = savedGames ? JSON.parse(savedGames) : [];

        const savedCoins = sessionStorage.getItem('conexoCoins');
        this.coinBalance = savedCoins ? parseInt(savedCoins, 10) : 0;

        const savedMissions = sessionStorage.getItem('conexoMissions');
        if (savedMissions) {
            this.data.missions = JSON.parse(savedMissions);
        }
    },

    saveGameState() {
        sessionStorage.setItem('ownedGames', JSON.stringify(this.ownedGames));
        sessionStorage.setItem('conexoCoins', this.coinBalance);
        sessionStorage.setItem('conexoMissions', JSON.stringify(this.data.missions));
    },

    renderAllContent() {
        this.renderStore();
        this.renderNews();
        this.renderOnlineGames();
        this.renderMissions();
        this.updateCoinBalance();
    },

    renderMissions() {
        if (!this.missionsGrid) return;
        this.missionsGrid.innerHTML = '';
        this.data.missions.forEach(mission => {
            const buttonHTML = mission.completed
                ? `<button class="btn-primary claim-mission-btn ${mission.claimed ? 'claimed' : ''}" data-mission-id="${mission.id}" ${mission.claimed ? 'disabled' : ''}>${mission.claimed ? 'Resgatado' : 'Resgatar'}</button>`
                : '';
            
            const card = `
                <div class="mission-card ${mission.completed ? 'completed' : ''}">
                    <div class="mission-info">
                        <i class="fa-solid ${mission.icon}"></i>
                        <div class="mission-details">
                            <h4>${mission.title}</h4>
                            <p>${mission.description}</p>
                        </div>
                    </div>
                    <div class="mission-reward">
                        <span class="reward-amount">+${mission.reward} <i class="fa-solid fa-coins"></i></span>
                        ${buttonHTML}
                    </div>
                </div>
            `;
            this.missionsGrid.insertAdjacentHTML('beforeend', card);
        });
    },

    updateCoinBalance() {
        if (!this.coinBalanceAmount) return;
        this.coinBalanceAmount.textContent = this.coinBalance;
    },

    completeMission(missionId) {
        const mission = this.data.missions.find(m => m.id === missionId);
        if (mission && !mission.completed) {
            mission.completed = true;
            this.saveGameState();
            this.renderMissions();
            this.showToast(`Missão Concluída: ${mission.title}!`);
        }
    },

    claimMissionReward(missionId) {
        const mission = this.data.missions.find(m => m.id === missionId);
        if (mission && mission.completed && !mission.claimed) {
            mission.claimed = true;
            this.coinBalance += mission.reward;
            this.saveGameState();
            this.renderMissions();
            this.updateCoinBalance();
            this.showToast(`+${mission.reward} moedas coletadas!`);
        }
    },

    renderStore() {
        if (!this.storeGrid) return;
        this.storeGrid.innerHTML = '';
        this.data.storeGames.forEach(item => {
            const isOwned = this.ownedGames.includes(item.id);
            const priceClass = item.isFree ? 'free' : '';
            const buttonText = isOwned ? 'Na Biblioteca' : (item.isFree ? 'Resgatar' : '<i class="fa-solid fa-cart-plus"></i> Adquirir');
            const buttonClass = isOwned ? 'in-library' : '';
            const buttonDisabled = isOwned ? 'disabled' : '';

            const card = `
                <div class="game-card store-item-card">
                    <div class="card-image-container"><img src="${item.image}" alt="${item.title}"></div>
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="store-item-footer">
                            <span class="store-item-price ${priceClass}">${item.price}</span>
                            <button class="btn-primary acquire-btn ${buttonClass}" data-game-id="${item.id}" ${buttonDisabled}>
                                ${buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.storeGrid.insertAdjacentHTML('beforeend', card);
        });
    },

    renderNews() {
        if (!this.newsGrid) return;
        this.newsGrid.innerHTML = '';
        this.data.news.forEach(item => {
            const card = `
                <div class="game-card news-card news-card-clickable" data-news-id="${item.id}">
                    <div class="card-image-container"><img src="${item.image}" alt="${item.title}"></div>
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p>${item.snippet.substring(0, 150)}...</p>
                        <div class="news-card-footer">
                           <span class="news-card-source"><strong>Fonte:</strong> ${item.source}</span>
                           <button class="btn-secondary" style="width: auto; padding: 8px 16px;">Ler Mais</button>
                        </div>
                    </div>
                </div>
            `;
            this.newsGrid.insertAdjacentHTML('beforeend', card);
        });
    },
    
    renderOnlineGames() {
        if (!this.onlineGamesGrid) return;
        this.onlineGamesGrid.innerHTML = '';
        this.data.onlineGames.forEach(item => {
            const card = `
                 <div class="game-card online-game-card">
                    <div class="card-image-container"><img src="${item.image}" alt="${item.title}"></div>
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <button class="btn-primary play-online-game-btn" data-game-id="${item.id}">
                            <i class="fa-solid fa-play"></i> Jogar Agora
                        </button>
                    </div>
                </div>
            `;
             this.onlineGamesGrid.insertAdjacentHTML('beforeend', card);
        });
    },

    openGameModal(gameId) {
        const game = this.data.onlineGames.find(g => g.id === gameId);
        if (game) {
            this.completeMission('mission1'); // Completa a missão de jogar
            if(game.id === 'snake-game') {
                // Lógica futura para checar a pontuação do jogo da cobra
            }

            if (window.MusicPlayer && window.MusicPlayer.isPlaying) {
                this.musicWasPlaying = true;
                window.MusicPlayer.togglePlayPause();
            } else {
                this.musicWasPlaying = false;
            }

            this.gameModalTitle.textContent = game.title;
            this.gameIframe.src = game.gameUrl;
            this.gamePlayModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    },

    closeGameModal() {
        this.gamePlayModal.classList.add('hidden');
        this.gameIframe.src = ''; 
        document.body.style.overflow = '';

        if (this.musicWasPlaying && window.MusicPlayer && !window.MusicPlayer.isPlaying) {
            window.MusicPlayer.togglePlayPause();
        }
        this.musicWasPlaying = false;
    },

    openNewsModal(newsId) {
        const news = this.data.news.find(n => n.id === newsId);
        if (news) {
            this.completeMission('mission2'); // Completa a missão de ler notícia

            this.newsModalImage.src = news.image;
            this.newsModalTitle.textContent = news.title;
            this.newsModalSource.textContent = news.source;
            this.newsModalDate.textContent = news.publishedAt;
            this.newsModalBody.textContent = news.snippet;
            this.newsReaderModal.classList.remove('hidden');
        }
    },

    closeNewsModal() {
        this.newsReaderModal.classList.add('hidden');
    },

    showToast(message) {
        this.toastMessage.textContent = message;
        this.toastMessage.classList.add('show');
        setTimeout(() => {
            this.toastMessage.classList.remove('show');
        }, 3000);
    }
};