/**
 * Cloudflare Worker Entry Point: _worker.js
 * Kompatibel dengan Cloudflare Workers (dengan Static Assets) & Cloudflare Pages.
 * 
 * Menangani:
 * - /api/words        : Bank soal Kurikulum Merdeka (Fase A: 25 Soal & Fase B: 25 Soal)
 * - /api/leaderboard  : Global Leaderboard & Rating Peneliti Cilik via D1 / mock
 * - Static Assets     : index.html, css/, js/ via env.ASSETS.fetch(request)
 */

// Bank Soal Lengkap & Menantang (50 Soal Kurikulum Merdeka)
const FALLBACK_WORDS_MOCK = {
    "fase-a": [
        { id: 1, topic: "Benda & Tindakannya", subject: "Bunga", correctTarget: "Mekar", options: ["Mekar", "Terbang", "Berenang"], explanation: "Bunga yang disiram dan terkena sinar matahari akan mekar indah!", category: "Subjek - Predikat" },
        { id: 2, topic: "Hewan & Suaranya", subject: "Kucing", correctTarget: "Mengeong", options: ["Menggonggong", "Mengeong", "Berkokok"], explanation: "Kucing bersuara mengeong: meong... meong!", category: "Subjek - Predikat" },
        { id: 3, topic: "Hewan & Gerakannya", subject: "Burung", correctTarget: "Terbang", options: ["Menyelam", "Merayap", "Terbang"], explanation: "Burung menggunakan kedua sayapnya untuk terbang di angkasa.", category: "Subjek - Predikat" },
        { id: 4, topic: "Hewan & Gerakannya", subject: "Ikan", correctTarget: "Berenang", options: ["Berenang", "Melompat", "Memanjat"], explanation: "Ikan berenang di dalam air menggunakan sirip dan ekornya.", category: "Subjek - Predikat" },
        { id: 5, topic: "Lawan Kata (Antonim)", subject: "Besar", correctTarget: "Kecil", options: ["Panjang", "Kecil", "Tinggi"], explanation: "Lawan kata (kebalikan) dari Besar adalah Kecil.", category: "Antonim" },
        { id: 6, topic: "Lawan Kata (Antonim)", subject: "Terang", correctTarget: "Gelap", options: ["Hitam", "Gelap", "Redup"], explanation: "Lawan kata dari Terang adalah Gelap.", category: "Antonim" },
        { id: 7, topic: "Aktivitas Sehari-hari", subject: "Adik", correctTarget: "Tidur", options: ["Bekerja", "Tidur", "Memasak"], explanation: "Saat malam tiba, Adik tidur nyenyak di tempat tidur.", category: "Subjek - Predikat" },
        { id: 8, topic: "Benda Langit", subject: "Matahari", correctTarget: "Bersinar", options: ["Hanyut", "Bersinar", "Berdengung"], explanation: "Matahari bersinar menerangi bumi dan memberi kehangatan di siang hari.", category: "Subjek - Predikat" },
        { id: 9, topic: "Lawan Kata (Antonim)", subject: "Bersih", correctTarget: "Kotor", options: ["Kotor", "Basah", "Rapi"], explanation: "Lawan kata dari Bersih adalah Kotor.", category: "Antonim" },
        { id: 10, topic: "Tanaman & Lingkungan", subject: "Pohon", correctTarget: "Tumbuh", options: ["Tumbuh", "Berlari", "Bicara"], explanation: "Pohon yang dirawat dengan baik akan tumbuh subur dan rindang.", category: "Subjek - Predikat" },
        { id: 11, topic: "Panca Indera", subject: "Mata", correctTarget: "Melihat", options: ["Melihat", "Mendengar", "Meraba"], explanation: "Mata adalah indera penglihatan untuk melihat benda di sekitar kita.", category: "Fungsi Benda" },
        { id: 12, topic: "Panca Indera", subject: "Telinga", correctTarget: "Mendengar", options: ["Mengecap", "Mendengar", "Mencium"], explanation: "Telinga kita gunakan untuk mendengarkan suara dan musik yang merdu.", category: "Fungsi Benda" },
        { id: 13, topic: "Gejala Alam", subject: "Hujan", correctTarget: "Turun", options: ["Terbakar", "Turun", "Menyala"], explanation: "Tetesan air hujan turun dari awan ke permukaan bumi.", category: "Subjek - Predikat" },
        { id: 14, topic: "Hewan & Suaranya", subject: "Ayam Jantan", correctTarget: "Berkokok", options: ["Berkokok", "Mengaum", "Menciap"], explanation: "Ayam jantan berkokok di pagi hari: kukuruyuk!", category: "Subjek - Predikat" },
        { id: 15, topic: "Hewan & Gerakannya", subject: "Katak", correctTarget: "Melompat", options: ["Terbang", "Melompat", "Meluncur"], explanation: "Katak bergerak dengan cara melompat menggunakan kakinya yang kuat.", category: "Subjek - Predikat" },
        { id: 16, topic: "Rasa & Makanan", subject: "Gula", correctTarget: "Manis", options: ["Pahit", "Asin", "Manis"], explanation: "Gula memberikan rasa manis pada minuman teh dan kue.", category: "Sifat Benda" },
        { id: 17, topic: "Rasa & Makanan", subject: "Cabai", correctTarget: "Pedas", options: ["Asam", "Pedas", "Manis"], explanation: "Cabai memiliki rasa pedas yang membuat lidah terasa hangat.", category: "Sifat Benda" },
        { id: 18, topic: "Lawan Kata (Antonim)", subject: "Panas", correctTarget: "Dingin", options: ["Hangat", "Dingin", "Sejuk"], explanation: "Lawan kata dari Panas adalah Dingin (seperti es).", category: "Antonim" },
        { id: 19, topic: "Lawan Kata (Antonim)", subject: "Cepat", correctTarget: "Lambat", options: ["Pelan", "Lambat", "Tenang"], explanation: "Lawan kata dari Cepat adalah Lambat (seperti jalannya kura-kura).", category: "Antonim" },
        { id: 20, topic: "Alat Tulis & Fungsi", subject: "Pensil", correctTarget: "Menulis", options: ["Menghapus", "Menulis", "Menggunting"], explanation: "Pensil digunakan murid untuk menulis huruf dan menggambar.", category: "Fungsi Benda" },
        { id: 21, topic: "Peralatan & Fungsi", subject: "Gunting", correctTarget: "Memotong", options: ["Menempel", "Memotong", "Menggaris"], explanation: "Gunting adalah alat tajam yang berfungsi memotong kertas atau kain.", category: "Fungsi Benda" },
        { id: 22, topic: "Aktivitas Belajar", subject: "Murid", correctTarget: "Belajar", options: ["Belajar", "Bekerja", "Berlayar"], explanation: "Murid pergi ke sekolah untuk belajar bersama guru dan teman-teman.", category: "Subjek - Predikat" },
        { id: 23, topic: "Hewan & Suaranya", subject: "Singa", correctTarget: "Mengaum", options: ["Meringkik", "Mengaum", "Mendengkur"], explanation: "Singa si raja hutan bersuara dengan cara mengaum keras.", category: "Subjek - Predikat" },
        { id: 24, topic: "Lawan Kata (Antonim)", subject: "Tinggi", correctTarget: "Rendah", options: ["Pendek", "Rendah", "Kecil"], explanation: "Lawan kata dari posisi Tinggi adalah Rendah.", category: "Antonim" },
        { id: 25, topic: "Benda Langit Malam", subject: "Bintang", correctTarget: "Berkelip", options: ["Membeku", "Berkelip", "Berdesir"], explanation: "Bintang di langit malam yang cerah tampak berkelip-kelip indah.", category: "Subjek - Predikat" }
    ],
    "fase-b": [
        { id: 101, topic: "Profesi & Tugas (SPOK)", subject: "Dokter", correctTarget: "Mengobati", options: ["Mengajar", "Mengobati", "Merancang"], explanation: "Dokter bertugas memeriksa dan mengobati pasien yang sedang sakit.", category: "Struktur SPOK" },
        { id: 102, topic: "Profesi & Tugas (SPOK)", subject: "Petani", correctTarget: "Menanam", options: ["Menangkap", "Menjahit", "Menanam"], explanation: "Petani menanam bibit padi di sawah dengan tekun.", category: "Struktur SPOK" },
        { id: 103, topic: "Persamaan Kata (Sinonim)", subject: "Giat", correctTarget: "Rajin", options: ["Malas", "Rajin", "Pintar"], explanation: "Sinonim (persamaan makna) dari kata 'Giat' adalah 'Rajin'.", category: "Sinonim" },
        { id: 104, topic: "Persamaan Kata (Sinonim)", subject: "Pandai", correctTarget: "Cerdas", options: ["Cerdas", "Lincah", "Lambat"], explanation: "Sinonim dari kata 'Pandai' adalah 'Cerdas' atau 'Pintar'.", category: "Sinonim" },
        { id: 105, topic: "Profesi & Tugas (SPOK)", subject: "Guru", correctTarget: "Mendidik", options: ["Mendidik", "Membangun", "Menyanyi"], explanation: "Guru mendidik dan mengajar para siswa di sekolah dengan kasih sayang.", category: "Struktur SPOK" },
        { id: 106, topic: "Lawan Kata (Antonim)", subject: "Hemat", correctTarget: "Boros", options: ["Pelit", "Boros", "Kaya"], explanation: "Lawan kata dari sifat 'Hemat' adalah 'Boros'.", category: "Antonim" },
        { id: 107, topic: "Lawan Kata (Antonim)", subject: "Jujur", correctTarget: "Bohong", options: ["Bohong", "Sopan", "Berani"], explanation: "Lawan kata dari sikap 'Jujur' adalah 'Bohong' atau 'Curang'.", category: "Antonim" },
        { id: 108, topic: "Profesi & Karya (SPOK)", subject: "Penulis", correctTarget: "Mengarang", options: ["Melukis", "Mengarang", "Memotong"], explanation: "Penulis mengarang cerita novel dan buku ilmu pengetahuan.", category: "Struktur SPOK" },
        { id: 109, topic: "Persamaan Kata (Sinonim)", subject: "Indah", correctTarget: "Elok", options: ["Bagus", "Elok", "Megah"], explanation: "Kata puitis yang bersinonim dengan 'Indah' salah satunya adalah 'Elok'.", category: "Sinonim" },
        { id: 110, topic: "Profesi & Aktivitas (SPOK)", subject: "Nelayan", correctTarget: "Melaut", options: ["Melaut", "Membajak", "Menambang"], explanation: "Nelayan melaut ke tengah samudra untuk menangkap ikan segar.", category: "Struktur SPOK" },
        { id: 111, topic: "Profesi & Tugas (SPOK)", subject: "Arsitek", correctTarget: "Merancang", options: ["Merancang", "Mengecat", "Mengelas"], explanation: "Arsitek bertugas merancang denah dan bentuk bangunan gedung.", category: "Struktur SPOK" },
        { id: 112, topic: "Profesi & Aktivitas (SPOK)", subject: "Koki", correctTarget: "Memasak", options: ["Menghias", "Memasak", "Mencuci"], explanation: "Koki profesional memasak berbagai hidangan lezat di restoran.", category: "Struktur SPOK" },
        { id: 113, topic: "Persamaan Kata (Sinonim)", subject: "Senang", correctTarget: "Gembira", options: ["Tertawa", "Gembira", "Bangga"], explanation: "Sinonim yang paling tepat untuk kata 'Senang' adalah 'Gembira'.", category: "Sinonim" },
        { id: 114, topic: "Persamaan Kata (Sinonim)", subject: "Luas", correctTarget: "Lapang", options: ["Panjang", "Lapang", "Tinggi"], explanation: "Sinonim dari tanah atau ruangan yang 'Luas' adalah 'Lapang'.", category: "Sinonim" },
        { id: 115, topic: "Lawan Kata (Antonim)", subject: "Pemberani", correctTarget: "Penakut", options: ["Pemalu", "Penakut", "Penyedih"], explanation: "Lawan kata dari sikap 'Pemberani' adalah 'Penakut'.", category: "Antonim" },
        { id: 116, topic: "Lawan Kata (Antonim)", subject: "Subur", correctTarget: "Tandus", options: ["Gersang", "Tandus", "Kering"], explanation: "Tanah yang tidak bisa ditumbuhi tanaman disebut tanah 'Tandus' (lawan dari Subur).", category: "Antonim" },
        { id: 117, topic: "Sains & Tumbuhan (SPOK)", subject: "Daun Hijau", correctTarget: "Fotosintesis", options: ["Fotosintesis", "Penguapan", "Pengendapan"], explanation: "Daun hijau melakukan fotosintesis dengan bantuan sinar matahari untuk menghasilkan makanan.", category: "Struktur SPOK" },
        { id: 118, topic: "Sains & Tubuh Manusia (SPOK)", subject: "Jantung", correctTarget: "Memompa", options: ["Menyaring", "Memompa", "Mencerna"], explanation: "Organ jantung manusia bertugas memompa darah bersih ke seluruh tubuh.", category: "Struktur SPOK" },
        { id: 119, topic: "Persamaan Kata (Sinonim)", subject: "Melihat", correctTarget: "Memandang", options: ["Melirik", "Memandang", "Menoleh"], explanation: "Salah satu sinonim kata 'Melihat' secara saksama adalah 'Memandang'.", category: "Sinonim" },
        { id: 120, topic: "Lawan Kata (Antonim)", subject: "Asli", correctTarget: "Palsu", options: ["Tiruan", "Palsu", "Bekas"], explanation: "Lawan kata dari barang yang 'Asli' (orisinil) adalah 'Palsu'.", category: "Antonim" },
        { id: 121, topic: "Profesi & Transportasi (SPOK)", subject: "Masinis", correctTarget: "Menjalankan", options: ["Menerbangkan", "Menjalankan", "Mengayuh"], explanation: "Masinis bertugas menjalankan dan mengemudikan kereta api penumpang.", category: "Struktur SPOK" },
        { id: 122, topic: "Profesi & Transportasi (SPOK)", subject: "Pilot", correctTarget: "Menerbangkan", options: ["Meluncurkan", "Menerbangkan", "Mengemudikan"], explanation: "Pilot mengemudikan dan menerbangkan pesawat terbang di udara.", category: "Struktur SPOK" },
        { id: 123, topic: "Persamaan Kata (Sinonim)", subject: "Pemberian", correctTarget: "Hadiah", options: ["Upah", "Hadiah", "Beli"], explanation: "Sesuatu yang diberikan dengan ikhlas disebut 'Pemberian' atau 'Hadiah'.", category: "Sinonim" },
        { id: 124, topic: "Lawan Kata (Antonim)", subject: "Kuno", correctTarget: "Modern", options: ["Canggih", "Modern", "Baru"], explanation: "Zaman sekarang yang serba mutakhir disebut 'Modern', kebalikan dari 'Kuno'.", category: "Antonim" },
        { id: 125, topic: "Peduli Lingkungan (SPOK)", subject: "Warga", correctTarget: "Mendaur Ulang", options: ["Membakar", "Mendaur Ulang", "Menimbun"], explanation: "Warga yang cinta lingkungan mendaur ulang sampah plastik menjadi barang berguna.", category: "Struktur SPOK" }
    ]
};

// Fallback Mock Leaderboard
const INITIAL_GLOBAL_MOCK = [
    { id: '1', name: "Aisyah Putri", school: "SD Bintang Mulia", avatar: "🐱", phase: "fase-b", score: 1450, stars: 3, tier: "Profesor Jenius 👑", rating: 5.0, date: "2026-09-05" },
    { id: '2', name: "Budi Santoso", school: "SD Negeri 1 Merdeka", avatar: "🤖", phase: "fase-a", score: 1320, stars: 3, tier: "Profesor Jenius 👑", rating: 5.0, date: "2026-09-04" },
    { id: '3', name: "Clara Wijaya", school: "SD Cendekia Harapan", avatar: "🐰", phase: "fase-b", score: 1180, stars: 3, tier: "Profesor Jenius 👑", rating: 4.9, date: "2026-09-05" },
    { id: '4', name: "Dimas Arya", school: "SD Teladan Bangsa", avatar: "🐱", phase: "fase-a", score: 980, stars: 3, tier: "Peneliti Handal 🌟", rating: 4.7, date: "2026-09-03" },
    { id: '5', name: "Fathir Rizky", school: "SDIT Al-Falah", avatar: "🤖", phase: "fase-b", score: 920, stars: 2, tier: "Peneliti Handal 🌟", rating: 4.5, date: "2026-09-06" }
];

function calculateRatingAndTier(score) {
    if (score >= 1000) return { tier: "Profesor Jenius 👑", rating: 5.0 };
    if (score >= 750) return { tier: "Peneliti Handal 🌟", rating: 4.5 };
    if (score >= 450) return { tier: "Eksplorer Cilik 🔬", rating: 3.5 };
    return { tier: "Ilmuwan Pemula 🌱", rating: 2.5 };
}

// Router API
async function handleApiWords(request, env) {
    const url = new URL(request.url);
    const phase = url.searchParams.get('phase') || 'fase-a';

    if (env && env.DB) {
        try {
            const query = `SELECT id, topic, subject, correct_target as correctTarget, options_json as options, explanation, category FROM word_pairs WHERE phase = ? ORDER BY RANDOM() LIMIT 10`;
            const { results } = await env.DB.prepare(query).bind(phase).all();
            const formatted = results.map(row => ({
                ...row,
                options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options
            }));
            return new Response(JSON.stringify({ success: true, source: 'Cloudflare D1', data: formatted }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (e) {
            console.warn("D1 Words query error:", e.message);
        }
    }

    const items = FALLBACK_WORDS_MOCK[phase] || FALLBACK_WORDS_MOCK['fase-a'];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return new Response(JSON.stringify({ success: true, source: 'Expanded Mock Data', phase, data: shuffled }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
}

async function handleApiLeaderboard(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const { name, school, avatar, phase, score, stars } = body;
            if (!name || typeof score !== 'number') {
                return new Response(JSON.stringify({ success: false, message: 'Data tidak valid' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            const evaluation = calculateRatingAndTier(score);
            const newRecord = {
                id: 'rec_' + Date.now(),
                name: name.slice(0, 20),
                school: (school || 'SD Merdeka Belajar').slice(0, 30),
                avatar: avatar || '🐱',
                phase: phase || 'fase-a',
                score: score,
                stars: stars || 1,
                tier: evaluation.tier,
                rating: evaluation.rating,
                date: new Date().toISOString().split('T')[0]
            };

            if (env && env.DB) {
                try {
                    const insertQuery = `INSERT INTO leaderboard (id, name, school, avatar, phase, score, stars, tier, rating, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    await env.DB.prepare(insertQuery).bind(
                        newRecord.id, newRecord.name, newRecord.school, newRecord.avatar,
                        newRecord.phase, newRecord.score, newRecord.stars, newRecord.tier,
                        newRecord.rating, newRecord.date
                    ).run();
                    return new Response(JSON.stringify({ success: true, savedTo: 'Cloudflare D1', record: newRecord }), {
                        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                    });
                } catch (e) {
                    console.warn("D1 Insert error:", e.message);
                }
            }

            INITIAL_GLOBAL_MOCK.unshift(newRecord);
            INITIAL_GLOBAL_MOCK.sort((a, b) => b.score - a.score);

            return new Response(JSON.stringify({ success: true, savedTo: 'Cache', record: newRecord }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (err) {
            return new Response(JSON.stringify({ success: false, error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // GET Leaderboard
    const phase = url.searchParams.get('phase') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    if (env && env.DB) {
        try {
            let query = `SELECT * FROM leaderboard`;
            let params = [];
            if (phase !== 'all') {
                query += ` WHERE phase = ?`;
                params.push(phase);
            }
            query += ` ORDER BY score DESC LIMIT ?`;
            params.push(limit);

            const { results } = await env.DB.prepare(query).bind(...params).all();
            return new Response(JSON.stringify({ success: true, source: 'Cloudflare D1', data: results }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (e) {
            console.warn("D1 Get Leaderboard error:", e.message);
        }
    }

    let filtered = [...INITIAL_GLOBAL_MOCK];
    if (phase !== 'all') {
        filtered = filtered.filter(i => i.phase === phase);
    }
    filtered.sort((a, b) => b.score - a.score);

    return new Response(JSON.stringify({ success: true, source: 'Mock Cache', data: filtered.slice(0, limit) }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
}

// Export default Worker Handler
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // API Routes
        if (url.pathname.startsWith('/api/words')) {
            return handleApiWords(request, env);
        }
        if (url.pathname.startsWith('/api/leaderboard')) {
            return handleApiLeaderboard(request, env);
        }

        // Static Assets (HTML, CSS, JS, Images, etc.)
        if (env.ASSETS) {
            return env.ASSETS.fetch(request);
        }

        return new Response("Not Found", { status: 404 });
    }
};
