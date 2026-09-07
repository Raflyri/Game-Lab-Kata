/**
 * Game Controller & Main Engine: "Laboratorium Kata"
 * Mendukung layar responsif HP/Tablet, sistem Global Leaderboard, dan Evaluasi Rating Peneliti.
 */

class LaboratoriumKataGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // State Permainan
        this.STATE = {
            PROFILE: 'PROFILE',
            MENU: 'MENU',
            PLAYING: 'PLAYING',
            PAUSED: 'PAUSED',
            GAME_OVER: 'GAME_OVER',
            VICTORY: 'VICTORY'
        };
        this.currentState = this.STATE.PROFILE;

        // Dimensi Virtual Dinamis (Adaptif terhadap rasio layar)
        this.V_WIDTH = 900;
        this.V_HEIGHT = 650;
        this.isPortraitMode = false;

        // Entitas Game
        this.currentPhase = 'fase-a';
        this.wordQueue = [];
        this.activeQuestion = null;
        this.activeBubble = null;
        this.flasks = [];
        this.particleSystem = new ParticleSystem();
        this.inputController = null;

        // Atribut Skor & Nyawa
        this.score = 0;
        this.combo = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.questionsAnswered = 0;
        this.correctCount = 0;
        this.totalQuestionsInLevel = 8;

        // Tema Warna 3 Tabung Lab
        this.flaskColorThemes = [
            { liquidTop: '#38ef7d', liquidBottom: '#11998e', tagBg: '#0f8278', tagText: '#ffffff' },
            { liquidTop: '#00c6ff', liquidBottom: '#0072ff', tagBg: '#005ecc', tagText: '#ffffff' },
            { liquidTop: '#f857a6', liquidBottom: '#ff5858', tagBg: '#d63456', tagText: '#ffffff' }
        ];

        this.init();
    }

    init() {
        this.setupCanvasDPI();
        window.addEventListener('resize', () => this.setupCanvasDPI());
        window.addEventListener('orientationchange', () => setTimeout(() => this.setupCanvasDPI(), 200));

        // Inisialisasi Kontrol Drag & Drop
        this.inputController = new InputController(
            this.canvas,
            (x, y) => this.handleDragStart(x, y),
            (x, y) => this.handleDragMove(x, y),
            (x, y) => this.handleDragEnd(x, y)
        );

        // Bind Tombol UI
        this.bindUIEvents();

        // Mulai Game Loop
        requestAnimationFrame((t) => this.loop(t));

        // Tampilkan Layar Profil Awal
        this.renderProfileSelection();
    }

    setupCanvasDPI() {
        const wrapper = this.canvas.parentElement;
        if (!wrapper) return;

        const containerW = wrapper.clientWidth || window.innerWidth;
        const containerH = wrapper.clientHeight || (window.innerHeight - 80);

        // Deteksi mode tampilan (Ponsel Portrait vs Landscape/Tablet/Desktop)
        this.isPortraitMode = (containerW < 640) && (containerH > containerW);

        if (this.isPortraitMode) {
            // Resolusi virtual proporsional untuk layar vertikal ponsel
            this.V_WIDTH = 540;
            this.V_HEIGHT = 760;
        } else {
            // Resolusi virtual untuk landscape / tablet / monitor PC
            this.V_WIDTH = 900;
            this.V_HEIGHT = 650;
        }

        this.canvas.width = this.V_WIDTH;
        this.canvas.height = this.V_HEIGHT;

        // Hitung scaling CSS dengan mempertahankan aspect ratio
        const aspect = this.V_WIDTH / this.V_HEIGHT;
        let displayW = containerW;
        let displayH = displayW / aspect;

        if (displayH > containerH) {
            displayH = containerH;
            displayW = displayH * aspect;
        }

        this.canvas.style.width = `${Math.floor(displayW)}px`;
        this.canvas.style.height = `${Math.floor(displayH)}px`;

        // Jika sedang bermain, tata ulang posisi tabung agar segera pas
        if (this.currentState === this.STATE.PLAYING && this.flasks.length > 0) {
            this.repositionEntitiesOnResize();
        }
    }

    repositionEntitiesOnResize() {
        const numFlasks = this.flasks.length;
        const spacing = this.V_WIDTH / (numFlasks + 1);
        const flaskY = this.V_HEIGHT - (this.isPortraitMode ? 55 : 65);
        const flaskW = this.isPortraitMode ? 108 : 145;
        const flaskH = this.isPortraitMode ? 105 : 135;

        for (let i = 0; i < numFlasks; i++) {
            this.flasks[i].x = spacing * (i + 1);
            this.flasks[i].y = flaskY;
            this.flasks[i].width = flaskW;
            this.flasks[i].height = flaskH;
        }

        if (this.activeBubble) {
            this.activeBubble.radius = this.isPortraitMode ? 50 : 62;
        }
    }

    bindUIEvents() {
        // Tombol Suara
        const soundBtn = document.getElementById('soundToggleBtn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const muted = window.soundEngine.toggleMute();
                soundBtn.textContent = muted ? '🔇' : '🔊';
                soundBtn.classList.toggle('muted', muted);
            });
        }

        // Tombol Ganti Profil dari HUD
        const switchProfileBtn = document.getElementById('switchProfileBtn');
        if (switchProfileBtn) {
            switchProfileBtn.addEventListener('click', () => {
                this.currentState = this.STATE.PROFILE;
                this.renderProfileSelection();
            });
        }

        // Tombol Buka Leaderboard Global dari HUD
        const leaderboardBtn = document.getElementById('openLeaderboardBtn');
        if (leaderboardBtn) {
            leaderboardBtn.addEventListener('click', () => {
                this.showLeaderboardModal('all');
            });
        }

        // Tombol Tutup Leaderboard
        const closeLeaderboardBtn = document.getElementById('btnCloseLeaderboard');
        if (closeLeaderboardBtn) {
            closeLeaderboardBtn.addEventListener('click', () => {
                document.getElementById('leaderboardModal').classList.add('hidden');
            });
        }

        // Tab Filter Leaderboard
        document.querySelectorAll('.tab-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const phase = e.target.dataset.phase || 'all';
                this.loadLeaderboardData(phase);
            });
        });

        // Tombol Pilih Fase A & Fase B
        const btnFaseA = document.getElementById('btnFaseA');
        const btnFaseB = document.getElementById('btnFaseB');
        if (btnFaseA) btnFaseA.addEventListener('click', () => this.startPhase('fase-a'));
        if (btnFaseB) btnFaseB.addEventListener('click', () => this.startPhase('fase-b'));

        // Tombol Lanjut di Dialog Edukasi
        const btnNextEdu = document.getElementById('btnNextEdu');
        if (btnNextEdu) {
            btnNextEdu.addEventListener('click', () => {
                this.hideEducationalModal();
                this.spawnNextQuestion();
            });
        }

        // Tombol Main Lagi / Kembali ke Menu
        document.querySelectorAll('.btn-restart-game').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAllModals();
                this.startPhase(this.currentPhase);
            });
        });

        document.querySelectorAll('.btn-to-menu').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAllModals();
                this.currentState = this.STATE.MENU;
                this.showMenuScreen();
            });
        });

        // Tombol Submit Skor ke Leaderboard Global (dari Victory Modal)
        const btnSubmitLeaderboard = document.getElementById('btnSubmitLeaderboard');
        if (btnSubmitLeaderboard) {
            btnSubmitLeaderboard.addEventListener('click', () => this.handleScoreSubmission());
        }
    }

    renderProfileSelection() {
        this.hideAllModals();
        const modal = document.getElementById('profileModal');
        const container = document.getElementById('profilesContainer');
        if (!modal || !container) return;

        const profiles = window.profileManager.profiles;
        const activeProfile = window.profileManager.getActiveProfile();

        container.innerHTML = '';
        profiles.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = `profile-card ${p.id === activeProfile.id ? 'selected' : ''}`;
            const totalStars = (p.stars['fase-a'] || 0) + (p.stars['fase-b'] || 0);

            card.innerHTML = `
                <div class="profile-avatar">${p.avatar}</div>
                <div class="profile-info">
                    <input type="text" class="profile-name-input" value="${p.name}" maxlength="15" data-slot="${idx}">
                    <div class="profile-stats">
                        <span>⭐ ${totalStars} Bintang</span>
                        <span>🏆 Skor: ${p.score || 0}</span>
                    </div>
                    <div class="profile-badges">
                        ${(p.badges || []).map(b => `<span class="badge-item">${b}</span>`).join('')}
                    </div>
                </div>
                <button class="btn-select-profile" data-slot="${idx}">Pilih Aku! 🚀</button>
            `;

            const input = card.querySelector('.profile-name-input');
            input.addEventListener('change', (e) => {
                p.name = e.target.value.trim() || `Pemain ${idx + 1}`;
                window.profileManager.saveProfiles();
                this.updateHUDProfile();
            });
            input.addEventListener('click', (e) => e.stopPropagation());

            card.querySelector('.btn-select-profile').addEventListener('click', () => {
                window.profileManager.selectProfile(idx);
                window.soundEngine.playGrab();
                this.updateHUDProfile();
                this.showMenuScreen();
            });

            container.appendChild(card);
        });

        modal.classList.remove('hidden');
    }

    updateHUDProfile() {
        const p = window.profileManager.getActiveProfile();
        const avatarEl = document.getElementById('hudAvatar');
        const nameEl = document.getElementById('hudName');
        const scoreEl = document.getElementById('hudHighScore');

        if (avatarEl) avatarEl.textContent = p.avatar;
        if (nameEl) nameEl.textContent = p.name;
        if (scoreEl) scoreEl.textContent = `Skor: ${p.score || 0}`;
    }

    showMenuScreen() {
        this.hideAllModals();
        this.currentState = this.STATE.MENU;
        this.updateHUDProfile();
        const menuModal = document.getElementById('menuModal');
        if (menuModal) menuModal.classList.remove('hidden');
    }

    async showLeaderboardModal(phase = 'all') {
        const modal = document.getElementById('leaderboardModal');
        if (!modal) return;
        modal.classList.remove('hidden');

        // Tampilkan info rating profil saat ini
        const activeProfile = window.profileManager.getActiveProfile();
        const rating = window.leaderboardService.getRatingInfo(activeProfile.score || 0);

        const myTierEl = document.getElementById('myRatingTier');
        const myStarsEl = document.getElementById('myRatingStars');
        const myScoreEl = document.getElementById('myRatingScore');
        const myDescEl = document.getElementById('myRatingDesc');

        if (myTierEl) myTierEl.textContent = rating.tier;
        if (myStarsEl) myStarsEl.textContent = `${rating.stars} (${rating.numericRating})`;
        if (myScoreEl) myScoreEl.textContent = `Skor Tertinggimu: ${activeProfile.score || 0}`;
        if (myDescEl) myDescEl.textContent = rating.desc;

        await this.loadLeaderboardData(phase);
    }

    async loadLeaderboardData(phase = 'all') {
        const listContainer = document.getElementById('leaderboardList');
        if (!listContainer) return;

        listContainer.innerHTML = '<div class="loading-state">Mengambil Papan Peringkat Global... 📡</div>';

        const list = await window.leaderboardService.getLeaderboard(phase);
        listContainer.innerHTML = '';

        if (!list || list.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">Belum ada peneliti terdaftar. Jadilah yang pertama! 🌟</div>';
            return;
        }

        list.forEach((item, index) => {
            const row = document.createElement('div');
            const rank = index + 1;
            let rankMedal = rank;
            let rankClass = 'rank-regular';

            if (rank === 1) { rankMedal = '🥇'; rankClass = 'rank-gold'; }
            else if (rank === 2) { rankMedal = '🥈'; rankClass = 'rank-silver'; }
            else if (rank === 3) { rankMedal = '🥉'; rankClass = 'rank-bronze'; }

            row.className = `leaderboard-row ${rankClass}`;
            row.innerHTML = `
                <div class="row-rank">${rankMedal}</div>
                <div class="row-avatar">${item.avatar || '🐱'}</div>
                <div class="row-info">
                    <div class="row-name">${item.name}</div>
                    <div class="row-school">🏫 ${item.school || 'SD Merdeka Belajar'}</div>
                </div>
                <div class="row-tier">
                    <span class="tier-pill">${item.tier || 'Eksplorer Cilik 🔬'}</span>
                    <span class="rating-stars">${'★'.repeat(Math.round(item.rating || 3))}</span>
                </div>
                <div class="row-score">${item.score}</div>
            `;
            listContainer.appendChild(row);
        });
    }

    async handleScoreSubmission() {
        const btn = document.getElementById('btnSubmitLeaderboard');
        const schoolInput = document.getElementById('schoolNameInput');
        const statusEl = document.getElementById('submitStatusMsg');

        const activeProfile = window.profileManager.getActiveProfile();
        const schoolName = (schoolInput && schoolInput.value.trim()) ? schoolInput.value.trim() : 'SD Merdeka Belajar';

        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Mengirim... 🚀';
        }

        const entry = {
            name: activeProfile.name,
            school: schoolName,
            avatar: activeProfile.avatar,
            phase: this.currentPhase,
            score: this.score,
            stars: 3
        };

        const result = await window.leaderboardService.submitScore(entry);

        if (statusEl) {
            statusEl.textContent = `Tersimpan! Peringkat Global: #${result.globalRank || 1} 🎉`;
            statusEl.className = 'status-success';
        }

        if (btn) {
            btn.textContent = 'Sudah Tercatat! ✔';
        }

        // Tampilkan modal leaderboard setelah 1 detik
        setTimeout(() => {
            this.showLeaderboardModal(this.currentPhase);
        }, 1200);
    }

    async startPhase(phase) {
        this.currentPhase = phase;
        this.hideAllModals();
        this.currentState = this.STATE.PLAYING;

        // Reset Atribut Sesi
        this.score = 0;
        this.combo = 0;
        this.lives = this.maxLives;
        this.questionsAnswered = 0;
        this.correctCount = 0;
        this.particleSystem.clear();

        this.setupCanvasDPI();
        this.updateHUDLives();
        this.updateHUDScore();

        window.soundEngine.startBgm();

        const allQuestions = await window.wordRepo.getWordsByPhase(phase);
        this.wordQueue = allQuestions.slice(0, this.totalQuestionsInLevel);

        this.spawnNextQuestion();
    }

    spawnNextQuestion() {
        if (this.lives <= 0) {
            this.handleGameOver();
            return;
        }

        if (this.wordQueue.length === 0 || this.questionsAnswered >= this.totalQuestionsInLevel) {
            this.handleVictory();
            return;
        }

        this.activeQuestion = this.wordQueue.pop();
        this.questionsAnswered++;

        // Setup 3 Wadah Lab Bawah (Disesuaikan otomatis Portrait vs Landscape)
        this.flasks = [];
        const options = [...this.activeQuestion.options];
        const numFlasks = options.length;
        const spacing = this.V_WIDTH / (numFlasks + 1);
        const flaskY = this.V_HEIGHT - (this.isPortraitMode ? 55 : 65);
        const flaskW = this.isPortraitMode ? 108 : 145;
        const flaskH = this.isPortraitMode ? 105 : 135;

        for (let i = 0; i < numFlasks; i++) {
            const flaskX = spacing * (i + 1);
            const theme = this.flaskColorThemes[i % this.flaskColorThemes.length];
            this.flasks.push(new FlaskTarget(i, options[i], flaskX, flaskY, flaskW, flaskH, theme));
        }

        // Buat Gelembung Kata Subjek
        const startX = this.V_WIDTH * 0.5 + (Math.random() - 0.5) * (this.V_WIDTH * 0.35);
        const startY = this.isPortraitMode ? 80 : 85;
        const bubbleRadius = this.isPortraitMode ? 50 : 62;

        this.activeBubble = new GlossyBubble(this.activeQuestion, startX, startY, bubbleRadius);

        const topicEl = document.getElementById('hudTopicInfo');
        if (topicEl) {
            topicEl.textContent = `🔬 ${this.activeQuestion.topic}`;
        }
    }

    handleDragStart(x, y) {
        if (this.currentState !== this.STATE.PLAYING || !this.activeBubble) return;

        if (this.activeBubble.containsPoint(x, y)) {
            this.activeBubble.isDragging = true;
            this.activeBubble.touchOffsetX = x - this.activeBubble.x;
            this.activeBubble.touchOffsetY = y - this.activeBubble.y;
            window.soundEngine.playGrab();
        }
    }

    handleDragMove(x, y) {
        if (this.currentState !== this.STATE.PLAYING || !this.activeBubble || !this.activeBubble.isDragging) return;

        this.activeBubble.x = x - this.activeBubble.touchOffsetX;
        this.activeBubble.y = y - this.activeBubble.touchOffsetY;

        this.flasks.forEach(flask => {
            flask.isHighlighted = flask.isBubbleInside(this.activeBubble);
        });
    }

    handleDragEnd(x, y) {
        if (this.currentState !== this.STATE.PLAYING || !this.activeBubble || !this.activeBubble.isDragging) return;

        this.activeBubble.isDragging = false;

        let droppedFlask = null;
        for (const flask of this.flasks) {
            if (flask.isBubbleInside(this.activeBubble)) {
                droppedFlask = flask;
                break;
            }
        }

        if (droppedFlask) {
            this.checkAnswer(droppedFlask);
        } else {
            this.flasks.forEach(f => f.isHighlighted = false);
        }
    }

    checkAnswer(flask) {
        const isCorrect = (flask.label === this.activeQuestion.correctTarget);

        if (isCorrect) {
            window.soundEngine.playCorrect();
            this.correctCount++;
            this.combo++;
            const points = 100 + (this.combo - 1) * 25;
            this.score += points;

            this.particleSystem.createExplosion(flask.x, flask.y - 60, flask.colorTheme.liquidTop);
            this.particleSystem.addFloatingText(`+${points}! Hebat! 🎉`, flask.x, flask.y - 80, '#2e7d32');

            this.updateHUDScore();
            this.showEducationalModal(true, this.activeQuestion.explanation);
        } else {
            window.soundEngine.playWrong();
            this.combo = 0;
            this.lives = Math.max(0, this.lives - 1);
            this.updateHUDLives();

            this.particleSystem.createExplosion(flask.x, flask.y - 60, '#f44336');
            this.particleSystem.addFloatingText('Kurang Pas! 💡', flask.x, flask.y - 80, '#d32f2f');

            if (this.lives <= 0) {
                setTimeout(() => this.handleGameOver(), 1000);
            } else {
                this.showEducationalModal(false, `Kurang tepat. ${this.activeQuestion.explanation}`);
            }
        }

        this.activeBubble = null;
    }

    handleBubbleHitGround() {
        if (!this.activeBubble) return;

        window.soundEngine.playDropGround();
        this.combo = 0;
        this.lives = Math.max(0, this.lives - 1);
        this.updateHUDLives();

        this.particleSystem.createExplosion(this.activeBubble.x, this.V_HEIGHT - 30, '#ff9800');
        this.particleSystem.addFloatingText('Gelembung Meletus! 💥', this.activeBubble.x, this.V_HEIGHT - 60, '#e65100');

        const missedExplanation = `Waktu habis! Pasangan yang cocok: ${this.activeQuestion.subject} -> ${this.activeQuestion.correctTarget}. ${this.activeQuestion.explanation}`;
        this.activeBubble = null;

        if (this.lives <= 0) {
            setTimeout(() => this.handleGameOver(), 1000);
        } else {
            this.showEducationalModal(false, missedExplanation);
        }
    }

    showEducationalModal(isSuccess, explanationText) {
        this.currentState = this.STATE.PAUSED;
        const modal = document.getElementById('educationalModal');
        const titleEl = document.getElementById('eduModalTitle');
        const textEl = document.getElementById('eduModalText');
        const iconEl = document.getElementById('eduModalIcon');

        if (!modal) return;

        if (isSuccess) {
            titleEl.textContent = 'Jawaban Tepat! ⭐';
            titleEl.className = 'edu-title-success';
            iconEl.textContent = '✨ 🔬 ✨';
        } else {
            titleEl.textContent = 'Ayo Pelajari! 💡';
            titleEl.className = 'edu-title-learn';
            iconEl.textContent = '🧪 📖 🧐';
        }

        textEl.textContent = explanationText;
        modal.classList.remove('hidden');
    }

    hideEducationalModal() {
        const modal = document.getElementById('educationalModal');
        if (modal) modal.classList.add('hidden');
        this.currentState = this.STATE.PLAYING;
    }

    handleVictory() {
        this.currentState = this.STATE.VICTORY;
        window.soundEngine.playVictory();

        let stars = 1;
        if (this.correctCount >= 7 && this.lives === 3) stars = 3;
        else if (this.correctCount >= 5) stars = 2;

        window.profileManager.recordGameResult(this.currentPhase, this.score, this.correctCount, stars);
        this.updateHUDProfile();

        // Hitung rating
        const rating = window.leaderboardService.getRatingInfo(this.score);

        const modal = document.getElementById('victoryModal');
        const scoreEl = document.getElementById('victoryScore');
        const starsEl = document.getElementById('victoryStars');
        const correctEl = document.getElementById('victoryCorrectCount');
        const tierEl = document.getElementById('victoryRatingTier');
        const btnSubmit = document.getElementById('btnSubmitLeaderboard');
        const statusEl = document.getElementById('submitStatusMsg');

        if (scoreEl) scoreEl.textContent = this.score;
        if (starsEl) starsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        if (correctEl) correctEl.textContent = `${this.correctCount} / ${this.totalQuestionsInLevel}`;
        if (tierEl) tierEl.textContent = `${rating.tier} (${rating.stars})`;
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Kirim ke Leaderboard Global 🚀';
        }
        if (statusEl) statusEl.textContent = '';

        if (modal) modal.classList.remove('hidden');
    }

    handleGameOver() {
        this.currentState = this.STATE.GAME_OVER;
        window.soundEngine.stopBgm();

        window.profileManager.recordGameResult(this.currentPhase, this.score, this.correctCount, 0);
        this.updateHUDProfile();

        const modal = document.getElementById('gameOverModal');
        const scoreEl = document.getElementById('gameOverScore');
        if (scoreEl) scoreEl.textContent = this.score;
        if (modal) modal.classList.remove('hidden');
    }

    hideAllModals() {
        document.querySelectorAll('.game-modal').forEach(m => m.classList.add('hidden'));
    }

    updateHUDScore() {
        const scoreEl = document.getElementById('hudScore');
        const comboEl = document.getElementById('hudCombo');
        if (scoreEl) scoreEl.textContent = this.score;
        if (comboEl) {
            if (this.combo > 1) {
                comboEl.textContent = `🔥 x${this.combo}`;
                comboEl.classList.remove('hidden');
            } else {
                comboEl.classList.add('hidden');
            }
        }
    }

    updateHUDLives() {
        const livesEl = document.getElementById('hudLivesContainer');
        if (!livesEl) return;
        livesEl.innerHTML = '';
        for (let i = 0; i < this.maxLives; i++) {
            const bottle = document.createElement('span');
            bottle.className = `elixir-bottle ${i < this.lives ? 'active' : 'broken'}`;
            bottle.textContent = i < this.lives ? '🧪' : '💥';
            livesEl.appendChild(bottle);
        }
    }

    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        if (this.currentState !== this.STATE.PLAYING) return;

        this.flasks.forEach(f => f.update());

        if (this.activeBubble) {
            this.activeBubble.update(this.V_WIDTH, this.V_HEIGHT);
            if (this.activeBubble.y >= this.V_HEIGHT - 35) {
                this.handleBubbleHitGround();
            }
        }

        this.particleSystem.update();
    }

    render() {
        this.ctx.clearRect(0, 0, this.V_WIDTH, this.V_HEIGHT);
        this.drawLabBackground();
        this.flasks.forEach(f => f.draw(this.ctx));
        if (this.activeBubble) this.activeBubble.draw(this.ctx);
        this.particleSystem.draw(this.ctx);
    }

    drawLabBackground() {
        const ctx = this.ctx;
        const w = this.V_WIDTH;
        const h = this.V_HEIGHT;

        const wallGrad = ctx.createLinearGradient(0, 0, 0, h - 70);
        wallGrad.addColorStop(0, '#f0f9ff');
        wallGrad.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, h - 70);

        // Ubin lab
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
        ctx.lineWidth = 1.5;
        const tileSize = this.isPortraitMode ? 45 : 60;
        for (let x = tileSize; x < w; x += tileSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h - 70);
            ctx.stroke();
        }
        for (let y = tileSize; y < h - 70; y += tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Meja lab
        const tableY = h - 70;
        const tableGrad = ctx.createLinearGradient(0, tableY, 0, h);
        tableGrad.addColorStop(0, '#bae6fd');
        tableGrad.addColorStop(0.2, '#7dd3fc');
        tableGrad.addColorStop(1, '#38bdf8');
        ctx.fillStyle = tableGrad;
        ctx.fillRect(0, tableY, w, 70);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, tableY - 4, w, 4);

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(0, h - 30);
        ctx.lineTo(w, h - 30);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new LaboratoriumKataGame();
});
