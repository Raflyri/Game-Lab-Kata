/**
 * Client-Side Leaderboard & Global Rating Service
 * Mengelola interaksi dengan API Papan Peringkat Global (/api/leaderboard),
 * perhitungan bintang rating peneliti, dan sinkronisasi offline.
 */

class LeaderboardService {
    constructor() {
        this.STORAGE_KEY = 'rbeverything_lab_kata_global_mock';
    }

    getRatingInfo(score) {
        if (score >= 1000) {
            return {
                tier: "Profesor Jenius 👑",
                stars: "★★★★★",
                numericRating: "5.0",
                badgeClass: "tier-genius",
                desc: "Penguasaan literasi & kosakata sempurna!"
            };
        } else if (score >= 750) {
            return {
                tier: "Peneliti Handal 🌟",
                stars: "★★★★☆",
                numericRating: "4.5",
                badgeClass: "tier-expert",
                desc: "Pemahaman struktur kalimat sangat tajam!"
            };
        } else if (score >= 450) {
            return {
                tier: "Eksplorer Cilik 🔬",
                stars: "★★★☆☆",
                numericRating: "3.5",
                badgeClass: "tier-explorer",
                desc: "Kemampuan mencocokkan kata berkembang pesat!"
            };
        } else {
            return {
                tier: "Ilmuwan Pemula 🌱",
                stars: "★★☆☆☆",
                numericRating: "2.5",
                badgeClass: "tier-novice",
                desc: "Awal yang luar biasa! Teruslah bereksplorasi!"
            };
        }
    }

    async getLeaderboard(phase = 'all') {
        try {
            const res = await fetch(`/api/leaderboard?phase=${encodeURIComponent(phase)}&limit=20`);
            if (res.ok) {
                const json = await res.json();
                if (json && json.data) {
                    return json.data;
                }
            }
        } catch (e) {
            console.warn("Koneksi API leaderboard tidak tersedia, beralih ke cache lokal.", e.message);
        }

        // Fallback data tersimpan lokal
        return this.getLocalMock(phase);
    }

    async submitScore(entry) {
        try {
            const res = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            if (res.ok) {
                const json = await res.json();
                return json;
            }
        } catch (e) {
            console.warn("Gagal mengirim skor ke server online, menyimpan di cache lokal:", e);
        }

        // Simpan ke local mock
        return this.saveToLocalMock(entry);
    }

    getLocalMock(phase = 'all') {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                let list = JSON.parse(raw);
                if (phase !== 'all') {
                    list = list.filter(i => i.phase === phase);
                }
                list.sort((a, b) => b.score - a.score);
                return list;
            }
        } catch (e) {}

        const defaults = [
            { id: '1', name: "Aisyah Putri", school: "SD Bintang Mulia", avatar: "🐱", phase: "fase-b", score: 1450, stars: 3, tier: "Profesor Jenius 👑", rating: 5.0 },
            { id: '2', name: "Budi Santoso", school: "SD Negeri 1 Merdeka", avatar: "🤖", phase: "fase-a", score: 1320, stars: 3, tier: "Profesor Jenius 👑", rating: 5.0 },
            { id: '3', name: "Clara Wijaya", school: "SD Cendekia Harapan", avatar: "🐰", phase: "fase-b", score: 1180, stars: 3, tier: "Profesor Jenius 👑", rating: 4.9 },
            { id: '4', name: "Dimas Arya", school: "SD Teladan Bangsa", avatar: "🐱", phase: "fase-a", score: 980, stars: 3, tier: "Peneliti Handal 🌟", rating: 4.7 },
            { id: '5', name: "Fathir Rizky", school: "SDIT Al-Falah", avatar: "🤖", phase: "fase-b", score: 920, stars: 2, tier: "Peneliti Handal 🌟", rating: 4.5 }
        ];
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
        } catch (e) {}

        return phase === 'all' ? defaults : defaults.filter(d => d.phase === phase);
    }

    saveToLocalMock(entry) {
        let list = this.getLocalMock('all');
        const rating = this.getRatingInfo(entry.score);
        const record = {
            id: 'local_' + Date.now(),
            name: entry.name,
            school: entry.school || 'SD Merdeka Belajar',
            avatar: entry.avatar || '🐱',
            phase: entry.phase,
            score: entry.score,
            stars: entry.stars,
            tier: rating.tier,
            rating: parseFloat(rating.numericRating)
        };
        list.push(record);
        list.sort((a, b) => b.score - a.score);
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
        } catch (e) {}

        const rank = list.findIndex(r => r.id === record.id) + 1;
        return { success: true, savedTo: 'LocalStorage', record: record, globalRank: rank };
    }
}

window.leaderboardService = new LeaderboardService();
