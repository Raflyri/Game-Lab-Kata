/**
 * Sistem Manajemen Profil Pemain Lokal ("RBeverything Edu")
 * Menyediakan 3 slot profil pemain untuk anak-anak dengan penyimpanan di localStorage
 */

class ProfileManager {
    constructor() {
        this.STORAGE_KEY = 'rbeverything_lab_kata_profiles';
        this.CURRENT_SLOT_KEY = 'rbeverything_lab_kata_active_slot';
        this.activeSlot = 0; // 0, 1, 2
        this.profiles = this.loadProfiles();
    }

    getDefaultProfiles() {
        return [
            {
                id: 0,
                name: "Prof. Kucing",
                avatar: "🐱",
                color: "#ff6b8b",
                bgGradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%)",
                score: 0,
                stars: { 'fase-a': 0, 'fase-b': 0 },
                wordsLearned: 0,
                badges: ["Peneliti Pemula 🔬"]
            },
            {
                id: 1,
                name: "Kelinci Ceria",
                avatar: "🐰",
                color: "#4facfe",
                bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                score: 0,
                stars: { 'fase-a': 0, 'fase-b': 0 },
                wordsLearned: 0,
                badges: ["Peneliti Pemula 🔬"]
            },
            {
                id: 2,
                name: "Robo Pintar",
                avatar: "🤖",
                color: "#43e97b",
                bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                score: 0,
                stars: { 'fase-a': 0, 'fase-b': 0 },
                wordsLearned: 0,
                badges: ["Peneliti Pemula 🔬"]
            }
        ];
    }

    loadProfiles() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length === 3) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Gagal memuat profil pemain dari localStorage:", e);
        }

        const defaults = this.getDefaultProfiles();
        this.saveProfiles(defaults);
        return defaults;
    }

    saveProfiles(profiles = this.profiles) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
        } catch (e) {
            console.error("Gagal menyimpan profil:", e);
        }
    }

    getActiveProfile() {
        try {
            const savedSlot = localStorage.getItem(this.CURRENT_SLOT_KEY);
            if (savedSlot !== null) {
                this.activeSlot = parseInt(savedSlot, 10) || 0;
            }
        } catch (e) {}

        return this.profiles[this.activeSlot] || this.profiles[0];
    }

    selectProfile(slotIndex) {
        if (slotIndex >= 0 && slotIndex < this.profiles.length) {
            this.activeSlot = slotIndex;
            try {
                localStorage.setItem(this.CURRENT_SLOT_KEY, slotIndex.toString());
            } catch (e) {}
            return this.profiles[this.activeSlot];
        }
        return null;
    }

    updateCurrentProfileName(newName) {
        if (!newName || !newName.trim()) return;
        const current = this.getActiveProfile();
        current.name = newName.trim().slice(0, 15);
        this.saveProfiles();
    }

    recordGameResult(phase, scoreEarned, correctCount, newStars) {
        const current = this.getActiveProfile();
        
        // Perbarui Skor Tertinggi
        if (scoreEarned > (current.score || 0)) {
            current.score = scoreEarned;
        }

        // Akumulasi Bintang per Fase
        current.stars = current.stars || { 'fase-a': 0, 'fase-b': 0 };
        current.stars[phase] = Math.max(current.stars[phase] || 0, newStars);

        // Tambah jumlah kata yang dipelajari
        current.wordsLearned = (current.wordsLearned || 0) + correctCount;

        // Cek Badge reward
        this.checkBadges(current);

        this.saveProfiles();
    }

    checkBadges(profile) {
        profile.badges = profile.badges || [];
        const totalStars = (profile.stars['fase-a'] || 0) + (profile.stars['fase-b'] || 0);

        if (totalStars >= 3 && !profile.badges.includes("Bintang Kata ⭐")) {
            profile.badges.push("Bintang Kata ⭐");
        }
        if (profile.wordsLearned >= 10 && !profile.badges.includes("Pakar Kosakata 📚")) {
            profile.badges.push("Pakar Kosakata 📚");
        }
        if (profile.score >= 500 && !profile.badges.includes("Juara Lab 🏆")) {
            profile.badges.push("Juara Lab 🏆");
        }
    }
}

window.profileManager = new ProfileManager();
