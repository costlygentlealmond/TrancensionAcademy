// ============================================================
// TRANCENSION ACADEMY — DATABASE DUNIA & KUIS
// [v5] Multi-konsentrasi (World System) + jalur belajar Duolingo
// ============================================================

// ---------- PETA DUNIA (KONSINTRASI) ----------
// quests = urutan node dalam path. Node berikutnya terbuka
// otomatis setelah node sebelumnya diselesaikan.
const CONCENTRATIONS = [
    {
        id: "marketing",
        name: "Digital Marketing",
        flag: "📊",
        theme: "marketing",
        tagline: "SEO, Konten & Media Sosial",
        units: [
            { title: "Unit 1", subtitle: "Fundamentals Pemasaran Digital", quests: ["q1", "q2", "q3"] },
            { title: "Unit 2", subtitle: "SEO Teknis & Strategi Konten", quests: ["q4", "q5", "q6", "q7"] },
            { title: "Unit 3", subtitle: "Ujian Akhir: Strategi Terpadu", quests: ["q8"] }
        ]
    },
    {
        id: "fintech",
        name: "Fintech",
        flag: "🏦",
        theme: "fintech",
        tagline: "Pembayaran Digital & Keuangan",
        units: [
            { title: "Unit 1", subtitle: "Dasar-Dasar Fintech", quests: ["f1", "f2"] }
        ]
    },
    {
        id: "entrepreneurship",
        name: "Digital Entrepreneurship",
        flag: "🚀",
        theme: "entrepreneurship",
        tagline: "Startup & Bisnis Digital",
        units: [
            { title: "Unit 1", subtitle: "Validasi Ide Bisnis", quests: ["e1"] }
        ]
    },
    {
        id: "analytics",
        name: "Business Analytics",
        flag: "📈",
        theme: "analytics",
        tagline: "Data & Pengambilan Keputusan",
        units: [
            { title: "Unit 1", subtitle: "Berpikir dengan Data", quests: ["a1"] }
        ]
    }
];

// ---------- XP PER QUEST (dipisah agar soal tak perlu disentuh) ----------
const QUEST_XP = {
    q1: 20, q2: 25, q3: 30, q4: 50, q5: 40, q6: 45, q7: 40, q8: 100,
    f1: 40, f2: 40, e1: 40, a1: 40
};

// ============================================================
// BANK SOAL — Soal q1 s.d. q8 TIDAK DIUBAH dari versi sebelumnya
// ============================================================

const quizData = {
    "q1": {
        title: "Kuis: Keyword Research 101",
        questions: [
            {
                slide_number: 1,
                question: "Keyword 'beli sepatu running murah' termasuk dalam tipe keyword...",
                options: { "A": "Informational", "B": "Transactional", "C": "Navigational", "D": "Geografis" },
                correct_answer: "B",
                clue: "Perhatikan kata 'beli'. Orang yang mengetiknya sedang ingin MELAKUKAN transaksi, atau sekadar ingin tahu sesuatu?",
                explanation: "Keyword transaksional mengandung niat beli yang jelas (kata 'beli', 'harga', 'diskon'). Orangnya sudah berada di tahap akhir funnel dan jauh lebih mungkin melakukan pembelian — inilah keyword paling berharga untuk konversi.",
                funFact: "Fakta unik: keyword transaksional punya conversion rate 2–5x lebih tinggi daripada keyword informational — karena orangnya sudah siap membayar!"
            },
            {
                slide_number: 2,
                question: "Keyword yang diketik untuk menuju situs tertentu (contoh: 'instagram login') disebut...",
                options: { "A": "Transactional", "B": "Informational", "C": "Navigational", "D": "Commercial" },
                correct_answer: "C",
                clue: "Bayangkan keyword ini seperti mengetik alamat kantor di GPS — orangnya sudah tahu mau ke mana, ia hanya butuh jalur tercepat menuju satu tujuan spesifik.",
                explanation: "Keyword navigational dipakai saat pengguna ingin menuju website atau halaman spesifik yang sudah mereka kenal (mis. 'youtube login', 'shopee'). Bisnis justru mengincar keyword navigational bermerk — artinya orang mencari MEREKA secara langsung.",
                funFact: "Tahukah kamu? Sekitar 15% pencarian di Google setiap harinya adalah pencarian yang BELUM PERNAH diketik siapa pun sebelumnya!"
            }
        ]
    },
    "q2": {
        title: "Kuis: The Marketing Funnel",
        questions: [
            {
                slide_number: 1,
                question: "Tahap 'TOFU' (Top of Funnel) berfokus untuk...",
                options: {
                    "A": "Menghasilkan penjualan langsung",
                    "B": "Membangun kesadaran (Awareness)",
                    "C": "Membuat audiens mempertimbangkan produk",
                    "D": "Menjaga loyalitas pelanggan"
                },
                correct_answer: "B",
                clue: "Visualisasikan corongnya: orang di bagian PALING ATAS baru saja mengenalmu. Apa yang paling masuk akal dilakukan pada orang yang baru kenal — langsung menjual, atau memperkenalkan diri?",
                explanation: "TOFU adalah tahap awareness. Audiens belum kenal brand-mu, jadi tujuannya membangun kesadaran dan kepercayaan awal lewat konten edukatif/hiburan berjangkauan luas. Menjual di tahap ini justru membuat audiens kabur.",
                funFact: "Istilah 'marketing funnel' dipopulerkan oleh E. St. Elmo Lewis pada tahun 1898 — konsep ini sudah berusia lebih dari 120 tahun!"
            },
            {
                slide_number: 2,
                question: "Konten apa yang paling cocok untuk tahap 'MOFU' (Middle of Funnel)?",
                options: {
                    "A": "Iklan viral TikTok",
                    "B": "Halaman 'Pricing' / Harga",
                    "C": "Studi kasus atau webinar",
                    "D": "Postingan blog 'Apa itu...'"
                },
                correct_answer: "C",
                clue: "Orang di tengah corong sudah tertarik tapi masih RAGU. Kira-kira mereka butuh sesuatu yang bersifat bukti dan pembelajaran mendalam, atau malah hiburan ringan?",
                explanation: "MOFU adalah tahap consideration. Audiens sedang membandingkan solusi, jadi konten pemberi bukti dan wawasan mendalam — studi kasus, webinar, perbandingan produk — paling efektif menggeser mereka menuju keputusan.",
                funFact: "Fakta: mayoritas marketer B2B menilai studi kasus sebagai konten paling ampuh untuk mengubah prospek jadi pelanggan."
            }
        ]
    },
    "q3": {
        title: "Kuis: Platform Fundamentals",
        questions: [
            {
                slide_number: 1,
                question: "Platform mana yang umumnya lebih berfokus pada konten visual estetik dan 'aspirational'?",
                options: { "A": "TikTok", "B": "LinkedIn", "C": "Instagram", "D": "Facebook" },
                correct_answer: "C",
                clue: "Pikirkan platform yang identik dengan feed estetik, foto lifestyle, dan konten yang memicu reaksi 'wow, keren!' — bukan platform teks profesional atau video cepat.",
                explanation: "Instagram dibangun di atas estetika visual: grid rapi, foto berkualitas, konten aspirasional. Bandingkan: TikTok unggul di video cepat & autentik, LinkedIn di konten profesional B2B, Facebook di komunitas. Memilih platform = mencocokkan format konten dengan budaya platformnya.",
                funFact: "Fakta unik: Instagram awalnya bernama 'Burbn' — aplikasi check-in lokasi! Fitur fotonya justru paling disukai user, akhirnya seluruh aplikasi di-pivot jadi platform foto."
            }
        ]
    },
    "q4": {
        title: "Kuis: On-Page SEO Basics",
        questions: [
            {
                slide_number: 1,
                question: "Elemen on-page mana yang paling menentukan keputusan klik di hasil pencarian?",
                options: { "A": "Warna tombol CTA", "B": "Tag judul (Title Tag)", "C": "Jumlah followers", "D": "Panjang nama domain" },
                correct_answer: "B",
                clue: "Ingat saat kamu melihat halaman hasil Google: ada judul biru besar, URL, dan deskripsi kecil. Elemen mana yang PERTAMA membentuk kesan sebelum kamu memutuskan klik?",
                explanation: "Title tag adalah judul biru besar di hasil pencarian — elemen pertama yang dibaca pengguna sebelum memutuskan klik. Title yang mengandung keyword dan menarik langsung mendongkrak CTR, yang menjadi sinyal positif bagi ranking.",
                funFact: "Tahukah kamu? Google hanya menampilkan sekitar 50–60 karakter title tag. Lebih dari itu? Judulmu dipotong jadi '...' — taruh keyword utama di awal!"
            },
            {
                slide_number: 2,
                question: "Panjang ideal meta description agar tidak terpotong di Google adalah...",
                options: { "A": "10–20 karakter", "B": "50–60 karakter", "C": "150–160 karakter", "D": "300–500 karakter" },
                correct_answer: "C",
                clue: "Terlalu pendek = ruang promosi terbuang. Terlalu panjang = terpotong jadi '...'. Google memberi ruang cukup untuk 1–2 kalimat penuh.",
                explanation: "Meta description ideal ±150–160 karakter agar tampil utuh di halaman hasil pencarian. Meski bukan faktor ranking langsung, deskripsi yang menarik meningkatkan CTR — dan CTR yang tinggi memberi sinyal relevansi ke Google.",
                funFact: "Ironi SEO: meta description TIDAK memengaruhi ranking langsung — tapi memengaruhi CTR, dan CTR tinggi justru mendongkrak ranking. Jadi tetap wajib ditulis menarik!"
            }
        ]
    },
    "q5": {
        title: "Kuis: Content Ideation Mastery",
        questions: [
            {
                slide_number: 1,
                question: "Apa yang dimaksud dengan 'content pillar'?",
                options: {
                    "A": "Pilar dekorasi studio foto",
                    "B": "Jenis iklan berbayar di media sosial",
                    "C": "Tema-tema utama yang menjadi fondasi seluruh konten",
                    "D": "Software penjadwalan posting"
                },
                correct_answer: "C",
                clue: "Analogi arsitektur: pilar adalah struktur utama yang menopang seluruh bangunan. Dalam konten, 'pilar' merujuk pada struktur tema — bukan alat, bukan format iklan.",
                explanation: "Content pillar adalah 3–5 tema besar yang menjadi fondasi seluruh konten sebuah brand. Dengan pilar yang jelas, ide konten jadi terarah, pesan brand konsisten, dan audiens tahu kamu ahli dalam apa.",
                funFact: "Brand besar biasanya punya 3–5 content pillar saja. Contoh: Nike berputar di sekitar 'atlet', 'inovasi', dan 'inspirasi' — nggak lebih!"
            },
            {
                slide_number: 2,
                question: "Sumber ide konten yang paling sehat dan berkelanjutan adalah...",
                options: {
                    "A": "Menyalin konten kompetitor mentah-mentah",
                    "B": "Riset keyword dan mendengarkan pertanyaan audiens",
                    "C": "Posting apa saja asal rajin",
                    "D": "Menunggu ide datang sendiri"
                },
                correct_answer: "B",
                clue: "Ide 'berkelanjutan' berarti tidak akan pernah habis. Sumber mana yang tak akan habis: pertanyaan nyata dari audiens, atau meniru orang lain?",
                explanation: "Riset keyword + mendengarkan pertanyaan audiens (komentar, forum, FAQ) adalah sumber ide tanpa batas karena selalu ada pertanyaan baru. Menyalin kompetitor membuatmu selalu selangkah di belakang; menunggu inspirasi membuat kalender konten kacau.",
                funFact: "Strategi 'They Ask, You Answer' terbukti membangun trust lebih cepat — karena kontenmu langsung menjawab kebingungan nyata audiens."
            }
        ]
    },
    "q6": {
        title: "Kuis: Technical SEO Basics",
        questions: [
            {
                slide_number: 1,
                question: "Yang dimaksud 'page speed' dalam SEO teknikal adalah...",
                options: {
                    "A": "Kecepatan penulis membuat artikel",
                    "B": "Waktu yang dibutuhkan halaman untuk dimuat",
                    "C": "Kecepatan internet penyedia layanan",
                    "D": "Jumlah gambar per halaman"
                },
                correct_answer: "B",
                clue: "Fokus pada kata 'speed' dari sudut pandang pengunjung: berapa lama ia harus MENUNGGU sebelum halaman bisa dibaca?",
                explanation: "Page speed adalah durasi yang dibutuhkan halaman untuk termuat dan siap diakses. Ini faktor ranking sekaligus pengalaman pengguna: lebih dari separuh pengunjung mobile meninggalkan situs yang loading lebih dari 3 detik.",
                funFact: "Angka yang mengejutkan: lebih dari separuh pengunjung mobile langsung kabur jika website loading lebih dari 3 detik. Lambat = selesai."
            },
            {
                slide_number: 2,
                question: "Mengapa website wajib 'mobile-friendly'?",
                options: {
                    "A": "Supaya terlihat mahal dan premium",
                    "B": "Karena laptop sudah jarang digunakan",
                    "C": "Karena Google menggunakan mobile-first indexing",
                    "D": "Sebenarnya tidak wajib"
                },
                correct_answer: "C",
                clue: "Google tidak menilai dari 'tampilan premium'. Pikirkan: dari perangkat apa mayoritas orang membuka website hari ini — dan bagaimana Google menyesuaikan diri?",
                explanation: "Sejak 2019 Google memakai mobile-first indexing: versi MOBILE-lah yang di-crawl dan dinilai lebih dulu. Website berantakan di HP = berantakan di mata Google, sebagus apa pun tampilan desktop-mu.",
                funFact: "Sejak 2019, Google MENILAI versi mobile-mu DULU, bukan desktop. Website jelek di HP = jelek di mata Google."
            }
        ]
    },
    "q7": {
        title: "Kuis: Social Media Content Calendar",
        questions: [
            {
                slide_number: 1,
                question: "Manfaat utama content calendar adalah...",
                options: {
                    "A": "Otomatis menambah followers",
                    "B": "Konsistensi posting dan perencanaan yang terukur",
                    "C": "Menghemat biaya iklan",
                    "D": "Menghapus komentar negatif"
                },
                correct_answer: "B",
                clue: "Apa fungsi utama kalender di dunia nyata? Ia tidak mengerjakan apa pun secara otomatis — ia memastikan sesuatu terjadi SECARA TERATUR dan terencana.",
                explanation: "Content calendar menjamin konsistensi dan perencanaan: kamu tahu kapan posting apa, konten musiman tidak terlewat, dan tim tidak panik mencari ide mendadak. Konsistensi inilah yang dipercaya algoritma dan dinantikan audiens.",
                funFact: "Konsistensi mengalahkan frekuensi: posting 3x seminggu teratur jauh lebih efektif daripada 10x sehari lalu menghilang sebulan!"
            },
            {
                slide_number: 2,
                question: "Sesuai 'rule of thirds', komposisi konten yang sehat adalah...",
                options: {
                    "A": "100% konten promosi",
                    "B": "90% promosi, 10% edukasi",
                    "C": "Tidak perlu komposisi khusus",
                    "D": "1/3 value, 1/3 interaksi, 1/3 promosi"
                },
                correct_answer: "D",
                clue: "Nama aturannya 'rule of THIRDS' — petunjuknya sudah ada di angkanya: konten dibagi menjadi tiga bagian yang seimbang.",
                explanation: "Rule of thirds membagi konten menjadi ⅓ value (edukasi/solusi), ⅓ interaksi (tanya-jawab, cerita), dan ⅓ promosi. Komposisi ini menjaga audiens tidak merasa terus-menerus dijual — penyebab utama orang unfollow.",
                funFact: "Ternyata 'rule of thirds' diadopsi dari dunia FOTOGRAFI — komposisi sepertiga membuat mata audiens berhenti dari scrolling. Seni dan marketing saudara!"
            }
        ]
    },
    "q8": {
        title: "👑 BOSS: Capstone Strategi Digital",
        questions: [
            {
                slide_number: 1,
                question: "Langkah PERTAMA menyusun strategi digital untuk bisnis baru adalah...",
                options: {
                    "A": "Riset audiens dan menetapkan tujuan (SMART goal)",
                    "B": "Langsung memasang iklan di semua platform",
                    "C": "Membeli followers agar terlihat kredibel",
                    "D": "Mendesain ulang logo"
                },
                correct_answer: "A",
                clue: "Umpamakan perang: jenderal hebat tidak langsung menyerang. Ia memetakan medan dan menetapkan target terlebih dahulu sebelum bergerak.",
                explanation: "Strategi selalu dimulai dari riset audiens + tujuan SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Tanpa ini, semua taktik — iklan, konten, desain — hanyalah tebakan mahal tanpa arah.",
                funFact: "SMART = Specific, Measurable, Achievable, Relevant, Time-bound. Kerangka legendaris ini diperkenalkan George T. Doran di jurnal Management Review tahun 1981!"
            },
            {
                slide_number: 2,
                question: "Metrik paling relevan untuk mengukur kesuksesan BISNIS (bukan vanity metric) adalah...",
                options: {
                    "A": "Jumlah likes per posting",
                    "B": "Jumlah views story",
                    "C": "Jumlah emoji di komentar",
                    "D": "Conversion rate"
                },
                correct_answer: "D",
                clue: "Likes, views, dan emoji mengukur POPULARITAS. Pertanyaannya: metrik mana yang mengukur tindakan nyata — orang melakukan aksi bernilai bisnis (membeli, mendaftar)?",
                explanation: "Conversion rate mengukur persentase orang yang melakukan aksi bernilai bisnis: membeli, mendaftar, download. Likes dan views adalah vanity metrics — terlihat bagus tapi tidak otomatis membayar tagihan.",
                funFact: "Rata-rata conversion rate e-commerce dunia hanya 2–3%. Angka kecil yang benar-benar berbicara."
            },
            {
                slide_number: 3,
                question: "Urutan funnel yang benar untuk meluncurkan produk baru adalah...",
                options: {
                    "A": "TOFU → MOFU → BOFU",
                    "B": "BOFU → TOFU",
                    "C": "MOFU saja cukup",
                    "D": "Acak asal jalan"
                },
                correct_answer: "A",
                clue: "Seperti hubungan manusia: kenalan → dekat → percaya → komitmen. Corong pemasaran mengikuti pola psikologis yang sama, dari kenal menuju beli.",
                explanation: "Peluncuran yang sehat mengalir TOFU (kenalkan masalah & brand) → MOFU (bangun kepercayaan dengan bukti) → BOFU (penawaran & CTA). Hard-sell di awal seperti melamar nikah di kencan pertama: hampir selalu ditolak.",
                funFact: "Meluncurkan produk dengan urutan funnel yang benar bisa menggandakan conversion. Hard-sell ke orang yang belum kenal kamu itu seperti melamar nikah di kencan pertama! 💍😅"
            }
        ]
    },

    // ============================================================
    // [BARU] KUIS DUNIA LAIN — sengaja 1 quest (2 slide) dulu,
    // agar ringan. Tambahkan f2, e2, a2 dst. nanti.
    // ============================================================
    "f1": {
        title: "Kuis: Fintech Fundamentals",
        questions: [
            {
                slide_number: 1,
                question: "Apa definisi paling tepat dari Fintech?",
                options: {
                    "A": "Perusahaan bank konvensional dengan gedung pencakar langit",
                    "B": "Teknologi yang memodernisasi dan mengotomatisasi layanan keuangan",
                    "C": "Aplikasi media sosial untuk pebisnis",
                    "D": "Mata uang kripto seperti Bitcoin"
                },
                correct_answer: "B",
                clue: "Pisahkan dua katanya: 'Financial' + 'Technology'. Fintech bukan institusinya, melainkan alat/cara BARU untuk layanan keuangan.",
                explanation: "Fintech (financial technology) adalah teknologi yang meningkatkan dan mengotomatisasi layanan keuangan — pembayaran, pinjaman, investasi, hingga asuransi. Fintech memperluas inklusi keuangan: orang yang tak terjangkau bank pun kini bisa transaksi lewat HP.",
                funFact: "Indonesia termasuk negara dengan adopsi fintech tertinggi di dunia — survei EY pernah menempatkan adopsi fintech Indonesia DI ATAS rata-rata global!"
            },
            {
                slide_number: 2,
                question: "Fungsi utama payment gateway (seperti Midtrans/Xendit) dalam e-commerce adalah...",
                options: {
                    "A": "Menyimpan stok barang toko",
                    "B": "Menghubungkan semua metode pembayaran menjadi satu integrasi",
                    "C": "Menggantikan jasa kurir pengiriman",
                    "D": "Mendesain tampilan website toko"
                },
                correct_answer: "B",
                clue: "Bayangkan seorang 'penerjemah': uang datang dengan banyak 'bahasa' (virtual account, e-wallet, kartu, QRIS) — siapa yang menerjemahkannya agar bisnis cukup menerima satu bahasa?",
                explanation: "Payment gateway mengagregasi berbagai metode pembayaran (VA, e-wallet, kartu kredit, QRIS) ke SATU integrasi API, lengkap dengan lapisan keamanan. Tanpa ini, merchant harus berintegrasi manual dengan puluhan penyedia satu per satu.",
                funFact: "QRIS diluncurkan Bank Indonesia pada 2019 — satu kode QR untuk SEMUA e-wallet dan m-banking. Beres dari satu titik!"
            }
        ]
    },
    //SOAL TAMBAHAN FINTECH
    "f2": {
        title: "Lanskap Ekosistem Fintech & Disrupsi Perbankan Tradisional",
        questions: [
            {
                slide_number: 1,
                question: "Faktor utama apakah yang membedakan pendekatan inovasi Fintech dibandingkan perbankan konvensional dalam menyediakan layanan keuangan?",
                options: {
                    "A": "Perbankan konvensional sepenuhnya bergantung pada modal asing, sedangkan fintech hanya mengandalkan dana pemerintah.",
                    "B": "Fintech memanfaatkan perangkat lunak dan teknologi modern untuk memangkas inefisiensi, sedangkan bank tradisional terhambat oleh sistem operasional warisan (legacy systems).",
                    "C": "Fintech tidak memerlukan pendaftaran atau pengawasan regulasi sama sekali untuk beroperasi.",
                    "D": "Perbankan konvensional hanya melayani transaksi internasional, sementara fintech khusus melayani transaksi tunai fisik"
                },
                correct_answer: "B",
                clue: "Cermati bagaimana sistem operasional lama (legacy systems) pada bank konvensional membatasi kelincahan inovasi jika dibandingkan dengan struktur fleksibel berbasis perangkat lunak pada startup fintech.",
                explanation: "Tepat sekali! Bank tradisional terhalang oleh sistem operasional warisan (legacy systems) dan keterbatasan fleksibilitas teknologi, sedangkan fintech hadir memanfaatkan perangkat lunak dan teknologi modern untuk menciptakan layanan keuangan yang jauh lebih efisien, lincah, dan cepat",
                funFact: "Tahukah Anda? Menurut data Bank Indonesia, volume transaksi QRIS mengalami lonjakan signifikan sebesar 148,5% pada kuartal akhir tahun 2025 dengan puluhan juta outlet baru yang mengadopsinya. Kebijakan Merchant Discount Rate (MDR) 0% untuk transaksi usaha mikro menjadi pendorong utama pesatnya adopsi pembayaran digital di seluruh Indonesia!"
            },
        ]
    },


    "e1": {
        title: "Kuis: Validasi Ide Bisnis Digital",
        questions: [
            {
                slide_number: 1,
                question: "Dalam dunia startup, apa yang dimaksud dengan MVP?",
                options: {
                    "A": "Most Valuable Player — kontributor terbaik tim",
                    "B": "Produk paling mahal dan lengkap di pasar",
                    "C": "Versi paling sederhana dari produk untuk menguji asumsi pasar",
                    "D": "Dokumen rencana bisnis setebal mungkin"
                },
                correct_answer: "C",
                clue: "Dalam konteks startup, MVP identik dengan kata 'minimum'. Tujuannya menguji ide dengan biaya & waktu PALING KECIL — bukan membuat produk sempurna.",
                explanation: "MVP (Minimum Viable Product) adalah versi produk paling sederhana yang cukup untuk menguji asumsi inti terhadap pengguna nyata. Filosofinya: jangan bangun gedung 30 lantai sebelum tahu apakah orang mau menyewa satu kamarnya.",
                funFact: "Dropbox memvalidasi idenya hanya dengan VIDEO DEMO MVP — produknya belum jadi! Hasilnya: ribuan orang mendaftar waiting list dalam semalam."
            },
            {
                slide_number: 2,
                question: "Siklus Lean Startup yang benar adalah...",
                options: {
                    "A": "Build → Measure → Learn",
                    "B": "Sell → Build → Ignore",
                    "C": "Guess → Spend → Launch",
                    "D": "Plan → Plan → Plan"
                },
                correct_answer: "A",
                clue: "Kuncinya eksperimen cepat yang berulang: buat sesuatu, ukur respons pasar nyata, pelajari hasilnya — lalu puter lagi.",
                explanation: "Siklus Build-Measure-Learn adalah jantung Lean Startup: bangun asumsi jadi eksperimen, ukur data nyata dari pengguna, pelajari, lalu putuskan bertahan (persevere) atau berubah arah (pivot). Startup gagal seringkali karena membangun terlalu lama tanpa pernah mengukur.",
                funFact: "Istilah 'pivot' yang sekarang melekat di dunia startup dipopulerkan Eric Ries lewat buku The Lean Startup (2011)!"
            }
        ]
    },
    "a1": {
        title: "Kuis: Berpikir dengan Data",
        questions: [
            {
                slide_number: 1,
                question: "Jenis analitik yang menjawab pertanyaan 'Apa yang TERJADI?' disebut...",
                options: {
                    "A": "Predictive Analytics",
                    "B": "Descriptive Analytics",
                    "C": "Prescriptive Analytics",
                    "D": "Diagnostic Analytics"
                },
                correct_answer: "B",
                clue: "Perhatikan kata kerjanya: 'mendeskripsikan' = menceritakan sesuatu yang SUDAH LEWAT lewat angka, grafik, dan laporan.",
                explanation: "Ada 4 tingkatan analitik: Descriptive (apa yang terjadi), Diagnostic (mengapa terjadi), Predictive (apa yang akan terjadi), dan Prescriptive (apa yang sebaiknya dilakukan). Descriptive adalah fondasi — kamu tak bisa memprediksi masa depan jika tak paham masa lalu.",
                funFact: "Perusahaan berbasis data (data-driven) diklaim jauh lebih besar peluangnya mengakuisisi pelanggan dan mempertahankannya dibanding kompetitor yang mengandalkan firasat!"
            },
            {
                slide_number: 2,
                question: "Manakah yang BUKAN termasuk vanity metric?",
                options: {
                    "A": "Jumlah followers",
                    "B": "Jumlah page views",
                    "C": "Conversion rate",
                    "D": "Jumlah likes"
                },
                correct_answer: "C",
                clue: "Uji satu pertanyaan: apakah metrik ini menunjukkan AKSI nyata bernilai bisnis (membeli, mendaftar) — atau sekadar popularitas penampilan?",
                explanation: "Conversion rate mengukur persentase pengunjung yang melakukan aksi bernilai (beli, daftar, download) — langsung terhubung ke pendapatan. Followers, views, dan likes terasa membanggakan tapi bisa tinggi tanpa menghasilkan uang sepeser pun.",
                funFact: "Konsep 'vanity vs actionable metrics' dipopulerkan oleh buku Lean Analytics — wajib baca calon founder & marketer berbasis data!"
            }
        ]
    }
};
