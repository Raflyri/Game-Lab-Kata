/**
 * Bank Data Soal "Laboratorium Kata" (Expanded & Challenging)
 * Berdasarkan Kurikulum Merdeka (Bahasa Indonesia & Literasi SD)
 * - Fase A: Kelas 1-2 SD (Kosakata, Suara/Gerak Hewan, Indera, Antonim Dasar) - 25 Soal
 * - Fase B: Kelas 3-4 SD (Struktur SPOK, Sinonim, Antonim Lanjutan, Sains & Profesi) - 25 Soal
 *
 * Disiapkan untuk query Cloudflare D1 Database & Client-Side Offline Engine.
 */

const CURRICULUM_DATA = {
    // ================= FASE A (KELAS 1 - 2 SD) =================
    "fase-a": [
        {
            id: 1,
            topic: "Benda & Tindakannya",
            subject: "Bunga",
            correctTarget: "Mekar",
            options: ["Mekar", "Terbang", "Berenang"],
            explanation: "Bunga yang disiram dan terkena sinar matahari akan mekar indah!",
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
            explanation: "Burung menggunakan kedua sayapnya untuk terbang di angkasa.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 4,
            topic: "Hewan & Gerakannya",
            subject: "Ikan",
            correctTarget: "Berenang",
            options: ["Berenang", "Melompat", "Memanjat"],
            explanation: "Ikan berenang di dalam air menggunakan sirip dan ekornya.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 5,
            topic: "Lawan Kata (Antonim)",
            subject: "Besar",
            correctTarget: "Kecil",
            options: ["Panjang", "Kecil", "Tinggi"],
            explanation: "Lawan kata (kebalikan) dari Besar adalah Kecil.",
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
            explanation: "Saat malam tiba, Adik tidur nyenyak di tempat tidur.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 8,
            topic: "Benda Langit",
            subject: "Matahari",
            correctTarget: "Bersinar",
            options: ["Hanyut", "Bersinar", "Berdengung"],
            explanation: "Matahari bersinar menerangi bumi dan memberi kehangatan di siang hari.",
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
            explanation: "Pohon yang dirawat dengan baik akan tumbuh subur dan rindang.",
            category: "Subjek - Predikat",
            difficulty: "sedang"
        },
        {
            id: 11,
            topic: "Panca Indera",
            subject: "Mata",
            correctTarget: "Melihat",
            options: ["Melihat", "Mendengar", "Meraba"],
            explanation: "Mata adalah indera penglihatan untuk melihat benda di sekitar kita.",
            category: "Fungsi Benda",
            difficulty: "mudah"
        },
        {
            id: 12,
            topic: "Panca Indera",
            subject: "Telinga",
            correctTarget: "Mendengar",
            options: ["Mengecap", "Mendengar", "Mencium"],
            explanation: "Telinga kita gunakan untuk mendengarkan suara dan musik yang merdu.",
            category: "Fungsi Benda",
            difficulty: "mudah"
        },
        {
            id: 13,
            topic: "Gejala Alam",
            subject: "Hujan",
            correctTarget: "Turun",
            options: ["Terbakar", "Turun", "Menyala"],
            explanation: "Tetesan air hujan turun dari awan ke permukaan bumi.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 14,
            topic: "Hewan & Suaranya",
            subject: "Ayam Jantan",
            correctTarget: "Berkokok",
            options: ["Berkokok", "Mengaum", "Menciap"],
            explanation: "Ayam jantan berkokok di pagi hari: kukuruyuk!",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 15,
            topic: "Hewan & Gerakannya",
            subject: "Katak",
            correctTarget: "Melompat",
            options: ["Terbang", "Melompat", "Meluncur"],
            explanation: "Katak bergerak dengan cara melompat menggunakan kakinya yang kuat.",
            category: "Subjek - Predikat",
            difficulty: "sedang"
        },
        {
            id: 16,
            topic: "Rasa & Makanan",
            subject: "Gula",
            correctTarget: "Manis",
            options: ["Pahit", "Asin", "Manis"],
            explanation: "Gula memberikan rasa manis pada minuman teh dan kue.",
            category: "Sifat Benda",
            difficulty: "mudah"
        },
        {
            id: 17,
            topic: "Rasa & Makanan",
            subject: "Cabai",
            correctTarget: "Pedas",
            options: ["Asam", "Pedas", "Manis"],
            explanation: "Cabai memiliki rasa pedas yang membuat lidah terasa hangat.",
            category: "Sifat Benda",
            difficulty: "mudah"
        },
        {
            id: 18,
            topic: "Lawan Kata (Antonim)",
            subject: "Panas",
            correctTarget: "Dingin",
            options: ["Hangat", "Dingin", "Sejuk"],
            explanation: "Lawan kata dari Panas adalah Dingin (seperti es).",
            category: "Antonim",
            difficulty: "mudah"
        },
        {
            id: 19,
            topic: "Lawan Kata (Antonim)",
            subject: "Cepat",
            correctTarget: "Lambat",
            options: ["Pelan", "Lambat", "Tenang"],
            explanation: "Lawan kata dari Cepat adalah Lambat (seperti jalannya kura-kura).",
            category: "Antonim",
            difficulty: "mudah"
        },
        {
            id: 20,
            topic: "Alat Tulis & Fungsi",
            subject: "Pensil",
            correctTarget: "Menulis",
            options: ["Menghapus", "Menulis", "Menggunting"],
            explanation: "Pensil digunakan murid untuk menulis huruf dan menggambar.",
            category: "Fungsi Benda",
            difficulty: "mudah"
        },
        {
            id: 21,
            topic: "Peralatan & Fungsi",
            subject: "Gunting",
            correctTarget: "Memotong",
            options: ["Menempel", "Memotong", "Menggaris"],
            explanation: "Gunting adalah alat tajam yang berfungsi memotong kertas atau kain.",
            category: "Fungsi Benda",
            difficulty: "sedang"
        },
        {
            id: 22,
            topic: "Aktivitas Belajar",
            subject: "Murid",
            correctTarget: "Belajar",
            options: ["Belajar", "Bekerja", "Berlayar"],
            explanation: "Murid pergi ke sekolah untuk belajar bersama guru dan teman-teman.",
            category: "Subjek - Predikat",
            difficulty: "mudah"
        },
        {
            id: 23,
            topic: "Hewan & Suaranya",
            subject: "Singa",
            correctTarget: "Mengaum",
            options: ["Meringkik", "Mengaum", "Mendengkur"],
            explanation: "Singa si raja hutan bersuara dengan cara mengaum keras.",
            category: "Subjek - Predikat",
            difficulty: "sedang"
        },
        {
            id: 24,
            topic: "Lawan Kata (Antonim)",
            subject: "Tinggi",
            correctTarget: "Rendah",
            options: ["Pendek", "Rendah", "Kecil"],
            explanation: "Lawan kata dari posisi Tinggi adalah Rendah.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 25,
            topic: "Benda Langit Malam",
            subject: "Bintang",
            correctTarget: "Berkelip",
            options: ["Membeku", "Berkelip", "Berdesir"],
            explanation: "Bintang di langit malam yang cerah tampak berkelip-kelip indah.",
            category: "Subjek - Predikat",
            difficulty: "sedang"
        }
    ],

    // ================= FASE B (KELAS 3 - 4 SD) =================
    "fase-b": [
        {
            id: 101,
            topic: "Profesi & Tugas (SPOK)",
            subject: "Dokter",
            correctTarget: "Mengobati",
            options: ["Mengajar", "Mengobati", "Merancang"],
            explanation: "Dokter bertugas memeriksa dan mengobati pasien yang sedang sakit.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 102,
            topic: "Profesi & Tugas (SPOK)",
            subject: "Petani",
            correctTarget: "Menanam",
            options: ["Menangkap", "Menjahit", "Menanam"],
            explanation: "Petani menanam bibit padi di sawah dengan tekun.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 103,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Giat",
            correctTarget: "Rajin",
            options: ["Malas", "Rajin", "Pintar"],
            explanation: "Sinonim (persamaan makna) dari kata 'Giat' adalah 'Rajin'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 104,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Pandai",
            correctTarget: "Cerdas",
            options: ["Cerdas", "Lincah", "Lambat"],
            explanation: "Sinonim dari kata 'Pandai' adalah 'Cerdas' atau 'Pintar'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 105,
            topic: "Profesi & Tugas (SPOK)",
            subject: "Guru",
            correctTarget: "Mendidik",
            options: ["Mendidik", "Membangun", "Menyanyi"],
            explanation: "Guru mendidik dan mengajar para siswa di sekolah dengan kasih sayang.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 106,
            topic: "Lawan Kata (Antonim)",
            subject: "Hemat",
            correctTarget: "Boros",
            options: ["Pelit", "Boros", "Kaya"],
            explanation: "Lawan kata dari sifat 'Hemat' adalah 'Boros'.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 107,
            topic: "Lawan Kata (Antonim)",
            subject: "Jujur",
            correctTarget: "Bohong",
            options: ["Bohong", "Sopan", "Berani"],
            explanation: "Lawan kata dari sikap 'Jujur' adalah 'Bohong' atau 'Curang'.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 108,
            topic: "Profesi & Karya (SPOK)",
            subject: "Penulis",
            correctTarget: "Mengarang",
            options: ["Melukis", "Mengarang", "Memotong"],
            explanation: "Penulis mengarang cerita novel dan buku ilmu pengetahuan.",
            category: "Struktur SPOK",
            difficulty: "menantang"
        },
        {
            id: 109,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Indah",
            correctTarget: "Elok",
            options: ["Bagus", "Elok", "Megah"],
            explanation: "Kata puitis yang bersinonim dengan 'Indah' salah satunya adalah 'Elok'.",
            category: "Sinonim",
            difficulty: "menantang"
        },
        {
            id: 110,
            topic: "Profesi & Aktivitas (SPOK)",
            subject: "Nelayan",
            correctTarget: "Melaut",
            options: ["Melaut", "Membajak", "Menambang"],
            explanation: "Nelayan melaut ke tengah samudra untuk menangkap ikan segar.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 111,
            topic: "Profesi & Tugas (SPOK)",
            subject: "Arsitek",
            correctTarget: "Merancang",
            options: ["Merancang", "Mengecat", "Mengelas"],
            explanation: "Arsitek bertugas merancang denah dan bentuk bangunan gedung.",
            category: "Struktur SPOK",
            difficulty: "menantang"
        },
        {
            id: 112,
            topic: "Profesi & Aktivitas (SPOK)",
            subject: "Koki",
            correctTarget: "Memasak",
            options: ["Menghias", "Memasak", "Mencuci"],
            explanation: "Koki profesional memasak berbagai hidangan lezat di restoran.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 113,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Senang",
            correctTarget: "Gembira",
            options: ["Tertawa", "Gembira", "Bangga"],
            explanation: "Sinonim yang paling tepat untuk kata 'Senang' adalah 'Gembira'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 114,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Luas",
            correctTarget: "Lapang",
            options: ["Panjang", "Lapang", "Tinggi"],
            explanation: "Sinonim dari tanah atau ruangan yang 'Luas' adalah 'Lapang'.",
            category: "Sinonim",
            difficulty: "menantang"
        },
        {
            id: 115,
            topic: "Lawan Kata (Antonim)",
            subject: "Pemberani",
            correctTarget: "Penakut",
            options: ["Pemalu", "Penakut", "Penyedih"],
            explanation: "Lawan kata dari sikap 'Pemberani' adalah 'Penakut'.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 116,
            topic: "Lawan Kata (Antonim)",
            subject: "Subur",
            correctTarget: "Tandus",
            options: ["Gersang", "Tandus", "Kering"],
            explanation: "Tanah yang tidak bisa ditumbuhi tanaman disebut tanah 'Tandus' (lawan dari Subur).",
            category: "Antonim",
            difficulty: "menantang"
        },
        {
            id: 117,
            topic: "Sains & Tumbuhan (SPOK)",
            subject: "Daun Hijau",
            correctTarget: "Fotosintesis",
            options: ["Fotosintesis", "Penguapan", "Pengendapan"],
            explanation: "Daun hijau melakukan fotosintesis dengan bantuan sinar matahari untuk menghasilkan makanan.",
            category: "Struktur SPOK",
            difficulty: "menantang"
        },
        {
            id: 118,
            topic: "Sains & Tubuh Manusia (SPOK)",
            subject: "Jantung",
            correctTarget: "Memompa",
            options: ["Menyaring", "Memompa", "Mencerna"],
            explanation: "Organ jantung manusia bertugas memompa darah bersih ke seluruh tubuh.",
            category: "Struktur SPOK",
            difficulty: "menantang"
        },
        {
            id: 119,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Melihat",
            correctTarget: "Memandang",
            options: ["Melirik", "Memandang", "Menoleh"],
            explanation: "Salah satu sinonim kata 'Melihat' secara saksama adalah 'Memandang'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 120,
            topic: "Lawan Kata (Antonim)",
            subject: "Asli",
            correctTarget: "Palsu",
            options: ["Tiruan", "Palsu", "Bekas"],
            explanation: "Lawan kata dari barang yang 'Asli' (orisinil) adalah 'Palsu'.",
            category: "Antonim",
            difficulty: "sedang"
        },
        {
            id: 121,
            topic: "Profesi & Transportasi (SPOK)",
            subject: "Masinis",
            correctTarget: "Menjalankan",
            options: ["Menerbangkan", "Menjalankan", "Mengayuh"],
            explanation: "Masinis bertugas menjalankan dan mengemudikan kereta api penumpang.",
            category: "Struktur SPOK",
            difficulty: "menantang"
        },
        {
            id: 122,
            topic: "Profesi & Transportasi (SPOK)",
            subject: "Pilot",
            correctTarget: "Menerbangkan",
            options: ["Meluncurkan", "Menerbangkan", "Mengemudikan"],
            explanation: "Pilot mengemudikan dan menerbangkan pesawat terbang di udara.",
            category: "Struktur SPOK",
            difficulty: "sedang"
        },
        {
            id: 123,
            topic: "Persamaan Kata (Sinonim)",
            subject: "Pemberian",
            correctTarget: "Hadiah",
            options: ["Upah", "Hadiah", "Beli"],
            explanation: "Sesuatu yang diberikan dengan ikhlas disebut 'Pemberian' atau 'Hadiah'.",
            category: "Sinonim",
            difficulty: "sedang"
        },
        {
            id: 124,
            topic: "Lawan Kata (Antonim)",
            subject: "Kuno",
            correctTarget: "Modern",
            options: ["Canggih", "Modern", "Baru"],
            explanation: "Zaman sekarang yang serba mutakhir disebut 'Modern', kebalikan dari 'Kuno'.",
            category: "Antonim",
            difficulty: "menantang"
        },
        {
            id: 125,
            topic: "Peduli Lingkungan (SPOK)",
            subject: "Warga",
            correctTarget: "Mendaur Ulang",
            options: ["Membakar", "Mendaur Ulang", "Menimbun"],
            explanation: "Warga yang cinta lingkungan mendaur ulang sampah plastik menjadi barang berguna.",
            category: "Struktur SPOK",
            difficulty: "menantang"
        }
    ]
};

/**
 * Service untuk memuat kata (Word Repository)
 * Mengambil data dari endpoint Cloudflare API (/api/words)
 * atau menggunakan bank soal lengkap lokal secara acak.
 */
class WordRepository {
    constructor() {
        this.cache = {};
    }

    async getWordsByPhase(phase = 'fase-a') {
        if (this.cache[phase]) {
            return this.shuffleArray([...this.cache[phase]]);
        }

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
            console.info("Workers API belum aktif atau running offline, menggunakan bank soal lokal lengkap.", e.message);
        }

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
