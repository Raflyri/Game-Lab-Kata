/**
 * Audio Engine untuk "Laboratorium Kata"
 * Menggunakan Web Audio API untuk menghasilkan sound effects ceria & musik ramah anak
 * tanpa memerlukan dependensi file audio eksternal.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.initContext();
    }

    initContext() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    ensureResume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBgm();
        } else {
            this.startBgm();
        }
        return this.isMuted;
    }

    // Suara gelembung meletup (pop)
    playPop() {
        if (this.isMuted) return;
        this.ensureResume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Suara gelembung diambil / diangkat (drag)
    playGrab() {
        if (this.isMuted) return;
        this.ensureResume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.09);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Suara jawaban benar (chime melodi ceria akor mayor C - E - G - C')
    playCorrect() {
        if (this.isMuted) return;
        this.ensureResume();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const startTime = this.ctx.currentTime + idx * 0.07;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.22, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    // Suara salah / tidak cocok (boing lembut lucu, tidak menakutkan bagi anak)
    playWrong() {
        if (this.isMuted) return;
        this.ensureResume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    // Suara saat gelembung jatuh ke lantai (splat lembut)
    playDropGround() {
        if (this.isMuted) return;
        this.ensureResume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Suara kemenangan level / bintang didapat (fanfare ceria)
    playVictory() {
        if (this.isMuted) return;
        this.ensureResume();
        if (!this.ctx) return;

        const fanfare = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.35 } // C6
        ];

        let offset = 0;
        fanfare.forEach((item) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            const startTime = this.ctx.currentTime + offset;
            osc.frequency.setValueAtTime(item.f, startTime);

            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + item.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + item.d);
            offset += item.d * 0.9;
        });
    }

    // Background music santai menggunakan arpeggiator marimba lembut
    startBgm() {
        if (this.isMuted || this.bgmPlaying) return;
        this.ensureResume();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        const melody = [
            523.25, 659.25, 783.99, 659.25,
            587.33, 698.46, 880.00, 698.46,
            659.25, 783.99, 987.77, 783.99,
            523.25, 783.99, 659.25, 523.25
        ];
        let noteIndex = 0;

        this.bgmInterval = setInterval(() => {
            if (!this.bgmPlaying || this.isMuted || !this.ctx) return;
            const freq = melody[noteIndex % melody.length];
            noteIndex++;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.38);
        }, 400);
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
    }
}

// Instance global suara
window.soundEngine = new SoundEngine();
