// ============================================================
// TRANCENSION ACADEMY — DATABASE KUIS
// [v2] Setiap pertanyaan kini punya field "funFact" yang
//      muncul di popup setelah user menjawab semua benar.
// ============================================================

const quizData = {
    "q1": {
        title: "Kuis: Keyword Research 101",
        questions: [
            {
                q: "Keyword 'beli sepatu running murah' termasuk dalam tipe keyword...",
                options: { a: "Informational", b: "Transactional", c: "Navigational", d: "Geografis" },
                answer: "b",
                funFact: "Fakta unik: keyword transaksional seperti 'beli' dan 'harga' punya conversion rate 2–5x lebih tinggi daripada keyword informational — karena orangnya sudah siap membayar!"
            },
            {
                q: "Keyword yang diketik untuk menuju situs tertentu (contoh: 'instagram login') disebut...",
                options: { a: "Transactional", b: "Informational", c: "Navigational", d: "Commercial" },
                answer: "c",
                funFact: "Tahukah kamu? Sekitar 15% pencarian di Google setiap harinya adalah pencarian yang BELUM PERNAH diketik siapa pun sebelumnya!"
            }
        ]
    },
    "q2": {
        title: "Kuis: The Marketing Funnel",
        questions: [
            {
                q: "Tahap 'TOFU' (Top of Funnel) berfokus untuk...",
                options: {
                    a: "Menghasilkan penjualan langsung",
                    b: "Membangun kesadaran (Awareness)",
                    c: "Membuat audiens mempertimbangkan produk",
                    d: "Menjaga loyalitas pelanggan"
                },
                answer: "b",
                funFact: "Istilah 'marketing funnel' dipopulerkan oleh E. St. Elmo Lewis pada tahun 1898 — konsep ini sudah berusia lebih dari 120 tahun!"
            },
            {
                q: "Konten apa yang paling cocok untuk tahap 'MOFU' (Middle of Funnel)?",
                options: {
                    a: "Iklan viral TikTok",
                    b: "Halaman 'Pricing' / Harga",
                    c: "Studi kasus atau webinar",
                    d: "Postingan blog 'Apa itu...'"
                },
                answer: "c",
                funFact: "Fakta: studi kasus adalah senjata rahasia B2B — mayoritas marketer B2B menilai studi kasus sebagai konten paling ampuh untuk mengubah prospek jadi pelanggan."
            }
        ]
    },
    "q3": {
        title: "Kuis: Platform Fundamentals",
        questions: [
            {
                q: "Platform mana yang umumnya lebih berfokus pada konten visual estetik dan 'aspirational'?",
                options: { a: "TikTok", b: "LinkedIn", c: "Instagram", d: "Facebook" },
                answer: "c",
                funFact: "Fakta unik: Instagram awalnya bernama 'Burbn' — aplikasi check-in lokasi seperti Foursquare! Fitur foto-nya justru yang paling disukai user, akhirnya seluruh aplikasi di-pivot jadi platform foto."
            }
        ]
    },
    "q4": {
        title: "Kuis: On-Page SEO Basics",
        questions: [
            {
                q: "Elemen on-page mana yang paling menentukan keputusan klik di hasil pencarian?",
                options: { a: "Warna tombol CTA", b: "Tag judul (Title Tag)", c: "Jumlah followers", d: "Panjang nama domain" },
                answer: "b",
                funFact: "Tahukah kamu? Google hanya menampilkan sekitar 50–60 karakter title tag. Lebih dari itu? Judulmu dipotong jadi '...' — jadi keyword utama harus di awal!"
            },
            {
                q: "Panjang ideal meta description agar tidak terpotong di Google adalah...",
                options: { a: "10–20 karakter", b: "50–60 karakter", c: "150–160 karakter", d: "300–500 karakter" },
                answer: "c",
                funFact: "Ironi SEO: meta description TIDAK memengaruhi ranking secara langsung — tapi memengaruhi jumlah klik (CTR), dan CTR yang tinggi justru mendongkrak ranking. Jadi tetap wajib ditulis dengan menarik!"
            }
        ]
    },
    "q5": {
        title: "Kuis: Content Ideation Mastery",
        questions: [
            {
                q: "Apa yang dimaksud dengan 'content pillar'?",
                options: {
                    a: "Pilar dekorasi studio foto",
                    b: "Jenis iklan berbayar di media sosial",
                    c: "Tema-tema utama yang menjadi fondasi seluruh konten",
                    d: "Software penjadwalan posting"
                },
                answer: "c",
                funFact: "Brand besar biasanya punya 3–5 content pillar saja. Contoh: Nike berputar di sekitar 'atlet', 'inovasi', dan 'inspirasi' — nggak lebih dari itu!"
            },
            {
                q: "Sumber ide konten yang paling sehat dan berkelanjutan adalah...",
                options: {
                    a: "Menyalin konten kompetitor mentah-mentah",
                    b: "Riset keyword dan mendengarkan pertanyaan audiens",
                    c: "Posting apa saja asal rajin",
                    d: "Menunggu ide datang sendiri"
                },
                answer: "b",
                funFact: "Strategi 'They Ask, You Answer' (mereka bertanya, kamu jawab) terbukti membangun trust jauh lebih cepat — karena kontenmu langsung menjawab kebingungan nyata audiens."
            }
        ]
    },
    "q6": {
        title: "Kuis: Technical SEO Basics",
        questions: [
            {
                q: "Yang dimaksud 'page speed' dalam SEO teknikal adalah...",
                options: {
                    a: "Kecepatan penulis membuat artikel",
                    b: "Waktu yang dibutuhkan halaman untuk dimuat",
                    c: "Kecepatan internet penyedia layanan",
                    d: "Jumlah gambar per halaman"
                },
                answer: "b",
                funFact: "Angka yang mengejutkan: lebih dari separuh pengunjung mobile langsung kabur jika website loading lebih dari 3 detik. Lambat = selesai."
            },
            {
                q: "Mengapa website wajib 'mobile-friendly'?",
                options: {
                    a: "Supaya terlihat mahal dan premium",
                    b: "Karena laptop sudah jarang digunakan",
                    c: "Karena Google menggunakan mobile-first indexing",
                    d: "Sebenarnya tidak wajib"
                },
                answer: "c",
                funFact: "Sejak 2019, Google memakai mobile-first indexing: Google MENILAI versi mobile-mu DULU, bukan versi desktop. Website jelek di HP = jelek di mata Google."
            }
        ]
    },
    "q7": {
        title: "Kuis: Social Media Content Calendar",
        questions: [
            {
                q: "Manfaat utama content calendar adalah...",
                options: {
                    a: "Otomatis menambah followers",
                    b: "Konsistensi posting dan perencanaan yang terukur",
                    c: "Menghemat biaya iklan",
                    d: "Menghapus komentar negatif"
                },
                answer: "b",
                funFact: "Konsistensi mengalahkan frekuensi: posting 3x seminggu secara teratur jauh lebih efektif daripada posting 10x dalam sehari lalu menghilang selama sebulan!"
            },
            {
                q: "Sesuai 'rule of thirds', komposisi konten yang sehat adalah...",
                options: {
                    a: "100% konten promosi",
                    b: "90% promosi, 10% edukasi",
                    c: "Tidak perlu komposisi khusus",
                    d: "1/3 value, 1/3 interaksi, 1/3 promosi"
                },
                answer: "d",
                funFact: "Ternyata 'rule of thirds' diadopsi dari dunia FOTOGRAFI — komposisi sepertiga membuat mata audiens 'berhenti' dari scrolling. Seni dan marketing ternyata saudara!"
            }
        ]
    },
    "q8": {
        title: "👑 BOSS: Capstone Strategi Digital",
        questions: [
            {
                q: "Langkah PERTAMA menyusun strategi digital untuk bisnis baru adalah...",
                options: {
                    a: "Riset audiens dan menetapkan tujuan (SMART goal)",
                    b: "Langsung memasang iklan di semua platform",
                    c: "Membeli followers agar terlihat kredibel",
                    d: "Mendesain ulang logo"
                },
                answer: "a",
                funFact: "SMART = Specific, Measurable, Achievable, Relevant, Time-bound. Kerangka legendaris ini pertama kali diperkenalkan oleh George T. Doran di jurnal Management Review tahun 1981!"
            },
            {
                q: "Metrik paling relevan untuk mengukur kesuksesan BISNIS (bukan vanity metric) adalah...",
                options: {
                    a: "Jumlah likes per posting",
                    b: "Jumlah views story",
                    c: "Jumlah emoji di komentar",
                    d: "Conversion rate"
                },
                answer: "d",
                funFact: "Likes dan views disebut 'vanity metrics' — bikin senang tapi tidak membayar tagihan. Rata-rata conversion rate e-commerce dunia hanya 2–3%. Itu angka yang benar-benar berbicara."
            },
            {
                q: "Urutan funnel yang benar untuk meluncurkan produk baru adalah...",
                options: {
                    a: "TOFU → MOFU → BOFU",
                    b: "BOFU → TOFU",
                    c: "MOFU saja cukup",
                    d: "Acak asal jalan"
                },
                answer: "a",
                funFact: "Meluncurkan produk dengan urutan funnel yang benar bisa menggandakan conversion. Hard-sell ke orang yang belum kenal kamu itu seperti melamar nikah di kencan pertama! 💍😅"
            }
        ]
    }
};