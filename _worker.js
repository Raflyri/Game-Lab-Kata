/**
 * Cloudflare Worker Entry Point: _worker.js
 * Kompatibel dengan Cloudflare Workers (dengan Static Assets) & Cloudflare Pages.
 * 
 * Menangani:
 * - /api/words        : Bank soal Kurikulum Merdeka (Fase A & B) via D1 / mock
 * - /api/leaderboard  : Global Leaderboard & Rating Peneliti Cilik via D1 / mock
 * - Static Assets     : index.html, css/, js/ via env.ASSETS.fetch(request)
 */

// Fallback Mock Bank Soal Kurikulum Merdeka
const FALLBACK_WORDS_MOCK = {
    "fase-a": [
        { id: 1, topic: "Benda & Tindakannya", subject: "Bunga", correctTarget: "Mekar", options: ["Mekar", "Terbang", "Berenang"], explanation: "Bunga yang indah akan mekar di taman!", category: "Subjek - Predikat" },
        { id: 2, topic: "Hewan & Suaranya", subject: "Kucing", correctTarget: "Mengeong", options: ["Menggonggong", "Mengeong", "Berkokok"], explanation: "Kucing bersuara mengeong: meong... meong!", category: "Subjek - Predikat" },
        { id: 3, topic: "Hewan & Gerakannya", subject: "Burung", correctTarget: "Terbang", options: ["Menyelam", "Merayap", "Terbang"], explanation: "Burung menggunakan sayapnya untuk terbang di langit.", category: "Subjek - Predikat" },
        { id: 4, topic: "Hewan & Gerakannya", subject: "Ikan", correctTarget: "Berenang", options: ["Berenang", "Melompat", "Memanjat"], explanation: "Ikan berenang di dalam air menggunakan siripnya.", category: "Subjek - Predikat" },
        { id: 5, topic: "Lawan Kata (Antonim)", subject: "Besar", correctTarget: "Kecil", options: ["Panjang", "Kecil", "Tinggi"], explanation: "Lawan kata dari Besar adalah Kecil.", category: "Antonim" },
        { id: 6, topic: "Lawan Kata (Antonim)", subject: "Terang", correctTarget: "Gelap", options: ["Hitam", "Gelap", "Redup"], explanation: "Lawan kata dari Terang adalah Gelap.", category: "Antonim" },
        { id: 7, topic: "Aktivitas Sehari-hari", subject: "Adik", correctTarget: "Tidur", options: ["Bekerja", "Tidur", "Memasak"], explanation: "Saat malam tiba, Adik tidur nyenyak di kamarnya.", category: "Subjek - Predikat" },
        { id: 8, topic: "Benda Langit", subject: "Matahari", correctTarget: "Bersinar", options: ["Hanyut", "Bersinar", "Berdengung"], explanation: "Matahari bersinar terang menyinari bumi di siang hari.", category: "Subjek - Predikat" }
    ],
    "fase-b": [
        { id: 101, topic: "Profesi & Tugas (SPOK)", subject: "Dokter", correctTarget: "Mengobati", options: ["Mengajar", "Mengobati", "Merancang"], explanation: "Dokter bertugas mengobati pasien yang sedang sakit.", category: "Struktur SPOK" },
        { id: 102, topic: "Profesi & Tugas (SPOK)", subject: "Petani", correctTarget: "Menanam", options: ["Menangkap", "Menjahit", "Menanam"], explanation: "Petani menanam padi di sawah dengan tekun.", category: "Struktur SPOK" },
        { id: 103, topic: "Persamaan Kata (Sinonim)", subject: "Giat", correctTarget: "Rajin", options: ["Malas", "Rajin", "Pintar"], explanation: "Sinonim dari 'Giat' adalah 'Rajin'.", category: "Sinonim" },
        { id: 104, topic: "Persamaan Kata (Sinonim)", subject: "Pandai", correctTarget: "Cerdas", options: ["Cerdas", "Lincah", "Lambat"], explanation: "Sinonim dari 'Pandai' adalah 'Cerdas'.", category: "Sinonim" },
        { id: 105, topic: "Profesi & Keterangan (SPOK)", subject: "Guru", correctTarget: "Mendidik", options: ["Mendidik", "Membangun", "Menyanyi"], explanation: "Guru mendidik para siswa di sekolah dengan penuh kasih.", category: "Struktur SPOK" },
        { id: 106, topic: "Lawan Kata (Antonim)", subject: "Hemat", correctTarget: "Boros", options: ["Pelit", "Boros", "Kaya"], explanation: "Lawan kata dari 'Hemat' adalah 'Boros'.", category: "Antonim" },
        { id: 107, topic: "Lawan Kata (Antonim)", subject: "Jujur", correctTarget: "Bohong", options: ["Bohong", "Sopan", "Berani"], explanation: "Lawan kata dari 'Jujur' adalah 'Bohong'.", category: "Antonim" },
        { id: 108, topic: "Aksi & Objek (SPOK)", subject: "Penulis", correctTarget: "Mengarang", options: ["Melukis", "Mengarang", "Memotong"], explanation: "Penulis mengarang cerita dongeng yang menarik.", category: "Struktur SPOK" }
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
    return new Response(JSON.stringify({ success: true, source: 'Mock Data', phase, data: items }), {
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
