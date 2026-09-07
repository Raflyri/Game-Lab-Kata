-- Skema Database Cloudflare D1 untuk "Laboratorium Kata"
-- Simpan tabel ini dengan menjalankan: npx wrangler d1 execute laboratorium-kata-db --file=./schema.sql

-- 1. Tabel Papan Peringkat Global (Leaderboard & Rating)
CREATE TABLE IF NOT EXISTS leaderboard (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    school TEXT DEFAULT 'SD Merdeka Belajar',
    avatar TEXT DEFAULT '🐱',
    phase TEXT NOT NULL,
    score INTEGER NOT NULL,
    stars INTEGER DEFAULT 1,
    tier TEXT NOT NULL,
    rating REAL NOT NULL,
    date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_phase ON leaderboard(phase, score DESC);

-- 2. Data Awal Papan Peringkat (Initial Seed)
INSERT OR IGNORE INTO leaderboard (id, name, school, avatar, phase, score, stars, tier, rating, date) VALUES
('seed_1', 'Aisyah Putri', 'SD Bintang Mulia', '🐱', 'fase-b', 1450, 3, 'Profesor Jenius 👑', 5.0, '2026-09-05'),
('seed_2', 'Budi Santoso', 'SD Negeri 1 Merdeka', '🤖', 'fase-a', 1320, 3, 'Profesor Jenius 👑', 5.0, '2026-09-04'),
('seed_3', 'Clara Wijaya', 'SD Cendekia Harapan', '🐰', 'fase-b', 1180, 3, 'Profesor Jenius 👑', 4.9, '2026-09-05'),
('seed_4', 'Dimas Arya', 'SD Teladan Bangsa', '🐱', 'fase-a', 980, 3, 'Peneliti Handal 🌟', 4.7, '2026-09-03'),
('seed_5', 'Fathir Rizky', 'SDIT Al-Falah', '🤖', 'fase-b', 920, 2, 'Peneliti Handal 🌟', 4.5, '2026-09-06'),
('seed_6', 'Gita Larasati', 'SD Pelita Hati', '🐰', 'fase-a', 850, 2, 'Peneliti Handal 🌟', 4.3, '2026-09-02'),
('seed_7', 'Hafiz Maulana', 'SD Nusantara', '🐱', 'fase-b', 710, 2, 'Eksplorer Cilik 🔬', 3.9, '2026-09-01'),
('seed_8', 'Indah Permata', 'SD Mentari Kids', '🐰', 'fase-a', 640, 2, 'Eksplorer Cilik 🔬', 3.7, '2026-09-06'),
('seed_9', 'Joko Satria', 'SD Taruna Jaya', '🤖', 'fase-a', 490, 1, 'Eksplorer Cilik 🔬', 3.2, '2026-08-30'),
('seed_10', 'Kania Dewi', 'SD Kreatif Mandiri', '🐱', 'fase-b', 380, 1, 'Ilmuwan Pemula 🌱', 2.8, '2026-08-29');

-- 3. Tabel Bank Soal Kurikulum Merdeka (Opsional jika ingin soal diatur via D1)
CREATE TABLE IF NOT EXISTS word_pairs (
    id INTEGER PRIMARY KEY,
    phase TEXT NOT NULL,
    topic TEXT NOT NULL,
    subject TEXT NOT NULL,
    correct_target TEXT NOT NULL,
    options_json TEXT NOT NULL,
    explanation TEXT NOT NULL,
    category TEXT NOT NULL
);

INSERT OR IGNORE INTO word_pairs (id, phase, topic, subject, correct_target, options_json, explanation, category) VALUES
(1, 'fase-a', 'Benda & Tindakannya', 'Bunga', 'Mekar', '["Mekar", "Terbang", "Berenang"]', 'Bunga yang indah akan mekar di taman!', 'Subjek - Predikat'),
(2, 'fase-a', 'Hewan & Suaranya', 'Kucing', 'Mengeong', '["Menggonggong", "Mengeong", "Berkokok"]', 'Kucing bersuara mengeong: meong... meong!', 'Subjek - Predikat'),
(3, 'fase-a', 'Hewan & Gerakannya', 'Burung', 'Terbang', '["Menyelam", "Merayap", "Terbang"]', 'Burung menggunakan sayapnya untuk terbang di langit.', 'Subjek - Predikat'),
(4, 'fase-a', 'Hewan & Gerakannya', 'Ikan', 'Berenang', '["Berenang", "Melompat", "Memanjat"]', 'Ikan berenang di dalam air menggunakan siripnya.', 'Subjek - Predikat'),
(5, 'fase-a', 'Lawan Kata (Antonim)', 'Besar', 'Kecil', '["Panjang", "Kecil", "Tinggi"]', 'Lawan kata dari Besar adalah Kecil.', 'Antonim'),
(101, 'fase-b', 'Profesi & Tugas (SPOK)', 'Dokter', 'Mengobati', '["Mengajar", "Mengobati", "Merancang"]', 'Dokter bertugas mengobati pasien yang sedang sakit.', 'Struktur SPOK'),
(102, 'fase-b', 'Profesi & Tugas (SPOK)', 'Petani', 'Menanam', '["Menangkap", "Menjahit", "Menanam"]', 'Petani menanam padi di sawah dengan tekun.', 'Struktur SPOK'),
(103, 'fase-b', 'Persamaan Kata (Sinonim)', 'Giat', 'Rajin', '["Malas", "Rajin", "Pintar"]', 'Sinonim dari Giat adalah Rajin.', 'Sinonim'),
(104, 'fase-b', 'Persamaan Kata (Sinonim)', 'Pandai', 'Cerdas', '["Cerdas", "Lincah", "Lambat"]', 'Sinonim dari Pandai adalah Cerdas.', 'Sinonim'),
(105, 'fase-b', 'Profesi & Keterangan (SPOK)', 'Guru', 'Mendidik', '["Mendidik", "Membangun", "Menyanyi"]', 'Guru mendidik para siswa di sekolah dengan penuh kasih.', 'Struktur SPOK');
