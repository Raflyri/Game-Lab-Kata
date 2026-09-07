/**
 * Cloudflare Pages Function: /api/words
 * Mensimulasikan query database Cloudflare D1 untuk bank soal "Laboratorium Kata"
 * 
 * Jika binding D1 (`env.DB`) tersedia:
 * Akan mengeksekusi kueri D1:
 *   const { results } = await env.DB.prepare("SELECT * FROM words WHERE phase = ? ORDER BY RANDOM() LIMIT 10").bind(phase).all();
 * 
 * Jika berjalan tanpa database D1 (statik / preview mode):
 * Akan mengembalikan mock data Kurikulum Merdeka terstruktur dalam JSON.
 */

const FALLBACK_D1_MOCK = {
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

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const phase = url.searchParams.get('phase') || 'fase-a';

    // 1. Jika Cloudflare D1 terkonfigurasi di env.DB
    if (env && env.DB) {
        try {
            const query = `
                SELECT id, topic, subject, correct_target as correctTarget, 
                       options_json as options, explanation, category 
                FROM word_pairs 
                WHERE phase = ? 
                ORDER BY RANDOM() 
                LIMIT 10
            `;
            const { results } = await env.DB.prepare(query).bind(phase).all();
            
            // Format options dari JSON string jika disimpan sebagai text
            const formatted = results.map(row => ({
                ...row,
                options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options
            }));

            return new Response(JSON.stringify({ success: true, source: 'Cloudflare D1', data: formatted }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } catch (err) {
            console.error('Kueri D1 gagal, beralih ke mock fallback:', err);
        }
    }

    // 2. Fallback jika D1 belum diikat (Local preview / Pages static)
    const items = FALLBACK_D1_MOCK[phase] || FALLBACK_D1_MOCK['fase-a'];
    return new Response(JSON.stringify({
        success: true,
        source: 'Cloudflare D1 Simulation Mock',
        phase: phase,
        data: items
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
