# 📖 Panduan Lengkap Konfigurasi Cloudflare Pages & D1 Database
### Proyek: **Laboratorium Kata (Game Edukasi Literasi SD)**

Panduan ini berisi langkah-langkah praktis untuk men-deploy game **Laboratorium Kata** ke **Cloudflare Pages** serta mengaktifkan **Cloudflare D1 Database** agar Papan Peringkat Global (*Global Leaderboard*) dan Bank Soal berfungsi secara online dan permanen.

---

## 📑 Daftar Isi
1. [Prasyarat](#1-prasyarat)
2. [Menghubungkan Repository GitHub ke Cloudflare Pages](#2-menghubungkan-repository-github-ke-cloudflare-pages)
3. [Membuat & Menyiapkan Cloudflare D1 Database](#3-membuat--menyiapkan-cloudflare-d1-database)
4. [Menghubungkan D1 Database ke Cloudflare Pages (Binding)](#4-menghubungkan-d1-database-ke-cloudflare-pages-binding)
5. [Pengujian & Verifikasi Online](#5-pengujian--verifikasi-online)
6. [Troubleshooting & Tanya Jawab (FAQ)](#6-troubleshooting--tanya-jawab-faq)

---

## 1. Prasyarat
- Akun Cloudflare aktif (paket gratis sudah sangat mencukupi).
- Repository GitHub: [`https://github.com/Raflyri/Game-Lab-Kata.git`](https://github.com/Raflyri/Game-Lab-Kata.git)
- Node.js & npm terinstal di komputer lokal (untuk menjalankan perintah `wrangler`).

---

## 2. Menghubungkan Repository GitHub ke Cloudflare Pages

1. Masuk ke dashboard Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com).
2. Di bilah menu kiri, pilih menu **Workers & Pages**.
3. Klik tombol **Create Application** lalu pilih tab **Pages**.
4. Klik **Connect to Git** dan pilih akun GitHub Anda.
5. Pilih repository: `Raflyri/Game-Lab-Kata` lalu klik **Begin setup**.
6. Konfigurasi build setup:
   - **Project name**: `laboratorium-kata` (atau sesuai keinginan Anda)
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: *(Kosongkan / Biarkan kosong)*
   - **Build output directory**: `.` (titik atau biarkan kosong jika root)
7. Klik **Save and Deploy**.
8. Cloudflare akan mengunggah aset web dan secara otomatis mendeteksi folder `functions/` sebagai **Cloudflare Pages Functions** (Serverless API).

> [!NOTE]
> Setelah tahap ini selesai, game sudah bisa diakses online via domain `https://laboratorium-kata.pages.dev`. Namun, database online D1 masih perlu dihubungkan di langkah berikutnya agar skor leaderboard tersimpan permanen.

---

## 3. Membuat & Menyiapkan Cloudflare D1 Database

Buka terminal (PowerShell atau Command Prompt) di komputer Anda pada folder proyek:

### Langkah 3.1: Login ke Akun Cloudflare via Wrangler
```bash
npx wrangler login
```
*Peramban akan terbuka untuk mengonfirmasi login akun Cloudflare Anda.*

### Langkah 3.2: Buat Database D1
```bash
npx wrangler d1 create laboratorium-kata-db
```
Output terminal akan menampilkan informasi seperti berikut:
```toml
[[d1_databases]]
binding = "DB"
database_name = "laboratorium-kata-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
> [!IMPORTANT]
> Simpan atau salin **`database_id`** tersebut!

### Langkah 3.3: Eksekusi Skema SQL ke Database Cloudflare (Remote)
Proyek ini sudah dilengkapi berkas `schema.sql`. Jalankan perintah ini untuk membuat tabel `leaderboard` dan `word_pairs`:
```bash
npx wrangler d1 execute laboratorium-kata-db --file=./schema.sql --remote
```
*Perintah ini akan membuat tabel dan menyuntikkan data awal (seed) ke database online Cloudflare.*

---

## 4. Menghubungkan D1 Database ke Cloudflare Pages (Binding)

Agar Cloudflare Pages Function pada `functions/api/` dapat mengakses database D1 dengan variabel `env.DB`, Anda perlu melakukan binding:

### Cara Melalui Dashboard Cloudflare (Paling Mudah):
1. Buka kembali dashboard Cloudflare: **Workers & Pages** → Klik project Pages Anda (**laboratorium-kata**).
2. Masuk ke menu **Settings** → lalu pilih tab **Functions**.
3. Gulir ke bawah hingga menemukan bagian **D1 database bindings**.
4. Klik **Add binding**:
   - **Variable name**: `DB` *(Wajib menggunakan huruf kapital `DB` sesuai kode di `functions/api/`)*
   - **D1 database**: Pilih `laboratorium-kata-db`
5. Klik tombol **Save**.
6. **Deploy Ulang (Redeploy)**:
   - Masuk ke tab **Deployments**.
   - Pada deployment terbaru, klik tombol tiga titik (`...`) → pilih **Retry deployment** agar konfigurasi binding aktif.

---

## 5. Pengujian & Verifikasi Online

1. Buka URL situs Cloudflare Pages Anda (contoh: `https://laboratorium-kata.pages.dev`).
2. Klik tombol **🏆 Papan Peringkat** di bagian kanan atas layar:
   - Anda akan melihat daftar nama siswa, sekolah, rating, dan skor yang dimuat langsung dari Cloudflare D1 Database.
3. Mainkan 1 sesi game sampai selesai:
   - Pada layar **Eksperimen Berhasil!**, ketikkan nama sekolah Anda (misalnya: *SD Bintang Mulia*).
   - Klik **Kirim ke Leaderboard 🚀**.
   - Buka kembali papan peringkat untuk memastikan skor Anda sudah bertambah secara online!
4. Anda juga dapat memeriksa isi data dari terminal kapan saja menggunakan:
```bash
npx wrangler d1 execute laboratorium-kata-db --command="SELECT name, school, score, tier FROM leaderboard ORDER BY score DESC LIMIT 5" --remote
```

---

## 6. Troubleshooting & Tanya Jawab (FAQ)

### Q: Apa yang terjadi jika database D1 belum dihubungkan?
**A:** Game tetap dapat dimainkan tanpa error (*graceful fallback*). Jika binding `env.DB` belum terhubung, kode secara otomatis beralih ke cache lokal peramban (*localStorage*).

### Q: Bagaimana cara menambah bank soal baru di database D1?
**A:** Anda dapat menambahkan soal baru langsung melalui perintah SQL terminal:
```bash
npx wrangler d1 execute laboratorium-kata-db --command="INSERT INTO word_pairs (phase, topic, subject, correct_target, options_json, explanation, category) VALUES ('fase-a', 'Alam', 'Bintang', 'Bercahaya', '[\"Bercahaya\", \"Berenang\", \"Melompat\"]', 'Bintang bercahaya indah di langit malam!', 'Subjek - Predikat')" --remote
```

### Q: Apakah Cloudflare D1 berbayar?
**A:** Tidak. Cloudflare D1 memiliki kuota gratis harian yang sangat besar:
- **5.000.000 (5 juta)** operasi baca (*reads*) per hari.
- **100.000 (100 ribu)** operasi tulis (*writes*) per hari.
- Kapasitas penyimpanan hingga **5 GB**.
Kapasitas ini lebih dari cukup untuk digunakan oleh ribuan anak sekolah setiap harinya.
