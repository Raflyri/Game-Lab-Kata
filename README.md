# Laboratorium Kata 🧪📖🎈
**Game Edukatif Fisika & Literasi Bahasa Indonesia (Kurikulum Merdeka SD - Fase A & B)**  
*Bagian dari inisiatif RBeverything Edu & Game Collection*

---

## 🌟 Tentang Permainan
**"Laboratorium Kata"** adalah permainan edukasi berbasis fisika (*Physics Drop / Word Match*) bertema laboratorium sains ramah anak. 
Pemain berperan sebagai **Peneliti Cilik** yang bertugas mengidentifikasi dan mencocokkan kata subjek yang melayang jatuh di dalam gelembung kaca (*glossy bubble*) dengan tabung reaksi laboratorium kimia di bagian bawah layar sebelum gelembung tersebut menyentuh dasar layar.

---

## 📱 Fitur Responsif Penuh (Mobile Smartphone & Tablet)
- **Adaptasi Otomatis (Dynamic Resolution)**:
  - **Smartphone Portrait**: Kanvas otomatis beralih ke resolusi vertikal `540 x 760` dengan ukuran tabung reaksi dan gelembung yang disesuaikan agar pas di genggaman ponsel tanpa terpotong.
  - **Tablet & Desktop Landscape**: Kanvas beralih ke `900 x 650` memberikan ruang observasi yang luas.
- **Dukungan Touch Action & Safe Area**:
  - Menggunakan `100dvh` (*Dynamic Viewport Height*) untuk mencegah masalah terpotongnya layar oleh address bar browser pada perangkat seluler.
  - Multi-touch gesture handling dengan *Pointer Events* tanpa latensi sentuh.

---

## 🏆 Papan Peringkat Global & Rating Peneliti Cilik
- **Global Leaderboard Endpoint**: Menggunakan Cloudflare Pages Function [`functions/api/leaderboard.js`](file:///c:/Work/rbtech.site/rbeverything.com/game-collection/Labolatorium-Kata/functions/api/leaderboard.js) yang dapat langsung dihubungkan ke Cloudflare D1 Database atau KV.
- **Sistem Rating Peneliti**:
  - 👑 **Profesor Jenius** (Rating 5.0 ⭐⭐⭐⭐⭐) - Skor ≥ 1000
  - 🌟 **Peneliti Handal** (Rating 4.5 ⭐⭐⭐⭐☆) - Skor 750 - 999
  - 🔬 **Eksplorer Cilik** (Rating 3.5 ⭐⭐⭐☆☆) - Skor 450 - 749
  - 🌱 **Ilmuwan Pemula** (Rating 2.5 ★★☆☆☆) - Skor < 450
- **Pengiriman Skor**: Di akhir permainan, siswa dapat mencantumkan nama dan asal sekolah mereka untuk dikirim ke papan peringkat global.

---

## 🎯 Kurikulum Merdeka (Bahasa Indonesia & Literasi SD)
- **Fase A (Kelas 1 - 2 SD)**: Pasangan benda & tindakan, suara/gerak hewan, dan lawan kata (Antonim) dasar.
- **Fase B (Kelas 3 - 4 SD)**: Struktur kalimat SPOK, persamaan kata (Sinonim), dan antonim pengayaan.

---

## 📁 Struktur Direktori
```
Labolatorium-Kata/
├── index.html                 # Halaman utama game, kanvas responsive, HUD, dan dialog anak
├── css/
│   └── style.css              # Tampilan mobile-first, kids-friendly, tombol 3D jelly
├── js/
│   ├── audio.js               # Synthesizer efek suara dan BGM ramah anak
│   ├── data.js                # Bank soal Kurikulum Merdeka & simulasi query D1
│   ├── profile.js             # Manajemen 3 profil pemain lokal (RBeverything Edu)
│   ├── leaderboard.js         # Service client-side papan peringkat & rating peneliti
│   ├── physics.js             # Gelembung glossy adaptif, tabung Erlenmeyer, partikel
│   └── game.js                # Game loop, canvas dinamis, scoring, & integrasi leaderboard
├── functions/
│   └── api/
│       ├── words.js           # Cloudflare Pages Function (simulasi bank soal D1)
│       └── leaderboard.js     # Cloudflare Pages Function (simulasi leaderboard & rating D1)
├── wrangler.toml              # Konfigurasi Cloudflare Pages / Workers
└── README.md                  # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan & Deploy

### Jalankan Lokal
```bash
python -m http.server 8080
# atau
npx serve .
# atau dengan simulator Cloudflare Pages
npx wrangler pages dev .
```

### Deploy ke Cloudflare Pages
```bash
npx wrangler pages deploy . --project-name laboratorium-kata
```
