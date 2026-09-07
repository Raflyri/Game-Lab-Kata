-- Skema Database Cloudflare D1 untuk "Laboratorium Kata"
-- Simpan tabel ini dengan menjalankan: npx wrangler d1 execute laboratorium-kata-db --file=./schema.sql --remote

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

-- 3. Tabel Bank Soal Kurikulum Merdeka (50 Soal: Fase A & Fase B)
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

-- Bank Soal Fase A (Kelas 1-2 SD)
INSERT OR IGNORE INTO word_pairs (id, phase, topic, subject, correct_target, options_json, explanation, category) VALUES
(1, 'fase-a', 'Benda & Tindakannya', 'Bunga', 'Mekar', '["Mekar", "Terbang", "Berenang"]', 'Bunga yang disiram dan terkena sinar matahari akan mekar indah!', 'Subjek - Predikat'),
(2, 'fase-a', 'Hewan & Suaranya', 'Kucing', 'Mengeong', '["Menggonggong", "Mengeong", "Berkokok"]', 'Kucing bersuara mengeong: meong... meong!', 'Subjek - Predikat'),
(3, 'fase-a', 'Hewan & Gerakannya', 'Burung', 'Terbang', '["Menyelam", "Merayap", "Terbang"]', 'Burung menggunakan kedua sayapnya untuk terbang di angkasa.', 'Subjek - Predikat'),
(4, 'fase-a', 'Hewan & Gerakannya', 'Ikan', 'Berenang', '["Berenang", "Melompat", "Memanjat"]', 'Ikan berenang di dalam air menggunakan sirip dan ekornya.', 'Subjek - Predikat'),
(5, 'fase-a', 'Lawan Kata (Antonim)', 'Besar', 'Kecil', '["Panjang", "Kecil", "Tinggi"]', 'Lawan kata dari Besar adalah Kecil.', 'Antonim'),
(6, 'fase-a', 'Lawan Kata (Antonim)', 'Terang', 'Gelap', '["Hitam", "Gelap", "Redup"]', 'Lawan kata dari Terang adalah Gelap.', 'Antonim'),
(7, 'fase-a', 'Aktivitas Sehari-hari', 'Adik', 'Tidur', '["Bekerja", "Tidur", "Memasak"]', 'Saat malam tiba, Adik tidur nyenyak di tempat tidur.', 'Subjek - Predikat'),
(8, 'fase-a', 'Benda Langit', 'Matahari', 'Bersinar', '["Hanyut", "Bersinar", "Berdengung"]', 'Matahari bersinar menerangi bumi dan memberi kehangatan di siang hari.', 'Subjek - Predikat'),
(9, 'fase-a', 'Lawan Kata (Antonim)', 'Bersih', 'Kotor', '["Kotor", "Basah", "Rapi"]', 'Lawan kata dari Bersih adalah Kotor.', 'Antonim'),
(10, 'fase-a', 'Tanaman & Lingkungan', 'Pohon', 'Tumbuh', '["Tumbuh", "Berlari", "Bicara"]', 'Pohon yang dirawat dengan baik akan tumbuh subur dan rindang.', 'Subjek - Predikat'),
(11, 'fase-a', 'Panca Indera', 'Mata', 'Melihat', '["Melihat", "Mendengar", "Meraba"]', 'Mata adalah indera penglihatan untuk melihat benda di sekitar kita.', 'Fungsi Benda'),
(12, 'fase-a', 'Panca Indera', 'Telinga', 'Mendengar', '["Mengecap", "Mendengar", "Mencium"]', 'Telinga kita gunakan untuk mendengarkan suara dan musik yang merdu.', 'Fungsi Benda'),
(13, 'fase-a', 'Gejala Alam', 'Hujan', 'Turun', '["Terbakar", "Turun", "Menyala"]', 'Tetesan air hujan turun dari awan ke permukaan bumi.', 'Subjek - Predikat'),
(14, 'fase-a', 'Hewan & Suaranya', 'Ayam Jantan', 'Berkokok', '["Berkokok", "Mengaum", "Menciap"]', 'Ayam jantan berkokok di pagi hari: kukuruyuk!', 'Subjek - Predikat'),
(15, 'fase-a', 'Hewan & Gerakannya', 'Katak', 'Melompat', '["Terbang", "Melompat", "Meluncur"]', 'Katak bergerak dengan cara melompat menggunakan kakinya yang kuat.', 'Subjek - Predikat'),
(16, 'fase-a', 'Rasa & Makanan', 'Gula', 'Manis', '["Pahit", "Asin", "Manis"]', 'Gula memberikan rasa manis pada minuman teh dan kue.', 'Sifat Benda'),
(17, 'fase-a', 'Rasa & Makanan', 'Cabai', 'Pedas', '["Asam", "Pedas", "Manis"]', 'Cabai memiliki rasa pedas yang membuat lidah terasa hangat.', 'Sifat Benda'),
(18, 'fase-a', 'Lawan Kata (Antonim)', 'Panas', 'Dingin', '["Hangat", "Dingin", "Sejuk"]', 'Lawan kata dari Panas adalah Dingin.', 'Antonim'),
(19, 'fase-a', 'Lawan Kata (Antonim)', 'Cepat', 'Lambat', '["Pelan", "Lambat", "Tenang"]', 'Lawan kata dari Cepat adalah Lambat.', 'Antonim'),
(20, 'fase-a', 'Alat Tulis & Fungsi', 'Pensil', 'Menulis', '["Menghapus", "Menulis", "Menggunting"]', 'Pensil digunakan murid untuk menulis huruf dan menggambar.', 'Fungsi Benda'),
(21, 'fase-a', 'Peralatan & Fungsi', 'Gunting', 'Memotong', '["Menempel", "Memotong", "Menggaris"]', 'Gunting adalah alat tajam yang berfungsi memotong kertas atau kain.', 'Fungsi Benda'),
(22, 'fase-a', 'Aktivitas Belajar', 'Murid', 'Belajar', '["Belajar", "Bekerja", "Berlayar"]', 'Murid pergi ke sekolah untuk belajar bersama guru dan teman-teman.', 'Subjek - Predikat'),
(23, 'fase-a', 'Hewan & Suaranya', 'Singa', 'Mengaum', '["Meringkik", "Mengaum", "Mendengkur"]', 'Singa si raja hutan bersuara dengan cara mengaum keras.', 'Subjek - Predikat'),
(24, 'fase-a', 'Lawan Kata (Antonim)', 'Tinggi', 'Rendah', '["Pendek", "Rendah", "Kecil"]', 'Lawan kata dari posisi Tinggi adalah Rendah.', 'Antonim'),
(25, 'fase-a', 'Benda Langit Malam', 'Bintang', 'Berkelip', '["Membeku", "Berkelip", "Berdesir"]', 'Bintang di langit malam yang cerah tampak berkelip-kelip indah.', 'Subjek - Predikat'),

-- Bank Soal Fase B (Kelas 3-4 SD)
(101, 'fase-b', 'Profesi & Tugas (SPOK)', 'Dokter', 'Mengobati', '["Mengajar", "Mengobati", "Merancang"]', 'Dokter bertugas memeriksa dan mengobati pasien yang sedang sakit.', 'Struktur SPOK'),
(102, 'fase-b', 'Profesi & Tugas (SPOK)', 'Petani', 'Menanam', '["Menangkap", "Menjahit", "Menanam"]', 'Petani menanam bibit padi di sawah dengan tekun.', 'Struktur SPOK'),
(103, 'fase-b', 'Persamaan Kata (Sinonim)', 'Giat', 'Rajin', '["Malas", "Rajin", "Pintar"]', 'Sinonim (persamaan makna) dari kata Giat adalah Rajin.', 'Sinonim'),
(104, 'fase-b', 'Persamaan Kata (Sinonim)', 'Pandai', 'Cerdas', '["Cerdas", "Lincah", "Lambat"]', 'Sinonim dari kata Pandai adalah Cerdas atau Pintar.', 'Sinonim'),
(105, 'fase-b', 'Profesi & Tugas (SPOK)', 'Guru', 'Mendidik', '["Mendidik", "Membangun", "Menyanyi"]', 'Guru mendidik dan mengajar para siswa di sekolah dengan kasih sayang.', 'Struktur SPOK'),
(106, 'fase-b', 'Lawan Kata (Antonim)', 'Hemat', 'Boros', '["Pelit", "Boros", "Kaya"]', 'Lawan kata dari sifat Hemat adalah Boros.', 'Antonim'),
(107, 'fase-b', 'Lawan Kata (Antonim)', 'Jujur', 'Bohong', '["Bohong", "Sopan", "Berani"]', 'Lawan kata dari sikap Jujur adalah Bohong atau Curang.', 'Antonim'),
(108, 'fase-b', 'Profesi & Karya (SPOK)', 'Penulis', 'Mengarang', '["Melukis", "Mengarang", "Memotong"]', 'Penulis mengarang cerita novel dan buku ilmu pengetahuan.', 'Struktur SPOK'),
(109, 'fase-b', 'Persamaan Kata (Sinonim)', 'Indah', 'Elok', '["Bagus", "Elok", "Megah"]', 'Kata puitis yang bersinonim dengan Indah salah satunya adalah Elok.', 'Sinonim'),
(110, 'fase-b', 'Profesi & Aktivitas (SPOK)', 'Nelayan', 'Melaut', '["Melaut", "Membajak", "Menambang"]', 'Nelayan melaut ke tengah samudra untuk menangkap ikan segar.', 'Struktur SPOK'),
(111, 'fase-b', 'Profesi & Tugas (SPOK)', 'Arsitek', 'Merancang', '["Merancang", "Mengecat", "Mengelas"]', 'Arsitek bertugas merancang denah dan bentuk bangunan gedung.', 'Struktur SPOK'),
(112, 'fase-b', 'Profesi & Aktivitas (SPOK)', 'Koki', 'Memasak', '["Menghias", "Memasak", "Mencuci"]', 'Koki profesional memasak berbagai hidangan lezat di restoran.', 'Struktur SPOK'),
(113, 'fase-b', 'Persamaan Kata (Sinonim)', 'Senang', 'Gembira', '["Tertawa", "Gembira", "Bangga"]', 'Sinonim yang paling tepat untuk kata Senang adalah Gembira.', 'Sinonim'),
(114, 'fase-b', 'Persamaan Kata (Sinonim)', 'Luas', 'Lapang', '["Panjang", "Lapang", "Tinggi"]', 'Sinonim dari tanah atau ruangan yang Luas adalah Lapang.', 'Sinonim'),
(115, 'fase-b', 'Lawan Kata (Antonim)', 'Pemberani', 'Penakut', '["Pemalu", "Penakut", "Penyedih"]', 'Lawan kata dari sikap Pemberani adalah Penakut.', 'Antonim'),
(116, 'fase-b', 'Lawan Kata (Antonim)', 'Subur', 'Tandus', '["Gersang", "Tandus", "Kering"]', 'Tanah yang tidak bisa ditumbuhi tanaman disebut tanah Tandus.', 'Antonim'),
(117, 'fase-b', 'Sains & Tumbuhan (SPOK)', 'Daun Hijau', 'Fotosintesis', '["Fotosintesis", "Penguapan", "Pengendapan"]', 'Daun hijau melakukan fotosintesis dengan bantuan sinar matahari untuk menghasilkan makanan.', 'Struktur SPOK'),
(118, 'fase-b', 'Sains & Tubuh Manusia (SPOK)', 'Jantung', 'Memompa', '["Menyaring", "Memompa", "Mencerna"]', 'Organ jantung manusia bertugas memompa darah bersih ke seluruh tubuh.', 'Struktur SPOK'),
(119, 'fase-b', 'Persamaan Kata (Sinonim)', 'Melihat', 'Memandang', '["Melirik", "Memandang", "Menoleh"]', 'Salah satu sinonim kata Melihat secara saksama adalah Memandang.', 'Sinonim'),
(120, 'fase-b', 'Lawan Kata (Antonim)', 'Asli', 'Palsu', '["Tiruan", "Palsu", "Bekas"]', 'Lawan kata dari barang yang Asli adalah Palsu.', 'Antonim'),
(121, 'fase-b', 'Profesi & Transportasi (SPOK)', 'Masinis', 'Menjalankan', '["Menerbangkan", "Menjalankan", "Mengayuh"]', 'Masinis bertugas menjalankan dan mengemudikan kereta api penumpang.', 'Struktur SPOK'),
(122, 'fase-b', 'Profesi & Transportasi (SPOK)', 'Pilot', 'Menerbangkan', '["Meluncurkan", "Menerbangkan", "Mengemudikan"]', 'Pilot mengemudikan dan menerbangkan pesawat terbang di udara.', 'Struktur SPOK'),
(123, 'fase-b', 'Persamaan Kata (Sinonim)', 'Pemberian', 'Hadiah', '["Upah", "Hadiah", "Beli"]', 'Sesuatu yang diberikan dengan ikhlas disebut Pemberian atau Hadiah.', 'Sinonim'),
(124, 'fase-b', 'Lawan Kata (Antonim)', 'Kuno', 'Modern', '["Canggih", "Modern", "Baru"]', 'Zaman sekarang yang serba mutakhir disebut Modern, kebalikan dari Kuno.', 'Antonim'),
(125, 'fase-b', 'Peduli Lingkungan (SPOK)', 'Warga', 'Mendaur Ulang', '["Membakar", "Mendaur Ulang", "Menimbun"]', 'Warga yang cinta lingkungan mendaur ulang sampah plastik menjadi barang berguna.', 'Struktur SPOK');
