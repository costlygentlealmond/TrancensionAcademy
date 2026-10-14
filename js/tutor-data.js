// ============================================================
// TRANCENSION ACADEMY — BASIS PENGETAHUAN AI TUTOR
// Pengganti folder database_pengembangan/ (format .txt -> .js)
//
// CARA MENAMBAH MATERI:
// 1. Salin isi TXT kamu ke field "isi" (paragraf dipisah baris kosong)
// 2. world: "marketing" | "fintech" | "entrepreneurship" | "analytics"
// 3. Simpan. Selesai — tidak perlu sentuh tutor.js sama sekali.
// ============================================================

const KNOWLEDGE_BASE = [
    {
        id: "dm_seo_dan_sem",
        nama: "SEO dan SEM",
        world: "marketing",
        isi: `SEO DAN SEM

SEO (Search Engine Optimization) adalah upaya mengoptimalkan website agar muncul di hasil pencarian organik tanpa berbayar.

Tiga pilar SEO: (1) On-page SEO: optimasi di dalam halaman — title tag, meta description 150-160 karakter, struktur heading, kualitas konten, dan internal link. (2) Off-page SEO: membangun otoritas dari luar website, terutama backlink berkualitas. (3) Technical SEO: page speed, mobile-friendly, sitemap, dan kemudahan perayapan.

Keyword research membagi keyword menjadi tiga tipe: informational (ingin tahu), transactional (siap membeli), dan navigational (menuju situs tertentu). Keyword transaksional biasanya paling bernilai untuk konversi.

SEM (Search Engine Marketing) adalah iklan berbayar di mesin pencari seperti Google Ads dengan model lelang CPC. SEO hasilnya lambat tapi murah jangka panjang; SEM hasilnya instan tapi berbayar. Strategi sehat umumnya menggabungkan keduanya.`
    },
    {
        id: "dm_content_marketing",
        nama: "Content Marketing",
        world: "marketing",
        isi: `CONTENT MARKETING

Content marketing adalah strategi menciptakan dan mendistribusikan konten bernilai dan relevan untuk menarik serta mempertahankan audiens — bukan sekadar berpromosi.

Kerangka funnel menentukan jenis konten: TOFU (awareness) berisi edukasi dan hiburan berjangkauan luas; MOFU (consideration) berisi studi kasus, webinar, dan perbandingan; BOFU (conversion) berisi demo, testimoni, dan penawaran.

Content pillar adalah 3-5 tema besar yang menjadi fondasi seluruh konten agar pesan brand konsisten. Penyusunannya dimulai dari irisan antara keahlian brand, kebutuhan audiens, dan peluang riset keyword.

Distribusi konten terbagi tiga: owned (media sendiri: blog, email), earned (disebar orang lain: share, PR), dan paid (iklan).

Untuk konsistensi gunakan content calendar dan keseimbangan rule of thirds: sepertiga value, sepertiga interaksi, sepertiga promosi. Copywriting yang baik mengikuti pola AIDA: Attention, Interest, Desire, Action.`
    },
    {
        id: "dm_digital_advertising",
        nama: "Digital Advertising",
        world: "marketing",
        isi: `DIGITAL ADVERTISING

Iklan digital memungkinkan targeting presisi: demografi, lokasi, minat, perilaku, hingga custom audience (daftar pelanggan lama) dan lookalike audience (orang baru yang mirip pelanggan terbaikmu).

Model pembayaran umum: CPC (bayar per klik), CPM (bayar per 1000 tayangan), dan CPA (bayar per aksi). Pilih model sesuai tujuan kampanye.

Struktur kampanye mengikuti funnel: awareness mengukur jangkauan dan view, consideration mengukur traffic dan engagement, conversion mengukur pembelian dan pendaftaran.

Metrik kunci: CTR, CPC, conversion rate, dan ROAS (pendapatan dibanding biaya iklan). ROAS di bawah 1 berarti iklan merugi.

Retargeting menayangkan iklan kepada orang yang sudah mengunjungi website — conversion rate-nya biasanya jauh lebih tinggi karena audiens sudah mengenal brand.

Selalu lakukan A/B testing pada kreatif dan copy, dan optimalkan satu variabel pada satu waktu.`
    },
    {
        id: "fintech_sistem_pembayaran",
        nama: "Sistem Pembayaran Digital",
        world: "fintech",
        isi: `SISTEM PEMBAYARAN DIGITAL

Fintech (financial technology) adalah teknologi yang memodernisasi layanan keuangan: pembayaran, pinjaman, investasi, dan asuransi.

Payment gateway (contoh: Midtrans, Xendit) menghubungkan merchant dengan banyak metode pembayaran lewat satu integrasi: virtual account, e-wallet, kartu kredit, hingga QRIS. Gateway juga menangani keamanan dan laporan transaksi dengan biaya per transaksi.

Virtual Account menghasilkan nomor rekening unik per transaksi sehingga verifikasi pembayaran otomatis. QRIS adalah standar kode QR dari Bank Indonesia (2019) yang membuat satu kode bisa dibayar dari semua e-wallet dan m-banking.

Setelah pembayaran sukses terjadi settlement: dana diteruskan ke rekening merchant sesuai jadwal.

Paylater (buy now pay later) memungkinkan cicilan di titik pembayaran — menaikkan konversi tetapi membawa risiko kredit sehingga diawasi ketat regulator.`
    },
    {
        id: "fintech_wealthtech_investasi",
        nama: "Wealthtech & Investasi",
        world: "fintech",
        isi: `WEALTHTECH: INVESTASI DIGITAL

Wealthtech adalah teknologi untuk investasi dan pengelolaan kekayaan: aplikasi reksa dana, saham, obligasi ritel, hingga emas digital.

Robo-advisor menyusun dan mengelola portofolio secara otomatis dengan algoritma berdasarkan profil risiko dan tujuan pengguna. Kelebihannya murah dan disiplin; kekurangannya kurang fleksibel menghadapi kondisi khusus.

Prinsip penting investasi: diversifikasi (jangan menaruh semua dana di satu instrumen), konsistensi jangka panjang, dan memahami profil risiko (konservatif, moderat, agresif).

P2P lending sering dikira investasi aman — faktanya imbal hasil tinggi selalu datang dengan risiko tinggi, termasuk risiko gagal bayar.

Di Indonesia, investasi dan P2P diawasi OJK, sistem pembayaran diawasi Bank Indonesia. Selalu pastikan platform terdaftar di regulator sebelum menyetor dana.`
    },
    {
        id: "fintech_regtech_dan_keamanan",
        nama: "Regtech & Keamanan",
        world: "fintech",
        isi: `REGTECH DAN KEAMANAN FINANSIAL

Regtech (regulatory technology) adalah teknologi yang membantu perusahaan keuangan mematuhi regulasi secara efisien dan otomatis.

KYC (Know Your Customer) adalah verifikasi identitas nasabah — KTP, selfie, liveness check — untuk mencegah penipuan dan akun palsu. AML (Anti-Money Laundering) adalah sistem pendeteksi transaksi mencurigakan yang berpotensi pencucian uang.

Keamanan teknis yang wajib ada: enkripsi data, tokenisasi (data kartu diganti token), OTP/2FA sebagai lapisan verifikasi kedua, dan fraud detection berbasis pola transaksi.

Kerangka hukum utama di Indonesia: Bank Indonesia untuk sistem pembayaran, OJK untuk layanan keuangan, dan UU Perlindungan Data Pribadi (PDP) yang mengatur pengumpulan serta pemrosesan data pengguna.

Bagi pemilik bisnis digital: compliance bukan beban, melainkan kepercayaan — nasabah hanya menitipkan uang pada platform yang terlihat aman dan legal.`
    },
    {
        id: "startup_lean_dan_mvp",
        nama: "Lean Startup & MVP",
        world: "entrepreneurship",
        isi: `LEAN STARTUP DAN MVP

Startup adalah organisasi sementara yang mencari model bisnis yang bisa diulang dan diskalakan — berbeda dengan usaha kecil yang langsung menjalankan model yang sudah terbukti.

Lean Startup memakai siklus Build-Measure-Learn: ubah asumsi menjadi produk sekecil mungkin, ukur respons pengguna nyata, pelajari, lalu putuskan.

MVP (Minimum Viable Product) adalah versi produk paling sederhana yang cukup untuk menguji asumsi inti. Contoh legendaris: Dropbox memvalidasi idenya hanya dengan video demo sebelum produknya jadi.

Hasil eksperimen menentukan dua jalan: persevere (melanjutkan arah) atau pivot (mengubah arah fundamental, misalnya segmen atau model bisnis).

Target akhir adalah product-market fit: kondisi ketika produk terbukti menyelesaikan masalah nyata dan pasar menyerapnya dengan pertumbuhan konsisten.

Ukur dengan actionable metrics (retensi, conversion) — bukan vanity metrics (downloads, followers) yang membumbung tanpa mencerminkan nilai.`
    },
    {
        id: "startup_business_model_canvas",
        nama: "Business Model Canvas",
        world: "entrepreneurship",
        isi: `BUSINESS MODEL CANVAS

BMC adalah kerangka satu halaman untuk memetakan model bisnis ke dalam 9 blok: (1) Customer Segments: siapa pelanggan yang dilayani. (2) Value Proposition: nilai unik yang menyelesaikan masalah pelanggan. (3) Channels: cara produk menjangkau pelanggan. (4) Customer Relationships: cara hubungan dibangun dan dipelihara. (5) Revenue Streams: sumber uang — penjualan, langganan, iklan, komisi. (6) Key Resources: aset penting — tim, teknologi, modal. (7) Key Activities: aktivitas utama bisnis. (8) Key Partnerships: mitra strategis dan pemasok. (9) Cost Structure: biaya terbesar.

Urutan pengisian yang disarankan: mulai dari pelanggan (segment), lalu value proposition, baru blok lainnya — karena model bisnis selalu berangkat dari masalah pelanggan, bukan dari produk.`
    },
    {
        id: "analytics_metrik_bisnis",
        nama: "Metrik Bisnis & Analytics",
        world: "analytics",
        isi: `METRIK BISNIS DAN ANALYTICS

Empat tingkatan analitik: Descriptive (apa yang terjadi), Diagnostic (mengapa terjadi), Predictive (apa yang akan terjadi), dan Prescriptive (apa yang sebaiknya dilakukan).

Metrik inti bisnis digital: Conversion Rate (persentase pengunjung yang melakukan aksi bernilai), CAC (biaya memperoleh satu pelanggan), LTV (total nilai seorang pelanggan selama menjadi pelanggan), Churn Rate (persentase pelanggan yang berhenti), dan Retention Rate. Bisnis sehat umumnya punya LTV jauh lebih besar dari CAC (acuan umum minimal 3:1).

Vanity metrics (followers, views, likes) terlihat bagus tetapi tidak selalu terhubung dengan pendapatan. Actionable metrics (conversion rate, retention, revenue) langsung mendukung keputusan bisnis.

A/B testing adalah metode membandingkan dua versi halaman, iklan, atau judul pada pengunjung acak untuk mengetahui versi mana yang benar-benar lebih baik berdasarkan data — bukan opini.`
    }
];
