// ============================================================
// TRANCENSION ACADEMY — Logika Game (app.js)
// [v5] World System: 4 konsentrasi + path belajar ala Duolingo
//      - Skill Tree & quest cards DIHAPUS
//      - Node unlock BERURUTAN (pengganti level/skill requirement)
//      - Fix lama dipertahankan: isAnswered reset, render setelah
//        quest selesai, save/load localStorage
// ============================================================

// --- KONFIGURASI ---
const XP_GROWTH = 1.2;
const INITIAL_XP = 30;
const SAVE_KEY = 'trancension_save_v1';   // field baru pakai default -> save lama kompatibel
const GEMS_PER_QUEST = 10;
const PATH_OFFSETS = [-60, 0, 60, 0];     // pola zig-zag node path

// --- GAME STATE ---
let currentUser = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gems: 0,
    streak: 0,
    lastQuestDate: null,        // tanggal string terakhir menyelesaikan quest
    activeWorld: 'marketing'    // dunia/konsentrasi aktif
};

const completedQuests = new Set(); // ID quest selesai (global, ID unik antar dunia)

let activeQuestData = { questId: null, xpToAdd: 0 };

// State mesin slide
let slideState = { slides: [], currentSlide: 0, isAnswered: false };

// --- DOM ELEMENTS ---
const xpBar = document.getElementById('xpBar');
const xpText = document.getElementById('xpText');
const levelText = document.getElementById('levelText');
const levelUpModal = document.getElementById('levelUpModal');
const newLevelText = document.getElementById('newLevelText');
const closeModalBtn = document.getElementById('closeModalBtn');

// Top bar
const worldSwitcherBtn = document.getElementById('worldSwitcherBtn');
const worldDropdown = document.getElementById('worldDropdown');
const worldSwitcherFlag = document.getElementById('worldSwitcherFlag');
const currentWorldName = document.getElementById('currentWorldName');
const streakText = document.getElementById('streakText');
const gemsText = document.getElementById('gemsText');
const topLevelText = document.getElementById('topLevelText');
const resetProgressBtn = document.getElementById('resetProgressBtn');

// Path Duolingo
const pathContainer = document.getElementById('pathContainer');
const pathWorldName = document.getElementById('pathWorldName');

// Kuis (slide engine)
const quizModal = document.getElementById('quizModal');
const quizTitle = document.getElementById('quizTitle');
const closeQuizBtn = document.getElementById('closeQuizBtn');
const slideCounter = document.getElementById('slideCounter');
const slideProgressBar = document.getElementById('slideProgressBar');
const slideQuestion = document.getElementById('slideQuestion');
const slideOptions = document.getElementById('slideOptions');
const clueBox = document.getElementById('clueBox');
const clueText = document.getElementById('clueText');
const explanationBox = document.getElementById('explanationBox');
const explanationText = document.getElementById('explanationText');
const nextSlideBtn = document.getElementById('nextSlideBtn');

// Fun Fact
const funFactModal = document.getElementById('funFactModal');
const funFactText = document.getElementById('funFactText');
const funFactContinueBtn = document.getElementById('funFactContinueBtn');

// ============================================================
// SAVE SYSTEM (diperluas — tetap kompatibel dengan save lama)
// ============================================================

function saveGame() {
    const saveData = {
        level: currentUser.level,
        xp: currentUser.xp,
        xpToNextLevel: currentUser.xpToNextLevel,
        quests: Array.from(completedQuests),
        gems: currentUser.gems,
        streak: currentUser.streak,
        lastQuestDate: currentUser.lastQuestDate,
        activeWorld: currentUser.activeWorld
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    try {
        const s = JSON.parse(raw);
        currentUser.level = s.level || 1;
        currentUser.xp = s.xp || 0;
        currentUser.xpToNextLevel = s.xpToNextLevel || 100;
        (s.quests || []).forEach(id => completedQuests.add(id));
        // [BARU] field world-system, pakai default jika save lama
        currentUser.gems = s.gems || 0;
        currentUser.streak = s.streak || 0;
        currentUser.lastQuestDate = s.lastQuestDate || null;
        currentUser.activeWorld = s.activeWorld || 'marketing';
        return true;
    } catch (e) {
        console.error('Save data rusak, dihapus:', e);
        localStorage.removeItem(SAVE_KEY);
        return false;
    }
}

function resetGame() {
    const konfirmasi = confirm(
        'Yakin ingin menghapus SEMUA progres?\n' +
        'Level, XP, gem, streak, dan quest selesai akan hilang permanen.'
    );
    if (konfirmasi) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// ============================================================
// WORLD SYSTEM
// ============================================================

function getConcentration(id) {
    return CONCENTRATIONS.find(c => c.id === id) || CONCENTRATIONS[0];
}

function getFlatQuests(conc) {
    return conc.units.flatMap(u => u.quests);
}

/**
 * Status sebuah node: 'done' | 'current' | 'locked'
 * Aturan Duolingo: node pertama selalu terbuka; node berikutnya
 * terbuka setelah node SEBELUMNYA selesai (unlock berurutan).
 */
function getQuestState(qid, flatQuests) {
    if (completedQuests.has(qid)) return 'done';
    const idx = flatQuests.indexOf(qid);
    if (idx <= 0) return 'current';
    return completedQuests.has(flatQuests[idx - 1]) ? 'current' : 'locked';
}

function markActiveWorldOption() {
    worldDropdown.querySelectorAll('[data-world]').forEach(b => {
        b.classList.toggle('active-world', b.dataset.world === currentUser.activeWorld);
    });
}

function renderPath() {
    const conc = getConcentration(currentUser.activeWorld);
    const flat = getFlatQuests(conc);

    // Terapkan tema & label dunia
    document.body.dataset.theme = conc.theme;
    currentWorldName.textContent = conc.name;
    worldSwitcherFlag.textContent = conc.flag;
    pathWorldName.textContent = conc.name;
    markActiveWorldOption();

    let html = '';
    let nodeIndex = 0;

    conc.units.forEach(unit => {
        // Banner unit ala Duolingo (warna mengikuti tema dunia)
        html += `
            <div class="unit-banner rounded-xl p-4 md:p-5 mb-2 shadow-lg">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <h3 class="text-xl font-extrabold">${unit.title}</h3>
                        <p class="text-sm opacity-90">${unit.subtitle}</p>
                    </div>
                    <span class="text-3xl" aria-hidden="true">📘</span>
                </div>
            </div>`;

        html += '<div class="path-wrap">';

        unit.quests.forEach(qid => {
            const state = getQuestState(qid, flat);
            const quiz = quizData[qid];
            const offset = PATH_OFFSETS[nodeIndex % PATH_OFFSETS.length];
            const icon = state === 'done' ? '✓' : (state === 'current' ? '★' : '🔒');
            const cleanTitle = quiz ? quiz.title.replace(/^Kuis:\s*/, '').replace(/^👑 BOSS:\s*/, 'BOSS: ') : qid;
            const bubble = state === 'current' ? '<span class="start-bubble">MULAI</span>' : '';

            html += `
                <div class="path-row">
                    <button type="button" class="path-node ${state}" data-quest-id="${qid}"
                        style="transform:translateX(${offset}px)"
                        title="${cleanTitle} (+${QUEST_XP[qid] || 0} XP)"
                        ${state === 'locked' ? 'disabled' : ''}>
                        ${bubble}<span>${icon}</span>
                    </button>
                </div>`;

            nodeIndex++;
        });

        html += '</div>';
    });

    pathContainer.innerHTML = html;
}

function switchWorld(worldId) {
    if (currentUser.activeWorld === worldId) return;
    currentUser.activeWorld = worldId;
    saveGame();      // pilihan dunia ikut tersimpan
    renderPath();    // seluruh path berganti materi + tema warna
}

// ============================================================
// STREAK & GEMS
// ============================================================

function touchStreak() {
    const today = new Date().toDateString();
    if (currentUser.lastQuestDate === today) return; // sudah aktivitas hari ini

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    currentUser.streak = (currentUser.lastQuestDate === yesterday) ? currentUser.streak + 1 : 1;
    currentUser.lastQuestDate = today;
}

function normalizeStreak() {
    // Dipanggil saat load: streak hangus jika tidak aktif kemarin & hari ini
    if (!currentUser.lastQuestDate) { currentUser.streak = 0; return; }
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (currentUser.lastQuestDate !== today && currentUser.lastQuestDate !== yesterday) {
        currentUser.streak = 0;
    }
}

// ============================================================
// FUNGSI INTI
// ============================================================

function updateUI() {
    const xpPercentage = (currentUser.xp / currentUser.xpToNextLevel) * 100;
    xpBar.style.width = `${xpPercentage}%`;
    xpText.textContent = `${currentUser.xp} / ${currentUser.xpToNextLevel} XP`;
    levelText.textContent = `Level ${currentUser.level}`;
    topLevelText.textContent = `Lv ${currentUser.level}`;
    gemsText.textContent = currentUser.gems;
    streakText.textContent = currentUser.streak;
}

function addXP(amount) {
    currentUser.xp += amount;
    while (currentUser.xp >= currentUser.xpToNextLevel) {
        levelUp();
    }
    updateUI();
}

function levelUp() {
    currentUser.xp = currentUser.xp - currentUser.xpToNextLevel;
    currentUser.level++;
    currentUser.xpToNextLevel = Math.floor(currentUser.xpToNextLevel * XP_GROWTH);
    newLevelText.textContent = `Level ${currentUser.level}`;
    levelUpModal.classList.remove('hidden');
}

/**
 * [PENTING] Urutan 3 fase dipertahankan dari fix lama:
 * 1. Perbarui STATE (quest selesai, gem, streak)
 * 2. Picu updateUI (addXP) — level up dicek di sini
 * 3. Simpan + renderPath() -> node BERIKUTNYA langsung terbuka
 *    tanpa perlu refresh! (pola sama dengan fix Boss Quest dulu)
 */
function completeQuest() {
    const { questId, xpToAdd } = activeQuestData;

    // FASE 1: state
    completedQuests.add(questId);
    currentUser.gems += GEMS_PER_QUEST;
    touchStreak();

    // FASE 2: update UI / level up
    addXP(xpToAdd);

    // FASE 3: simpan + refresh path agar node berikutnya terbuka seketika
    saveGame();
    renderPath();
}

// ============================================================
// SLIDE ENGINE (dengan fix isAnswered per-slide)
// ============================================================

function loadQuiz(questId) {
    const quiz = quizData[questId];
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        console.error('Data kuis tidak ditemukan untuk quest:', questId);
        return;
    }

    quizTitle.textContent = quiz.title;
    slideState = { slides: quiz.questions, currentSlide: 0, isAnswered: false };

    renderSlide();
    quizModal.classList.remove('hidden');
}

function renderSlide() {
    // [FIX] Slide baru SELALU berstatus "belum dijawab".
    // Tanpa reset ini, isAnswered basi dari slide sebelumnya
    // membuat semua tombol opsi di slide berikutnya mati.
    slideState.isAnswered = false;

    const slide = slideState.slides[slideState.currentSlide];
    const total = slideState.slides.length;

    slideCounter.textContent = `Slide ${slideState.currentSlide + 1} / ${total}`;
    slideProgressBar.style.width = `${(slideState.currentSlide / total) * 100}%`;
    slideQuestion.textContent = `${slideState.currentSlide + 1}. ${slide.question}`;

    clueBox.classList.add('hidden');
    explanationBox.classList.add('hidden');
    nextSlideBtn.classList.add('hidden');

    let optionsHTML = '';
    for (const [letter, text] of Object.entries(slide.options)) {
        optionsHTML += `
            <button type="button" data-letter="${letter}"
                class="option-btn w-full text-left bg-gray-700 hover:bg-gray-600 border-2 border-transparent rounded-lg px-4 py-3 transition duration-150">
                <span class="font-bold text-cyan-400 mr-2">${letter}.</span>${text}
            </button>`;
    }
    slideOptions.innerHTML = optionsHTML;
}

function handleOptionClick(button) {
    if (slideState.isAnswered || button.disabled) return;

    const slide = slideState.slides[slideState.currentSlide];
    const letter = button.dataset.letter;

    if (letter === slide.correct_answer) {
        slideState.isAnswered = true;
        button.classList.add('option-correct');
        slideOptions.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

        explanationText.textContent = slide.explanation;
        explanationBox.classList.remove('hidden');

        const total = slideState.slides.length;
        slideProgressBar.style.width = `${((slideState.currentSlide + 1) / total) * 100}%`;

        const isLastSlide = slideState.currentSlide === total - 1;
        nextSlideBtn.textContent = isLastSlide ? '🎉 Selesai & Lihat Hasil' : 'Slide Berikutnya ➜';
        nextSlideBtn.classList.remove('hidden');
    } else {
        button.classList.add('option-wrong', 'shake');
        button.disabled = true;
        clueText.textContent = slide.clue;
        clueBox.classList.remove('hidden');
    }
}

function showFunFact() {
    const quiz = quizData[activeQuestData.questId];
    const facts = (quiz.questions || []).map(q => q.funFact).filter(Boolean);

    if (facts.length > 0) {
        funFactText.textContent = facts[Math.floor(Math.random() * facts.length)];
    } else {
        funFactText.textContent = 'Kerja bagus! Kamu menyelesaikan quest ini dengan sempurna.';
    }

    funFactModal.classList.remove('hidden');
}

// ============================================================
// EVENT LISTENERS
// ============================================================

// Klik node path (event delegation)
pathContainer.addEventListener('click', function (e) {
    const btn = e.target.closest('.path-node');
    if (!btn || btn.disabled) return;

    const qid = btn.dataset.questId;
    if (completedQuests.has(qid)) return; // node selesai tak bisa diulang (anti-farming XP)

    activeQuestData = { questId: qid, xpToAdd: QUEST_XP[qid] || 20 };
    loadQuiz(qid);
});

// World Switcher
worldSwitcherBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    worldDropdown.classList.toggle('hidden');
});

worldDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
    const option = e.target.closest('[data-world]');
    if (!option) return;
    switchWorld(option.dataset.world);
    worldDropdown.classList.add('hidden');
});

document.addEventListener('click', function () {
    worldDropdown.classList.add('hidden'); // klik di luar -> tutup dropdown
});

// Slide engine
slideOptions.addEventListener('click', function (e) {
    const button = e.target.closest('.option-btn');
    if (!button) return;
    handleOptionClick(button);
});

nextSlideBtn.addEventListener('click', function () {
    if (!slideState.isAnswered) return;

    if (slideState.currentSlide < slideState.slides.length - 1) {
        slideState.currentSlide++;
        renderSlide();
    } else {
        quizModal.classList.add('hidden');
        showFunFact();
    }
});

closeQuizBtn.addEventListener('click', function () {
    quizModal.classList.add('hidden');
});

// Fun Fact -> selesaikan quest
funFactContinueBtn.addEventListener('click', function () {
    funFactModal.classList.add('hidden');
    completeQuest();
});

closeModalBtn.addEventListener('click', function () {
    levelUpModal.classList.add('hidden');
});

if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', resetGame);
}

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', function () {
    if (typeof quizData === 'undefined' || typeof CONCENTRATIONS === 'undefined') {
        alert('ERROR: js/quiz-data.js gagal dimuat — game tidak bisa jalan.');
        return;
    }

    const hasSave = loadGame();

    if (hasSave) {
        normalizeStreak();
        renderPath();
        updateUI();
        console.log('💾 Progres dimuat: Lv', currentUser.level, '| Dunia:', currentUser.activeWorld, '| Quest selesai:', completedQuests.size);
    } else {
        addXP(INITIAL_XP);
        saveGame();
        renderPath();
        updateUI();
        console.log('🆕 Game baru dimulai.');
    }
});
