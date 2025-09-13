// =================================
//  MÓDULO DE FUNCIONALIDADE DO FEED (REMAKE JORNADAS V2)
// =================================
export const Feed = {
    currentUser: {
        name: 'Você',
        avatar: 'https://i.pinimg.com/736x/6a/bc/d9/6abcd9f34ebc8fd7dce5b3edf69a0126.jpg'
    },
    journeys: [],
    stories: [],
    stagedLogFile: null,
    stagedJourneyFile: null,
    editingJourneyId: null,
    // NOVO: Para o visualizador de stories
    stagedStoryFile: null,
    currentStoryUserIndex: 0,
    storyTimer: null,


    init() {
        if (!document.querySelector('.content-feed')) return;
        this.cacheDOMElements();
        this.loadData();
        this.addEventListeners();
        this.renderAll();
    },

    cacheDOMElements() {
        this.feedContainer = document.getElementById('feed-container');
        this.storiesSection = document.querySelector('.stories-section');

        // Modal de Iniciar Jornada
        this.startJourneyModal = document.getElementById('start-journey-modal');
        this.openStartJourneyModalBtn = document.getElementById('open-start-journey-modal-btn');
        this.startJourneyForm = document.getElementById('start-journey-form');
        this.journeyImageUploadInput = document.getElementById('journey-image-input');
        this.journeyImagePreviewContainer = document.getElementById('journey-image-preview-container');

        // Modal de Adicionar Log
        this.addLogModal = document.getElementById('add-log-modal');
        this.addLogForm = document.getElementById('add-log-form');
        this.logTextInput = document.getElementById('log-text-input');
        this.logMediaUploadInput = document.getElementById('log-media-upload-input');
        this.logMediaPreviewContainer = document.getElementById('log-media-preview-container');
        
        // Modal Diário de Bordo
        this.journeyLogbookModal = document.getElementById('journey-logbook-modal');
        this.logbookTitle = document.getElementById('logbook-title');
        this.logbookBodyContent = document.getElementById('logbook-body-content');
        
        // Modal de Adicionar Story
        this.addStoryModal = document.getElementById('add-story-modal');
        this.addStoryForm = document.getElementById('add-story-form');
        this.storyImageInput = document.getElementById('story-image-input');
        this.storyImagePreviewContainer = document.getElementById('story-image-preview-container');

        // Visualizador de Story (CAROUSEL)
        this.storyViewerModal = document.getElementById('story-viewer-modal');
        this.storyProgressBarsContainer = document.getElementById('story-progress-bars-container');
        this.storyViewerAvatar = document.getElementById('story-viewer-avatar');
        this.storyViewerUsername = document.getElementById('story-viewer-username');
        this.storyViewerMedia = document.getElementById('story-viewer-media');
        this.storyPrevBtn = document.getElementById('story-prev-btn');
        this.storyNextBtn = document.getElementById('story-next-btn');
        this.storyPreviewPrev = document.getElementById('story-preview-prev');
        this.storyPreviewNext = document.getElementById('story-preview-next');
    },

    addEventListeners() {
        // Abrir modais
        this.openStartJourneyModalBtn.addEventListener('click', () => this.openStartJourneyModal());

        // Fechar modais
        [this.startJourneyModal, this.addLogModal, this.journeyLogbookModal, this.addStoryModal, this.storyViewerModal].forEach(modal => {
            modal.addEventListener('click', e => this.handleModalClose(e, modal));
        });

        // Submissão dos forms
        this.startJourneyForm.addEventListener('submit', e => this.handleStartJourney(e));
        this.addLogForm.addEventListener('submit', e => this.handleAddLog(e));
        this.addStoryForm.addEventListener('submit', e => this.handlePostStory(e));
        
        // Ações dentro do feed
        this.feedContainer.addEventListener('click', e => {
            const addLogBtn = e.target.closest('.add-log-entry-btn');
            const viewLogbookBtn = e.target.closest('.view-full-journey-btn');
            const journeyCover = e.target.closest('.journey-v2-cover');

            if (addLogBtn) {
                this.editingJourneyId = addLogBtn.dataset.journeyId;
                this.openModal(this.addLogModal);
            }
            if (viewLogbookBtn || journeyCover) {
                const journeyId = (viewLogbookBtn || journeyCover).dataset.journeyId;
                this.openLogbookModal(journeyId);
            }
        });
        
        // Upload de mídia
        this.journeyImageUploadInput.addEventListener('change', e => this.previewJourneyImage(e.target.files[0]));
        this.logMediaUploadInput.addEventListener('change', e => this.previewLogMedia(e.target.files[0]));
        document.getElementById('log-media-btn').addEventListener('click', () => this.logMediaUploadInput.click());
        this.logMediaPreviewContainer.addEventListener('click', e => {
            if (e.target.closest('.remove-media-btn')) this.removePreviewLogMedia();
        });

        // --- EVENT LISTENERS PARA STORIES ---
        this.storiesSection.addEventListener('click', e => {
            const storyCard = e.target.closest('.story-card');
            if (!storyCard) return;

            const user = storyCard.dataset.storyUser;
            if (user === 'add') {
                this.openAddStoryModal();
            } else {
                const userIndex = this.stories.findIndex(s => s.user === user);
                if (userIndex !== -1) {
                    this.openStoryViewer(userIndex);
                }
            }
        });

        this.storyImageInput.addEventListener('change', e => this.previewStoryImage(e.target.files[0]));
        this.storyPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.showPreviousStory(); });
        this.storyNextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.showNextStory(); });
        this.storyPreviewPrev.addEventListener('click', (e) => { e.stopPropagation(); this.showPreviousStory(); });
        this.storyPreviewNext.addEventListener('click', (e) => { e.stopPropagation(); this.showNextStory(); });
    },

    loadData() {
        const journeysData = sessionStorage.getItem('conexo-journeys');
        this.journeys = journeysData ? JSON.parse(journeysData) : [
            { 
                id: 'journey-1', 
                user: 'Ana', 
                avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', 
                title: 'Zerando Elden Ring', 
                goal: 'Derrotar todos os chefes e explorar cada canto das Terras Intermédias.', 
                coverImage: 'https://images.unsplash.com/photo-1672719232844-3112a44f0c84?q=80&w=800&auto=format&fit=crop',
                logEntries: [
                    { id: 'log-1-1', type: 'text', content: { text: 'Finalmente cheguei em Caelid. Que lugar medonho! Mas a exploração continua.' }, time: '2 dias atrás' },
                    { id: 'log-1-2', type: 'image', content: { text: 'DERROTEI O RADAHN! Que batalha épica, uma das melhores que já joguei.', src: 'https://image.api.playstation.com/vulcan/ap/rnd/202108/0410/2ZTf4A03To2n1sVb6kAm9Y2S.jpg' }, time: '1 dia atrás' }
                ]
            },
            { 
                id: 'journey-2', 
                user: 'Carlos', 
                avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg', 
                title: 'Montando meu Setup Gamer', 
                goal: 'Juntar todas as peças e montar o PC dos sonhos para jogar e fazer stream.', 
                coverImage: 'https://images.unsplash.com/photo-1591465328140-2a0b38b2f301?q=80&w=800&auto=format&fit=crop',
                logEntries: [
                     { id: 'log-2-2', type: 'text', content: { text: 'O processador e a placa-mãe chegaram hoje. Falta pouco!' }, time: '1 dia atrás' },
                    { id: 'log-2-1', type: 'image', content: { text: 'A placa de vídeo chegou! Uma RTX 4070. Ansioso para testar o poder dela.', src: 'https://images.unsplash.com/photo-1591465328140-2a0b38b2f301?q=80&w=800&auto=format&fit=crop' }, time: '3 dias atrás' }
                ]
            }
        ];
        
        this.stories = sessionStorage.getItem('conexo-stories') ? JSON.parse(sessionStorage.getItem('conexo-stories')) : [
            { user: 'Ana', avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d9c288e4.jpg', items: [{ type: 'image', src: 'https://i.pinimg.com/1200x/8c/08/47/8c08476cefaf90f3a64408b286857e43.jpg'}] },
            { user: 'Carlos', avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg', items: [{ type: 'image', src: 'https://gameluster.com/wp-content/uploads/2023/05/vg.jpg'}] },
            { user: 'Mariana', avatar: 'https://i.pinimg.com/736x/c1/91/c2/c191c270d09a22bdfae381286de3f15d.jpg', items: [{ type: 'image', src: 'https://images.unsplash.com/photo-1542158399-885435b64234?q=80&w=800&auto=format&fit=crop'}] },
            { user: 'Kleitinho', avatar: 'https://placehold.co/100x100/1e1e1e/ffffff?text=K', items: [{ type: 'image', src: 'https://images.unsplash.com/photo-1581333100576-b73befdc7911?q=80&w=800&auto=format&fit=crop'}] }
        ];
    },

    saveJourneys() {
        sessionStorage.setItem('conexo-journeys', JSON.stringify(this.journeys));
    },

    saveStories() {
        sessionStorage.setItem('conexo-stories', JSON.stringify(this.stories));
    },

    renderAll() {
        this.renderJourneys();
        this.renderStories();
    },

    renderJourneys() {
        this.feedContainer.innerHTML = '';
        if (this.journeys.length === 0) {
            this.feedContainer.innerHTML = `<div class="empty-state">Nenhuma jornada iniciada ainda. Que tal começar a sua?</div>`;
        }
        this.journeys.forEach(journey => {
            const journeyCard = this.createJourneyElement(journey);
            this.feedContainer.insertAdjacentHTML('afterbegin', journeyCard);
        });
    },

    createJourneyElement(journey) {
        const latestLog = journey.logEntries[0]; // O mais recente agora é o primeiro
        let logPreviewHTML = '<p>Nenhum progresso registrado ainda.</p>';
        if(latestLog) {
            logPreviewHTML = `<p>${latestLog.content.text}</p>`;
            if (latestLog.type === 'image' && latestLog.content.src) {
                logPreviewHTML += `<img src="${latestLog.content.src}" alt="Mídia do log">`;
            }
            logPreviewHTML += `<span class="log-time">${latestLog.time}</span>`;
        }
        
        const coverImage = journey.coverImage || 'https://placehold.co/680x250/1e1e1e/3a3b3c?text=Jornada';

        return `
            <div class="journey-card-v2">
                <div class="journey-v2-header">
                    <img src="${journey.avatar}" alt="Avatar de ${journey.user}" class="journey-v2-avatar">
                    <div class="journey-v2-info">
                        <h2>${journey.title}</h2>
                        <span>por ${journey.user}</span>
                    </div>
                </div>
                <img src="${coverImage}" alt="Capa da Jornada" class="journey-v2-cover" data-journey-id="${journey.id}">
                <div class="journey-v2-body">
                    <div class="journey-v2-goal">${journey.goal}</div>
                    <div class="journey-v2-latest-log">
                        ${logPreviewHTML}
                    </div>
                </div>
                <div class="journey-v2-footer">
                    <button class="btn-secondary view-full-journey-btn" data-journey-id="${journey.id}"><i class="fa-solid fa-book"></i> Ver Diário Completo (${journey.logEntries.length})</button>
                    <button class="btn-primary add-log-entry-btn" data-journey-id="${journey.id}"><i class="fa-solid fa-plus"></i> Registrar Progresso</button>
                </div>
            </div>
        `;
    },

    handleStartJourney(event) {
        event.preventDefault();
        const title = document.getElementById('journey-title-input').value.trim();
        const goal = document.getElementById('journey-goal-input').value.trim();
        const file = this.stagedJourneyFile;

        if (!title || !goal) return;

        const newJourney = {
            id: `journey-${Date.now()}`,
            user: this.currentUser.name,
            avatar: this.currentUser.avatar,
            title, goal,
            logEntries: []
        };
        
        const addJourney = (coverImage = null) => {
            if (coverImage) newJourney.coverImage = coverImage;
            this.journeys.push(newJourney);
            this.saveJourneys();
            this.renderJourneys();
            this.closeModal(this.startJourneyModal);
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = e => addJourney(e.target.result);
            reader.readAsDataURL(file);
        } else {
            addJourney();
        }
    },
    
    handleAddLog(event) {
        event.preventDefault();
        const text = this.logTextInput.value.trim();
        const file = this.stagedLogFile;

        if (!text && !file) return;
        const journey = this.journeys.find(j => j.id === this.editingJourneyId);
        if (!journey) return;

        const newLog = {
            id: `log-${journey.id}-${Date.now()}`,
            type: file ? 'image' : 'text',
            content: { text },
            time: 'agora'
        };

        const addLogToJourney = (mediaSrc = null) => {
            if (mediaSrc) newLog.content.src = mediaSrc;
            journey.logEntries.unshift(newLog); // Adiciona no início
            this.saveJourneys();
            this.renderJourneys();
            this.closeModal(this.addLogModal);
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = e => addLogToJourney(e.target.result);
            reader.readAsDataURL(file);
        } else {
            addLogToJourney();
        }
    },
    
    previewJourneyImage(file) {
        if (!file) return;
        this.stagedJourneyFile = file;
        const reader = new FileReader();
        reader.onload = e => {
            this.journeyImagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview da Capa">`;
        };
        reader.readAsDataURL(file);
    },

    previewLogMedia(file) {
        if (!file) return;
        this.stagedLogFile = file;
        const reader = new FileReader();
        reader.onload = e => {
            const previewHTML = `<img src="${e.target.result}" alt="Preview"><button type="button" class="remove-media-btn"><i class="fa-solid fa-times"></i></button>`;
            this.logMediaPreviewContainer.innerHTML = previewHTML;
            this.logMediaPreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    },

    removePreviewLogMedia() {
        this.stagedLogFile = null;
        this.logMediaPreviewContainer.innerHTML = '';
        this.logMediaPreviewContainer.classList.add('hidden');
        this.logMediaUploadInput.value = '';
    },
    
    openStartJourneyModal() {
        this.startJourneyForm.reset();
        this.stagedJourneyFile = null;
        this.journeyImagePreviewContainer.innerHTML = '';
        this.openModal(this.startJourneyModal);
    },
    
    openLogbookModal(journeyId) {
        const journey = this.journeys.find(j => j.id === journeyId);
        if (!journey) return;

        this.logbookTitle.textContent = `Diário de: ${journey.title}`;
        this.logbookBodyContent.innerHTML = '';
        
        if(journey.logEntries.length === 0){
             this.logbookBodyContent.innerHTML = '<p>Nenhum registro nesta jornada ainda.</p>';
        } else {
            journey.logEntries.forEach(log => {
                const logHTML = `
                    <div class="logbook-entry">
                        <span class="log-time">${log.time}</span>
                        <p>${log.content.text}</p>
                        ${log.content.src ? `<img src="${log.content.src}" alt="Mídia do log">` : ''}
                    </div>
                `;
                this.logbookBodyContent.insertAdjacentHTML('beforeend', logHTML);
            });
        }
        
        this.openModal(this.journeyLogbookModal);
    },

    openModal(modal) { modal.classList.remove('hidden'); },
    closeModal(modal) {
        modal.classList.add('hidden');
        if (modal.id === 'add-log-modal') {
             this.addLogForm.reset();
             this.removePreviewLogMedia();
             this.editingJourneyId = null;
        }
        if (modal.id === 'story-viewer-modal') {
            clearTimeout(this.storyTimer);
            const progressBar = this.storyProgressBarsContainer.querySelector('.active .progress-bar-inner');
            if(progressBar) progressBar.style.animation = 'none';
        }
    },
    handleModalClose(event, modal) {
        if (event.target.classList.contains('modal-overlay') || event.target.closest('.close-modal-btn')) {
            this.closeModal(modal);
        }
    },
    
    renderStories() {
        const staticAddCard = this.storiesSection.querySelector('.add-story');
        this.storiesSection.innerHTML = '';
        if (staticAddCard) {
            this.storiesSection.appendChild(staticAddCard);
        }
        this.stories.forEach(story => {
            const storyEl = this.createStoryElement(story);
            this.storiesSection.appendChild(storyEl);
        });
    },
    
    createStoryElement(story) {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.dataset.storyUser = story.user;

        const storyBgSrc = story.items && story.items[0] ? story.items[0].src : 'https://placehold.co/120x170/1e1e1e/3a3b3c?text=Story';
        
        storyCard.innerHTML = `
            <img src="${storyBgSrc}" alt="Story de ${story.user}" class="story-card-bg">
            <div class="story-card-overlay">
                <img src="${story.avatar}" alt="Avatar de ${story.user}" class="story-card-avatar">
                <span class="story-card-user">${story.user}</span>
            </div>`;
        
        return storyCard;
    },

    // --- FUNÇÕES PARA STORIES (CAROUSEL REMAKE) ---
    openAddStoryModal() {
        this.addStoryForm.reset();
        this.stagedStoryFile = null;
        this.storyImagePreviewContainer.innerHTML = `
            <div class="story-image-placeholder">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span>Clique para escolher uma imagem</span>
            </div>`;
        this.openModal(this.addStoryModal);
    },
    
    previewStoryImage(file) {
        if (!file) return;
        this.stagedStoryFile = file;
        const reader = new FileReader();
        reader.onload = e => {
            this.storyImagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização do Story">`;
        };
        reader.readAsDataURL(file);
    },

    handlePostStory(event) {
        event.preventDefault();
        const file = this.stagedStoryFile;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const newStoryItem = { type: 'image', src: e.target.result };
            let userStory = this.stories.find(s => s.user === this.currentUser.name);

            if (userStory) {
                userStory.items.push(newStoryItem);
            } else {
                this.stories.unshift({
                    user: this.currentUser.name,
                    avatar: this.currentUser.avatar,
                    items: [newStoryItem]
                });
            }
            
            this.saveStories();
            this.renderStories();
            this.closeModal(this.addStoryModal);
        };
        reader.readAsDataURL(file);
    },
    
    openStoryViewer(userIndex) {
        clearTimeout(this.storyTimer);
        this.currentStoryUserIndex = userIndex;
        
        const storyData = this.stories[userIndex];
        if (!storyData || !storyData.items.length) return;

        // Simplificado para sempre mostrar o primeiro item do story do usuário
        const storyItem = storyData.items[0];

        // Atualiza o conteúdo principal do story
        this.storyViewerAvatar.src = storyData.avatar;
        this.storyViewerUsername.textContent = storyData.user;
        this.storyViewerMedia.src = storyItem.src;
        
        // Atualiza as previews do carrossel
        const prevIndex = (userIndex - 1 + this.stories.length) % this.stories.length;
        const nextIndex = (userIndex + 1) % this.stories.length;
        this.storyPreviewPrev.querySelector('img').src = this.stories[prevIndex].items[0].src;
        this.storyPreviewNext.querySelector('img').src = this.stories[nextIndex].items[0].src;

        // Configura a barra de progresso
        this.storyProgressBarsContainer.innerHTML = `<div class="story-progress-bar active"><div class="progress-bar-inner"></div></div>`;
        
        this.openModal(this.storyViewerModal);
        
        // Reinicia a animação da barra
        const progressBarInner = this.storyProgressBarsContainer.querySelector('.progress-bar-inner');
        progressBarInner.style.animation = 'none';
        void progressBarInner.offsetWidth; // Força reflow
        progressBarInner.style.animation = '';

        this.storyTimer = setTimeout(() => this.showNextStory(), 5000); // 5 segundos
    },

    showNextStory() {
        const nextIndex = (this.currentStoryUserIndex + 1) % this.stories.length;
        this.openStoryViewer(nextIndex);
    },

    showPreviousStory() {
        const prevIndex = (this.currentStoryUserIndex - 1 + this.stories.length) % this.stories.length;
        this.openStoryViewer(prevIndex);
    },
};