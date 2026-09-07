/**
 * Cloudflare Pages Function: /api/leaderboard
 * Menyediakan layanan Papan Peringkat Global (Global Leaderboard) & Sistem Rating Peneliti Cilik
 * untuk game "Laboratorium Kata".
 * 
 * Fitur:
 * - GET: Mengambil daftar skor tertinggi global (filter berdasarkan fase atau semua)
 * - POST: Menyimpan skor baru dengan perhitungan Rating Peneliti secara otomatis
 * - Didukung Cloudflare D1 / KV jika tersedia, dengan fallback data mock nasional yang realistis.
 */

// Data simulasi awal peneliti cilik dari berbagai sekolah di Indonesia
const INITIAL_GLOBAL_MOCK = [
    { id: '1', name: "Aisyah Putri", school: "SD Bintang Mulia", avatar: "🐱", phase: "fase-b", score: 1450, stars: 3, tier: "Profesor Jenius 👑", rating: 5.0, date: "2026-09-05" },
    { id: '2', name: "Budi Santoso", school: "SD Negeri 1 Merdeka", avatar: "🤖", phase: "fase-a", score: 1320, stars: 3, tier: "Profesor Jenius 👑", rating: 5.0, date: "2026-09-04" },
    { id: '3', name: "Clara Wijaya", school: "SD Cendekia Harapan", avatar: "🐰", phase: "fase-b", score: 1180, stars: 3, tier: "Profesor Jenius 👑", rating: 4.9, date: "2026-09-05" },
    { id: '4', name: "Dimas Arya", school: "SD Teladan Bangsa", avatar: "🐱", phase: "fase-a", score: 980, stars: 3, tier: "Peneliti Handal 🌟", rating: 4.7, date: "2026-09-03" },
    { id: '5', name: "Fathir Rizky", school: "SDIT Al-Falah", avatar: "🤖", phase: "fase-b", score: 920, stars: 2, tier: "Peneliti Handal 🌟", rating: 4.5, date: "2026-09-06" },
    { id: '6', name: "Gita Larasati", school: "SD Pelita Hati", avatar: "🐰", phase: "fase-a", score: 850, stars: 2, tier: "Peneliti Handal 🌟", rating: 4.3, date: "2026-09-02" },
    { id: '7', name: "Hafiz Maulana", school: "SD Nusantara", avatar: "🐱", phase: "fase-b", score: 710, stars: 2, tier: "Eksplorer Cilik 🔬", rating: 3.9, date: "2026-09-01" },
    { id: '8', name: "Indah Permata", school: "SD Mentari Kids", avatar: "🐰", phase: "fase-a", score: 640, stars: 2, tier: "Eksplorer Cilik 🔬", rating: 3.7, date: "2026-09-06" },
    { id: '9', name: "Joko Satria", school: "SD Taruna Jaya", avatar: "🤖", phase: "fase-a", score: 490, stars: 1, tier: "Eksplorer Cilik 🔬", rating: 3.2, date: "2026-08-30" },
    { id: '10', name: "Kania Dewi", school: "SD Kreatif Mandiri", avatar: "🐱", phase: "fase-b", score: 380, stars: 1, tier: "Ilmuwan Pemula 🌱", rating: 2.8, date: "2026-08-29" }
];

// Helper untuk menghitung gelar rating berdasarkan perolehan skor
function calculateRatingAndTier(score) {
    if (score >= 1000) {
        return { tier: "Profesor Jenius 👑", rating: 5.0, label: "Luar Biasa!" };
    } else if (score >= 750) {
        return { tier: "Peneliti Handal 🌟", rating: 4.5, label: "Sangat Bagus!" };
    } else if (score >= 450) {
        return { tier: "Eksplorer Cilik 🔬", rating: 3.5, label: "Bagus!" };
    } else {
        return { tier: "Ilmuwan Pemula 🌱", rating: 2.5, label: "Semangat Belajar!" };
    }
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const phase = url.searchParams.get('phase') || 'all'; // 'all', 'fase-a', 'fase-b'
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    // 1. Coba ambil dari Cloudflare D1 Database jika ada binding
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
            return new Response(JSON.stringify({
                success: true,
                source: 'Cloudflare D1',
                data: results
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } catch (e) {
            console.warn("Kueri D1 leaderboard gagal, menggunakan fallback:", e.message);
        }
    }

    // 2. Fallback Simulasi Global Mock Data
    let filtered = [...INITIAL_GLOBAL_MOCK];
    if (phase !== 'all') {
        filtered = filtered.filter(item => item.phase === phase);
    }
    filtered.sort((a, b) => b.score - a.score);
    const resultList = filtered.slice(0, limit);

    return new Response(JSON.stringify({
        success: true,
        source: 'Global Simulation Mock',
        phase: phase,
        totalEntries: 1240, // Simulasi jumlah peneliti terdaftar secara nasional
        data: resultList
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { name, school, avatar, phase, score, stars } = body;

        if (!name || typeof score !== 'number') {
            return new Response(JSON.stringify({ success: false, message: 'Data nama dan skor tidak valid' }), {
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

        // 1. Simpan ke Cloudflare D1 jika tersedia
        if (env && env.DB) {
            try {
                const insertQuery = `
                    INSERT INTO leaderboard (id, name, school, avatar, phase, score, stars, tier, rating, date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                await env.DB.prepare(insertQuery).bind(
                    newRecord.id, newRecord.name, newRecord.school, newRecord.avatar,
                    newRecord.phase, newRecord.score, newRecord.stars, newRecord.tier,
                    newRecord.rating, newRecord.date
                ).run();

                return new Response(JSON.stringify({ success: true, savedTo: 'Cloudflare D1', record: newRecord }), {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            } catch (err) {
                console.warn("Insert D1 gagal:", err);
            }
        }

        // 2. Simpan sementara ke mock data list
        INITIAL_GLOBAL_MOCK.unshift(newRecord);
        INITIAL_GLOBAL_MOCK.sort((a, b) => b.score - a.score);

        return new Response(JSON.stringify({
            success: true,
            savedTo: 'Simulation Cache',
            record: newRecord,
            globalRank: INITIAL_GLOBAL_MOCK.findIndex(r => r.id === newRecord.id) + 1
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
