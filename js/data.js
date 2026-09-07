/**
 * Bank Data Soal "Laboratorium Kata"
 * Berdasarkan Kurikulum Merdeka (Bahasa Indonesia & Literasi SD)
 * - Fase A: Kelas 1-2 (Kosakata Dasar, Pasangan Benda & Tindakan, Lawan Kata / Antonim Sederhana)
 * - Fase B: Kelas 3-4 (Struktur SPOK, Sinonim & Antonim Kaya, Kosa Kata Kontekstual)
 *
 * Catatan Arsitektur:
 * Data disiapkan dalam format tabel relasional terstruktur yang mensimulasikan
 * hasil kueri dari Cloudflare D1 Database (SELECT * FROM word_pairs WHERE phase = ?).
 */

const CURRICULUM_DATA = {
    // Fase A: Kelas 1 - 2 SD (Pasangan Subjek - Predikat sederhana & Antonim)
    "fase-a": [
        {
            id: 1,
            topic: "Benda & Tindakannya",
            subject: "Bunga",
            correctTarget: "Mekar",
            options: ["Mekar", "Terbang", "Berenang"],
            explanation: "Bunga yang indah akan mekar di taman!",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 2,
            topic: "Hewan & Suaranya",
            subject: "Kucing",
            correctTarget: "Mengeong",
            options: ["Menggonggong", "Mengeong", "Berkokok"],
            explanation: "Kucing bersuara mengeong: meong... meong!",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 3,
            topic: "Hewan & Gerakannya",
            subject: "Burung",
            correctTarget: "Terbang",
            options: ["Menyelam", "Merayap", "Terbang"],
            explanation: "Burung menggunakan sayapnya untuk terbang di langit.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 4,
            topic: "Hewan & Gerakannya",
            subject: "Ikan",
            correctTarget: "Berenang",
            options: ["Berenang", "Melompat", "Memanjat"],
            explanation: "Ikan berenang di dalam air menggunakan siripnya.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 5,
            topic: "Lawan Kata (Antonim)",
            subject: "Besar",
            correctTarget: "Kecil",
            options: ["Panjang", "Kecil", "Tinggi"],
            explanation: "Lawan kata dari Besar adalah Kecil.",
            category: "Antonim",
            difficulty: "mudah"
        },
        {
            id: 6,
            topic: "Lawan Kata (Antonim)",
            subject: "Terang",
            correctTarget: "Gelap",
            options: ["Hitam", "Gelap", "Redup"],
            explanation: "Lawan kata dari Terang adalah Gelap.",
            category: "Antonim",
            difficulty: "mudah"
        },
        {
            id: 7,
            topic: "Aktivitas Sehari-hari",
            subject: "Adik",
            correctTarget: "Tidur",
            options: ["Bekerja", "Tidur", "Memasak"],
            explanation: "Saat malam tiba, Adik tidur nyenyak di kamarnya.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 8,
            topic: "Benda Langit",
            subject: "Matahari",
            correctTarget: "Bersinar",
            options: ["Hanyut", "Bersinar", "Berdengung"],
            explanation: "Matahari bersinar terang menyinari bumi di siang hari.",
            category: "Subjek - Predikat",
            difficulty: "sedang"
        },
        {
            id: 9,
            topic: "Lawan Kata (Antonim)",
            subject: "Bersih",
            correctTarget: "Kotor",
            options: ["Kotor", "Basah", "Rapi"],
            explanation: "Lawan kata dari Bersih adalah Kotor.",
            category: "Antonim",
            difficulty: "mudah"
        },
        {
            id: 10,
            topic: "Tanaman & Lingkungan",
            subject: "Pohon",
            correctTarget: "Tumbuh",
            options: ["Tumbuh", "Berlari", "Bicara"],
            explanation: "Pohon disiram setiap hari agar tumbuh tinggi dan rindang.",
            category: "Subjek - Predikat",
            difficulty: "sedang"
        }
    ],

    // Fase B: Kelas 3 - 4 SD (Struktur SPOK & Sinonim/Antonim Menengah)
    "fase-b": [
        {
            id: 101,
            topic: "Profesi & Tugas (SPOK)",
            subject: "Dokter",
            correctTarget: "Mengobati",
            options: ["Mengajar", "Mengobati", "Merancang"],
            explanation: "Dokter bertugas mengobati pasien yang sedang sakit.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 102,
            topic: "Profesi & Tugas (SPOK)",
            subject: "Petani",
            correctTarget: "Menanam",
            options: ["Menangkap", "Menjahit", "Menanam"],
            explanation: "Petani menanam padi di sawah dengan tekun.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 103,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Giat",
            correctTarget: "Rajin",
            options: ["Malas", "Rajin", "Pintar"],
            explanation: "Sinonim dari 'Giat' adalah 'Rajin'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 104,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Pandai",
            correctTarget: "Cerdas",
            options: ["Cerdas", "Lincah", "Lambat"],
            explanation: "Sinonim dari 'Pandai' adalah 'Cerdas'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 105,
            topic: "Profesi & Keterangan (SPOK)",
            subject: "Guru",
            correctTarget: "Mendidik",
            options: ["Mendidik", "Membangun", "Menyanyi"],
            explanation: "Guru mendidik para siswa di sekolah dengan penuh kasih.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 106,
            topic: "Lawan Kata (Antonim)",
            subject: "Hemat",
            correctTarget: "Boros",
            options: ["Pelit", "Boros", "Kaya"],
            explanation: "Lawan kata dari 'Hemat' adalah 'Boros'.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 107,
            topic: "Lawan Kata (Antonim)",
            subject: "Jujur",
            correctTarget: "Bohong",
            options: ["Bohong", "Sopan", "Berani"],
            explanation: "Lawan kata dari 'Jujur' adalah 'Bohong' / 'Curang'.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 108,
            topic: "Aksi & Objek (SPOK)",
            subject: "Penulis",
            correctTarget: "Mengarang",
            options: ["Melukis", "Mengarang", "Memotong"],
            explanation: "Penulis mengarang cerita dongeng yang menarik.",
            category: "Struktur SPOK",
            difficulty: "sulit"
        },
        {
            id: 109,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Indah",
            correctTarget: "Elok",
            options: ["Bagus", "Elok", "Megah"],
            explanation: "Sinonim dari kata 'Indah' salah satunya adalah 'Elok'.",
            category: "Sinonim",
            difficulty: "sulit"
        },
        {
            id: 110,
            topic: "Aksi & Lingkungan (SPOK)",
            subject: "Nelayan",
            correctTarget: "Melaut",
            options: ["Melaut", "Membajak", "Menambang"],
            explanation: "Nelayan melaut mencari ikan di tengah samudra.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        }
    ]
};

/**
 * Service untuk memuat kata (Word Repository)
 * Mensimulasikan fetch ke Cloudflare Workers & Pages Functions API (`/api/words`),
 * dengan fallback ke data statis lokal jika berjalan secara offline.
 */
class WordRepository {
    constructor() {
        this.cache = {};
    }

    async getWordsByPhase(phase = 'fase-a') {
        if (this.cache[phase]) {
            return this.shuffleArray([...this.cache[phase]]);
        }

        // Coba request ke Cloudflare Pages Functions / Workers endpoint
        try {
            const res = await fetch(`/api/words?phase=${encodeURIComponent(phase)}`, {
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                const json = await res.json();
                if (json && json.data && json.data.length > 0) {
                    this.cache[phase] = json.data;
                    return this.shuffleArray([...json.data]);
                }
            }
        } catch (e) {
            console.info("Workers API belum aktif atau running offline, menggunakan mock data lokal.", e.message);
        }

        // Fallback offline / static D1 mock data
        const localData = CURRICULUM_DATA[phase] || CURRICULUM_DATA['fase-a'];
        this.cache[phase] = localData;
        return this.shuffleArray([...localData]);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

window.wordRepo = new WordRepository();
