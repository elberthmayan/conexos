export const Chat = {
    activeConversationId: null,
    giphyApiKey: 'cRPAFfmgRPGqxeWQVNowBepFDfqfifPK', // Sua chave da API Giphy
    isRecording: false,
    recordingInterval: null,

    // --- Dados Simulados com Personas para o Bot ---
    conversations: [
        {
            id: 1,
            name: 'Ana',
            avatar: 'https://i.pinimg.com/736x/ad/b3/a9/adb3a95eb2128cd200d4f7c2d/c288e4.jpg',
            status: 'Online',
            lastMessage: 'Jogando um pouco 🎮',
            timestamp: '14:05',
            persona: 'gamer', // Persona para o bot
            messages: [
                { sender: 'other', type: 'text', content: 'E aí! Bora um game mais tarde?', timestamp: '14:05' }
            ]
        },
        {
            id: 2,
            name: 'Carlos',
            avatar: 'https://i.pinimg.com/736x/32/b5/17/32b51754e1496531c11a027c9a185d24.jpg',
            status: 'Não Perturbe',
            lastMessage: 'Focado no código. 👨‍💻',
            timestamp: '13:30',
            persona: 'direto', // Persona para o bot
            messages: [
                 { sender: 'other', type: 'text', content: 'Terminando um projeto aqui. Depois a gente se fala.', timestamp: '13:30' }
            ]
        },
        {
            id: 3,
            name: 'Mariana',
            avatar: 'https://i.pinimg.com/736x/c1/91/c2/c191c270d09a22bdfae381286de3f15d.jpg',
            status: 'Ausente',
            lastMessage: 'Volto logo! 🌙',
            timestamp: '12:15',
            persona: 'amigavel', // Persona para o bot
            messages: [
                { sender: 'other', type: 'text', content: 'Oieee! Vi sua foto nova, amei! ✨', timestamp: '12:15' }
            ]
        },
        {
            id: 4,
            name: 'Kleitinho',
            avatar: 'https://placehold.co/100x100/1e1e1e/ffffff?text=K',
            status: 'Offline',
            lastMessage: 'Dando um rolê por aí.',
            timestamp: 'Ontem',
            persona: 'gamer',
            messages: [
                 { sender: 'other', type: 'text', content: 'Fechou, mano.', timestamp: 'Ontem' }
            ]
        }
    ],

    init() {
        if (!document.getElementById('chat-app-container')) return;
        this.cacheDOMElements();
        this.addEventListeners();
        this.renderConversationsList();
        this.updateSendButtonVisibility();
        this.populateEmojiPicker();
    },

    cacheDOMElements() {
        this.chatAppContainer = document.getElementById('chat-app-container');
        this.conversationsListEl = document.getElementById('conversations-list');
        this.noChatSelectedViewEl = document.getElementById('no-chat-selected-view');
        this.chatWindowHeader = document.getElementById('chat-window-header');
        this.chatWindowAvatar = document.getElementById('chat-window-avatar');
        this.chatWindowName = document.getElementById('chat-window-name');
        this.chatWindowStatus = document.getElementById('chat-window-status');
        this.chatWindowStatusDot = document.getElementById('chat-window-status-dot');
        this.messageArea = document.getElementById('message-area');
        this.chatInputArea = document.getElementById('chat-input-area');
        this.chatInput = document.getElementById('chat-input');
        this.voiceCallBtn = document.getElementById('voice-call-btn');
        this.videoCallBtn = document.getElementById('video-call-btn');
        this.attachmentBtn = document.getElementById('attachment-btn');
        this.attachmentOptions = document.getElementById('attachment-options');
        this.imageSendBtn = document.getElementById('image-send-btn');
        this.audioUploadBtn = document.getElementById('audio-upload-btn');
        this.imageUploadInput = document.getElementById('image-upload-input');
        this.audioUploadInput = document.getElementById('audio-upload-input');
        this.emojiBtn = document.getElementById('emoji-btn');
        this.emojiPicker = document.getElementById('emoji-picker');
        this.emojiPickerModal = document.getElementById('emoji-picker-modal');
        this.gifBtn = document.getElementById('gif-btn');
        this.audioRecordBtn = document.getElementById('audio-record-btn');
        this.sendMessageBtn = document.getElementById('send-message-btn');
        this.gifPickerModal = document.getElementById('gif-picker-modal');
        this.gifSearchInput = document.getElementById('gif-search-input');
        this.gifPickerGrid = document.getElementById('gif-picker-grid');
        this.recordingIndicator = document.getElementById('recording-indicator');
        this.recordingTimer = document.getElementById('recording-timer');
    },

    addEventListeners() {
        this.conversationsListEl.addEventListener('click', (e) => {
            const conversationItem = e.target.closest('.conversation-tab');
            if (conversationItem) this.setActiveConversation(parseInt(conversationItem.dataset.id));
        });

        this.sendMessageBtn.addEventListener('click', () => this.handleSendMessage());
        this.chatInput.addEventListener('input', () => this.updateSendButtonVisibility());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        this.attachmentBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.attachmentOptions.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!this.attachmentBtn.contains(e.target) && !this.attachmentOptions.contains(e.target)) {
                this.attachmentOptions.classList.add('hidden');
            }
        });

        this.imageSendBtn.addEventListener('click', () => this.imageUploadInput.click());
        this.audioUploadBtn.addEventListener('click', () => this.audioUploadInput.click());
        this.imageUploadInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0], 'image'));
        this.audioUploadInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0], 'audio'));

        this.emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openEmojiModal();
        });

        this.emojiPickerModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.closest('.close-modal-btn')) {
                this.emojiPickerModal.classList.add('hidden');
            }
        });
        
        this.gifBtn.addEventListener('click', () => this.openGifModal());
        
        this.audioRecordBtn.addEventListener('mousedown', () => this.startAudioRecording());
        this.audioRecordBtn.addEventListener('mouseup', () => this.stopAudioRecording());
        this.audioRecordBtn.addEventListener('mouseleave', () => this.stopAudioRecording());
        this.audioRecordBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.startAudioRecording(); });
        this.audioRecordBtn.addEventListener('touchend', () => this.stopAudioRecording());

        this.voiceCallBtn.addEventListener('click', () => this.startCall('voice'));
        this.videoCallBtn.addEventListener('click', () => this.startCall('video'));

        this.gifPickerModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.closest('.close-modal-btn')) {
                this.gifPickerModal.classList.add('hidden');
            }
        });
        this.gifSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.searchGifs(e.target.value);
        });
        this.gifPickerGrid.addEventListener('click', (e) => {
            const gif = e.target.closest('.gif-item');
            if (gif) {
                this.addMessageToConversation('me', 'gif', gif.src);
                this.gifPickerModal.classList.add('hidden');
            }
        });

         this.emojiPicker.addEventListener('click', (e) => this.handleEmojiSelection(e));
    },

    renderConversationsList() {
        this.conversationsListEl.innerHTML = '';
        this.conversations.forEach(convo => {
            const isActive = convo.id === this.activeConversationId;
            const convoEl = document.createElement('div');
            convoEl.className = `conversation-tab ${isActive ? 'active' : ''}`;
            convoEl.dataset.id = convo.id;
            convoEl.innerHTML = `
                <img src="${convo.avatar}" alt="Avatar de ${convo.name}">
                <span class="conversation-name-tab">${convo.name}</span>
            `;
            this.conversationsListEl.appendChild(convoEl);
        });
    },

    setActiveConversation(id) {
        this.activeConversationId = id;
        const convo = this.conversations.find(c => c.id === id);
        if (!convo) return;

        this.noChatSelectedViewEl.classList.add('hidden');
        this.chatWindowHeader.classList.remove('hidden');
        this.messageArea.classList.remove('hidden');
        this.chatInputArea.classList.remove('hidden');

        this.chatWindowAvatar.src = convo.avatar;
        this.chatWindowName.textContent = convo.name;
        this.chatWindowStatus.textContent = convo.status;
        
        const statusClassMap = { 'Online': 'online', 'Não Perturbe': 'dnd', 'Ausente': 'away', 'Offline': 'offline' };
        this.chatWindowStatusDot.className = `status-dot ${statusClassMap[convo.status] || 'offline'}`;
        
        this.renderMessages();
        this.renderConversationsList();
    },

    renderMessages() {
        const convo = this.conversations.find(c => c.id === this.activeConversationId);
        if (!convo) return;

        this.messageArea.innerHTML = '';
        convo.messages.forEach(msg => {
            this.addMessageToDOM(msg.sender, msg.type, msg.content, false);
        });
        this.messageArea.scrollTop = this.messageArea.scrollHeight;
    },

    addMessageToDOM(sender, type, content, isNewMessage = true) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender === 'me' ? 'sent' : 'received'}`;

        let contentHTML = '';
        if (type === 'text') {
            contentHTML = `<div class="message-bubble">${content}</div>`;
        } else if (type === 'gif' || type === 'image') {
            contentHTML = `<img src="${content}" alt="Mídia" class="message-media">`;
        } else if (type === 'audio') {
            contentHTML = `
                <div class="message-bubble message-audio">
                    <i class="fa-solid fa-play"></i>
                    <div class="audio-waveform"></div>
                    <span>${content}</span>
                </div>
            `;
        }
        
        wrapper.innerHTML = contentHTML;
        this.messageArea.appendChild(wrapper);

        if (isNewMessage) {
            setTimeout(() => {
                this.messageArea.scrollTop = this.messageArea.scrollHeight;
            }, 0);
        }
    },

    addMessageToConversation(sender, type, content) {
        if (!this.activeConversationId) return;
        const convo = this.conversations.find(c => c.id === this.activeConversationId);
        
        const newMessage = {
            sender, type, content,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        convo.messages.push(newMessage);
        convo.lastMessage = type === 'text' ? content : (type === 'image' ? 'Imagem' : 'GIF');
        convo.timestamp = newMessage.timestamp;

        this.addMessageToDOM(sender, type, content);
        this.renderConversationsList();
    },
    
    async handleSendMessage() {
        const messageContent = this.chatInput.value.trim();
        if (!messageContent || !this.activeConversationId) return;

        const convo = this.conversations.find(c => c.id === this.activeConversationId);
        if (!convo) return;

        this.addMessageToConversation('me', 'text', messageContent);
        this.chatInput.value = '';
        this.updateSendButtonVisibility();

        // MOSTRA O INDICADOR DE "DIGITANDO..."
        this.showTypingIndicator();
        
        // ESPERA PELA RESPOSTA INTELIGENTE
        const replyText = await this.getLocalBotReply(messageContent, convo.persona);
        
        // ESCONDE O INDICADOR DE "DIGITANDO..."
        this.hideTypingIndicator();
        
        if (replyText) {
            this.addMessageToConversation('other', 'text', replyText);
        }
    },
    
    // MÉTODO DE RESPOSTA APRIMORADO
    getLocalBotReply(userMessage, persona) {
        const msg = userMessage.toLowerCase();
        
        const responseBank = {
            gamer: {
                greetings: ["Eaí, mano! Tudo na paz?", "Opa, beleza?", "Fala tu!", "Salve!"],
                questions: {
                    "tudo bem": ["Tudo tranquilo por aqui, só farmando um pouco. E contigo?", "De boa, e você?", "Na correria de sempre pra upar, mas tamo aí. E tu?"],
                    "tá fazendo": ["Tô numa missão aqui, mó treta.", "Só de boa, esperando a galera pra fechar o time.", "Vendo umas streams pra pegar umas dicas."],
                    "qual a boa": ["A boa é upar até o talo! hehe", "Tô pensando em começar um jogo novo, alguma sugestão?", "A boa é zerar o game novo que saiu!"]
                },
                topics: {
                    "jogo": ["Opa, falou em jogo? Tô dentro! Qual a boa de hoje?", "Bora um game mais tarde? Tô precisando upar.", "Tô viciado num jogo novo, mó daora."],
                    "jogar": ["Bora! O que você tá a fim de jogar?", "Só chamar! Tô online.", "Demorou! Qual game?"],
                    "online": ["Tô online, sim! Pronto pra ação!", "Sempre online pra jogatina."],
                    "pc": ["Meu PC tá tunado pra rodar tudo no ultra!", "PC gamer é vida, né?", "Tô pensando em dar um upgrade no meu setup."],
                    "console": ["Prefiro PC, mas um console tem seu valor.", "Qual console você joga?", "PS5 ou Xbox? Eis a questão."],
                    "rank": ["Tô sofrendo pra subir de rank, tá osso.", "Peguei um rank novo ontem, tô felizão!"],
                    "skin": ["Viu a skin nova que lançou? Coisa linda!", "Gastei maior grana em skin, mas valeu a pena kkk"]
                },
                defaults: ["Saquei.", "GG.", "Daora.", "Massa!", "Top!", "Entendi.", "Fechou, mano.", "É isso."]
            },
            direto: {
                greetings: ["Olá.", "Oi."],
                questions: {
                    "tudo bem": ["Tudo certo. E com você?", "Tudo em ordem.", "Ocupado, mas bem."],
                    "precisa de algo": ["No momento não, obrigado.", "Estou bem por enquanto."],
                    "como vai": ["Vou bem, obrigado por perguntar.", "Tudo nos conformes."]
                },
                topics: {
                    "código": ["Estou focado em um projeto agora. O que precisa?", "Isso me lembra uma função que escrevi ontem.", "Preciso refatorar um código aqui."],
                    "projeto": ["O projeto está avançando bem. Alguma dúvida específica?", "Preciso terminar uma feature importante hoje."],
                    "trabalho": ["Bastante trabalho hoje.", "Sim, estou trabalhando nisso."],
                    "bug": ["Encontrei um bug complicado. Foco total pra resolver.", "Bugs... a alegria de todo dev."],
                    "api": ["A documentação da API está clara?", "Preciso fazer uma requisição para a API X."],
                    "dev": ["A vida de dev é corrida.", "Qual tecnologia você está usando?"]
                },
                defaults: ["Entendido.", "Ok.", "Certo.", "Anotado.", "Recebido.", "Prossiga."]
            },
            amigavel: {
                greetings: ["Oieee! Tudo bem por aí? ✨", "Olá! Que bom falar com você! 😄", "Oii! Como vai?"],
                questions: {
                    "tudo bem": ["Tudo ótimo, obrigada por perguntar! E com você, tudo em ordem? 😄", "Estou bem, sim! E você?", "Tudo maravilhoso! E por aí?"],
                    "novidades": ["Tenho tantas novidades! Nem sei por onde começar hehe. E você, o que me conta de bom?", "A maior novidade é que tô amando a nova temporada daquela série! Já viu?"],
                    "vamos sair": ["Amei a ideia! Para onde vamos? 🥳", "Super topo! Quando e onde?"]
                },
                topics: {
                    "ajuda": ["Claro! Como posso te ajudar? 😊", "Com certeza! Me diga o que você precisa."],
                    "problema": ["Oh não! O que aconteceu? Me conta que eu tento ajudar! 🤔", "Vamos resolver isso juntos! Qual o problema?"],
                    "foto": ["Awn, vi sua foto nova, arrasou! 🤩", "Precisamos tirar umas fotos juntos qualquer dia!"],
                    "música": ["Me indica uma música boa? Tô precisando renovar a playlist! 🎶", "Estou ouvindo uma música tão gostosinha agora."],
                    "filme": ["Vi um filme incrível ontem! Preciso te contar!", "Qual o último filme bom que você assistiu?"],
                    "obrigado": ["Imagina! Sempre que precisar. 🥰", "De nada! Fico feliz em ajudar. ❤️"],
                    "valeu": ["Disponha! 😄", "É pra já! 😉"]
                },
                defaults: ["Que legal! Me conta mais sobre isso. 😉", "Interessante! 🤔", "Adorei! ❤️", "Sério? Que demais! ✨", "Nossa, que bacana! 😄", "Ah, que fofo! 😊"]
            }
        };
        
        const findReply = (message, personaBank) => {
            if (message.length < 6) {
                 const greetings = ['oi', 'olá', 'eai', 'eae', 'opa', 'salve'];
                 for(const greeting of greetings) {
                     if (message.includes(greeting)) return personaBank.greetings[Math.floor(Math.random() * personaBank.greetings.length)];
                 }
            }
            for (const key in personaBank.questions) if (message.includes(key)) return personaBank.questions[key][Math.floor(Math.random() * personaBank.questions[key].length)];
            for (const key in personaBank.topics) if (message.includes(key)) return personaBank.topics[key][Math.floor(Math.random() * personaBank.topics[key].length)];
            return personaBank.defaults[Math.floor(Math.random() * personaBank.defaults.length)];
        };
    
        const personaResponses = responseBank[persona] || responseBank.direto;
        const reply = findReply(msg, personaResponses);
        
        return new Promise(resolve => setTimeout(() => resolve(reply), 1000 + Math.random() * 1500));
    },

    populateEmojiPicker() {
        if (!this.emojiPicker) return;
        const emojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '🚀', '🎉', '👋', '🙏', '💯', '👏', '👀', '😎', '😜', '😇', '🤯', '🥳', '😭', '😱', '🤢', '🥺', '😏', '🧐', '🤖', '👻', '💀', '👽', '👾', '😴', '🧠', '👑', '💎', '⚽️', '🏀', '🏈', '🎱', '🎮', '🎲', '🍔', '🍕', '🍿', '🍩', '🍺', '🍾', '🎁', '🎈', '🌍', '🌞', '🌛', '⭐', '⚡', '💡', '💻', '📱', '💰', '💸', '📈', '📉', '⚠️', '✅', '❌', '❓', '❗'];
        this.emojiPicker.innerHTML = '';
        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            this.emojiPicker.appendChild(btn);
        });
    },

    openEmojiModal() {
        this.emojiPickerModal.classList.remove('hidden');
    },

    handleEmojiSelection(event) {
        const emojiButton = event.target.closest('button');
        if (emojiButton) {
            this.chatInput.value += emojiButton.textContent;
            this.chatInput.focus();
            this.updateSendButtonVisibility();
            this.emojiPickerModal.classList.add('hidden');
        }
    },

    updateSendButtonVisibility() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendMessageBtn.classList.toggle('hidden', !hasText);
        this.audioRecordBtn.classList.toggle('hidden', hasText);
    },

    startAudioRecording() {
        if (this.isRecording) return;
        this.isRecording = true;
        this.chatInput.style.display = 'none';
        this.recordingIndicator.classList.remove('hidden');
        let seconds = 0;
        this.recordingTimer.textContent = '0:00';
        this.recordingInterval = setInterval(() => {
            seconds++;
            const min = Math.floor(seconds / 60);
            const sec = seconds % 60;
            this.recordingTimer.textContent = `${min}:${String(sec).padStart(2, '0')}`;
        }, 1000);
    },

    stopAudioRecording() {
        if (!this.isRecording) return;
        clearInterval(this.recordingInterval);
        const duration = this.recordingTimer.textContent;
        this.isRecording = false;
        this.chatInput.style.display = 'block';
        this.recordingIndicator.classList.add('hidden');
        if (duration !== '0:00') this.addMessageToConversation('me', 'audio', duration);
    },
    
    startCall(type) {
        if (!this.activeConversationId) return;
        const convo = this.conversations.find(c => c.id === this.activeConversationId);
        if (!convo) return;
        window.location.href = `call.html?user=${convo.id}&type=${type}`;
    },

    handleFileUpload(file, type) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => this.addMessageToConversation('me', type, e.target.result);
        reader.readAsDataURL(file);
        this.attachmentOptions.classList.add('hidden');
    },

    async openGifModal() {
        this.gifPickerModal.classList.remove('hidden');
        this.gifPickerGrid.innerHTML = '<div class="spinner"></div>';
        await this.searchGifs('trending');
    },

    async searchGifs(query) {
        this.gifPickerGrid.innerHTML = '<div class="spinner"></div>';
        const url = query === 'trending'
            ? `https://api.giphy.com/v1/gifs/trending?api_key=${this.giphyApiKey}&limit=20`
            : `https://api.giphy.com/v1/gifs/search?api_key=${this.giphyApiKey}&q=${query}&limit=20`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.gifPickerGrid.innerHTML = data.data.map(gif => 
                `<img src="${gif.images.fixed_height_small.url}" alt="${gif.title}" class="gif-item">`
            ).join('');
        } catch (error) {
            console.error('Erro ao buscar GIFs:', error);
            this.gifPickerGrid.innerHTML = '<p>Não foi possível carregar.</p>';
        }
    },

    // NOVO: INDICADOR DE "DIGITANDO..."
    showTypingIndicator() {
        const convo = this.conversations.find(c => c.id === this.activeConversationId);
        if (convo && convo.status !== 'Offline') {
            this.chatWindowStatus.textContent = 'digitando...';
            this.chatWindowStatusDot.style.backgroundColor = '#8A93A2'; // Cor neutra
        }
    },

    // NOVO: ESCONDE O INDICADOR E RESTAURA O STATUS
    hideTypingIndicator() {
        const convo = this.conversations.find(c => c.id === this.activeConversationId);
        if (convo) {
            this.chatWindowStatus.textContent = convo.status;
             const statusClassMap = { 'Online': 'online', 'Não Perturbe': 'dnd', 'Ausente': 'away', 'Offline': 'offline' };
            this.chatWindowStatusDot.className = `status-dot ${statusClassMap[convo.status] || 'offline'}`;
        }
    }
};