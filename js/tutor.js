// ============================================================
// TRANCENSION ACADEMY — AI Tutor Bisnis Digital (tutor.js)
// [v7] Port dari mesin Streamlit (Python) ke JavaScript murni:
//      stopwords -> kata kunci -> skor relevansi -> potongan paragraf
// CATATAN JUJUR: ini retrieval-based tutor (mencari & menampilkan
// materi terbaik), bukan LLM yang merangkai kalimat sendiri.
// ============================================================

// ---------- STOPWORDS (port dari versi Python) ----------
const TUTOR_STOPWORDS = new Set([
    "yang", "dan", "di", "ke", "dari", "pada", "dengan", "untuk", "dalam",
    "adalah", "itu", "ini", "atau", "apa", "bagaimana", "mengapa",
    "sebutkan", "jelaskan", "tentang", "suatu", "sebuah", "secara",
    "merupakan", "dapat", "akan", "sebagai", "oleh", "lebih", "juga",
    "tidak", "tersebut"
]);

// ---------- DOM ----------
const tutorChatLog = document.getElementById('tutorChatLog');
const tutorForm = document.getElementById('tutorForm');
const tutorInput = document.getElementById('tutorInput');
const tutorChips = document.getElementById('tutorChips');
const tutorScope = document.getElementById('tutorScope');

// ---------- PORT LOGIKA PYTHON ----------

function bersihkanTeks(teks) {
    teks = teks.toLowerCase();
    teks = teks.replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, " ");
    teks = teks.replace(/\s+/g, " ");
    return teks.trim();
}

function ambilKataKunci(pertanyaan) {
    return bersihkanTeks(pertanyaan)
        .split(" ")
        .filter(k => k.length > 2 && !TUTOR_STOPWORDS.has(k));
}

function hitungRelevansi(pertanyaan, isi) {
    const kataKunci = ambilKataKunci(pertanyaan);
    if (kataKunci.length === 0) return 0;

    const teksDatabase = bersihkanTeks(isi);

    // "Counter" versi JS: frekuensi tiap kata
    const frekuensi = new Map();
    for (const kata of teksDatabase.split(' ')) {
        if (!kata) continue;
        frekuensi.set(kata, (frekuensi.get(kata) || 0) + 1);
    }

    let skor = 0;
    for (const kata of kataKunci) {
        if (frekuensi.has(kata)) {
            let jumlah = frekuensi.get(kata);
            if (jumlah > 10) jumlah = 10; // cap, sama seperti versi Python
            skor += jumlah;
        }
    }

    // Bonus jika pertanyaan muncul persis di materi
    if (teksDatabase.includes(bersihkanTeks(pertanyaan))) skor += 20;

    return skor;
}

function cariMateri(pertanyaan) {
    const scope = tutorScope ? tutorScope.value : 'all';
    const docs = (typeof KNOWLEDGE_BASE !== 'undefined' ? KNOWLEDGE_BASE : [])
        .filter(d => scope === 'all' || d.world === scope);

    return docs
        .map(d => ({ ...d, skor: hitungRelevansi(pertanyaan, d.isi) }))
        .filter(d => d.skor > 0)
        .sort((a, b) => b.skor - a.skor);
}

function ambilPotonganRelevan(pertanyaan, isi, maksimal = 1800) {
    const kataKunci = ambilKataKunci(pertanyaan);
    const paragraf = isi.split(/\n\s*\n/);

    const hasil = [];
    for (const p of paragraf) {
        const teks = bersihkanTeks(p);
        const skor = kataKunci.reduce((n, kata) => n + (teks.includes(kata) ? 1 : 0), 0);
        if (skor > 0) hasil.push({ skor, paragraf: p.trim() });
    }
    hasil.sort((a, b) => b.skor - a.skor);

    let jawaban = '';
    for (const h of hasil) {
        if (jawaban.length + h.paragraf.length <= maksimal) {
            jawaban += h.paragraf + '\n\n';
        }
    }

    if (!jawaban) jawaban = isi.slice(0, maksimal);
    return jawaban.trim();
}

// ---------- RENDER CHAT ----------

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;")
              .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function nl2br(escaped) {
    return escaped.replace(/\n/g, '<br>');
}

function worldBadge(worldId) {
    const c = (typeof CONCENTRATIONS !== 'undefined')
        ? CONCENTRATIONS.find(x => x.id === worldId) : null;
    return c ? `${c.flag} ${c.name}` : 'Materi Umum';
}

function scrollChat() {
    tutorChatLog.scrollTop = tutorChatLog.scrollHeight;
}

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'msg msg-user';
    div.textContent = text; // textContent = aman dari injeksi HTML
    tutorChatLog.appendChild(div);
    scrollChat();
}

function addTutorMessage(html) {
    const div = document.createElement('div');
    div.className = 'msg msg-tutor';
    div.innerHTML = html; // html dibangun dari konten yang sudah di-escape
    tutorChatLog.appendChild(div);
    scrollChat();
    return div;
}

function formatJawaban(doc, jawaban) {
    return `${nl2br(escapeHTML(jawaban))}
        <p class="msg-source">Sumber: ${doc.nama} • ${worldBadge(doc.world)}</p>`;
}

function addRelatedMessages(pertanyaan, related) {
    let html = '<p class="font-bold text-sm mb-1">📚 Materi terkait:</p>';
    related.forEach(r => {
        const potongan = nl2br(escapeHTML(ambilPotonganRelevan(pertanyaan, r.isi, 800)));
        html += `
            <details class="related-details">
                <summary>${r.nama} • ${worldBadge(r.world)}</summary>
                <p class="mt-2 text-sm leading-relaxed">${potongan}</p>
            </details>`;
    });
    addTutorMessage(html);
}

// ---------- ALUR TANYA JAWAB ----------

let tutorBusy = false;

function handleAsk(pertanyaan) {
    if (tutorBusy) return;
    tutorBusy = true;

    addUserMessage(pertanyaan);
    const typing = addTutorMessage('<span class="typing">🔍 Mencari materi yang relevan…</span>');

    setTimeout(() => {
        typing.remove();
        const hasil = cariMateri(pertanyaan);

        if (hasil.length === 0) {
            addTutorMessage(
                'Hmm, saya belum menemukan materi yang cocok untuk pertanyaan itu. 🤔<br>' +
                'Coba kata kunci yang lebih spesifik — misalnya <i>SEO</i>, <i>payment gateway</i>, <i>MVP</i>, atau <i>conversion rate</i>.'
            );
            tutorBusy = false;
            return;
        }

        const utama = hasil[0];
        const jawaban = ambilPotonganRelevan(pertanyaan, utama.isi, 1800);
        addTutorMessage(formatJawaban(utama, jawaban));

        if (hasil.length > 1) addRelatedMessages(pertanyaan, hasil.slice(1, 4));

        tutorBusy = false;
    }, 500);
}

// ---------- INISIALISASI ----------

const TUTOR_SUGGESTIONS = [
    'Apa itu SEO?',
    'Apa itu payment gateway?',
    'Apa itu MVP?',
    'Apa itu conversion rate?',
    'Apa itu content pillar?'
];

(function initTutor() {
    // Chip saran pertanyaan
    tutorChips.innerHTML = TUTOR_SUGGESTIONS.map(q =>
        `<button type="button" class="chip">${q}</button>`).join('');

    tutorChips.addEventListener('click', function (e) {
        const chip = e.target.closest('.chip');
        if (!chip || tutorBusy) return;
        handleAsk(chip.textContent);
    });

    tutorForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = tutorInput.value.trim();
        if (!q) return;
        tutorInput.value = '';
        handleAsk(q);
    });

    // Pesan sambutan
    const jumlahMateri = (typeof KNOWLEDGE_BASE !== 'undefined') ? KNOWLEDGE_BASE.length : 0;
    addTutorMessage(
        `Halo! 👋 Saya <b>AI Tutor Bisnis Digital</b>.<br>` +
        `Tanyakan apa saja seputar materi belajar — saya menjawab dari <b>${jumlahMateri} dokumen</b> basis pengetahuan lokal. Semua proses berjalan di browsermu, tanpa internet. 📚`
    );
})();
