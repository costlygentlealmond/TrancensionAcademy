// ============================================================
// TRANCENSION ACADEMY — Logika Game (app.js)
// [v6] Navigasi dua halaman: BELAJAR & PROFIL (ala Duolingo)
//      - Sidebar desktop + bottom nav mobile (SPA, tanpa reload)
//      - Profil: statistik, progres per dunia, pencapaian
//      - Save baru: joinedDate, totalXp, visitedWorlds (kompatibel)
// ============================================================

// --- KONFIGURASI ---
const XP_GROWTH = 1.2;
const INITIAL_XP = 30;
const SAVE_KEY = 'trancension_save_v1';
const GEMS_PER_QUEST = 10;
const PATH_OFFSETS = [-60, 0, 60, 0];

// --- GAME STATE ---
let currentUser = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gems: 0,
    streak: 0,
    lastQuestDate: null,
    activeWorld: 'marketing',
    joinedDate: null,   // [BARU] tanggal mulai bermain
    totalXp: 0          // [BARU] XP kumulatif (tidak berkurang saat level up)
};

const completedQuests = new Set();
const visitedWorlds = new Set(); // [BARU] untuk achievement "Penjelajah Dunia"

let activeQuestData = { questId: null, xpToAdd: 0 };
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
const resetProgressBtn = document.getElementById('resetProgressBtn'); // kini di halaman Profil

// Path Duolingo
const pathContainer = document.getElementById('pathContainer');
const pathWorldName = document.getElementById('pathWorldName');

// [BARU] Navigasi halaman
const pageLearn = document.getElementById('page-learn');
const pageProfile = document.getElementById('page-profile');
const navButtons = document.querySelectorAll('[data-page]');

// [BARU] Halaman Profil
const profileJoinedDate = document.getElementById('profileJoinedDate');
const profileStats = document.getElementById('profileStats');
const worldProgressList = document.getElementById('worldProgressList');
const achievementList = document.getElementById('achievementList');
const achCountText = document.getElementById('achCountText');

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
// SAVE SYSTEM (diperluas — kompatibel dengan save lama)
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
        activeWorld: currentUser.activeWorld,
        // [BARU]
        joinedDate: currentUser.joinedDate,
        totalXp: currentUser.totalXp,
        visitedWorlds: Array.from(visitedWorlds)
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
        currentUser.gems = s.gems || 0;
        currentUser.streak = s.streak || 0;
        currentUser.lastQuestDate = s.lastQuestDate || null;
        currentUser.activeWorld = s.activeWorld || 'marketing';

        // [BARU] Field v6 — pakai default/aproksimasi untuk save lama
        currentUser.joinedDate = s.joinedDate || new Date().toISOString();
        currentUser.totalXp = (typeof s.totalXp === 'number') ? s.totalXp : (s.xp || 0);
        if (Array.isArray(s.visitedWorlds)) s.visitedWorlds.forEach(w => visitedWorlds.add(w));
        visitedWorlds.add(currentUser.activeWorld);

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
        'Level, XP, gem, streak, quest, dan pencapaian akan hilang permanen.'
    );
    if (konfirmasi) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// ============================================================
// HELPER DUNIA
// ============================================================

function getConcentration(id) {
    return CONCENTRATIONS.find(c => c.id === id) || CONCENTRATIONS[0];
}

function getFlatQuests(conc) {
    return conc.units.flatMap(u => u.quests);
}

function countAllQuests() {
    return CONCENTRATIONS.reduce((sum, c) => sum + getFlatQuests(c).length, 0);
}

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

    document.body.dataset.theme = conc.theme;
    currentWorldName.textContent = conc.name;
    worldSwitcherFlag.textContent = conc.flag;
    pathWorldName.textContent = conc.name;
    markActiveWorldOption();

    let html = '';
    let nodeIndex = 0;

    conc.units.forEach(unit => {
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
    const changed = currentUser.activeWorld !== worldId;
    currentUser.activeWorld = worldId;
    visitedWorlds.add(worldId); // [BARU] tercatat untuk pencapaian
    if (changed) saveGame();
    renderPath();
}

// ============================================================
// STREAK
// ============================================================

function touchStreak() {
    const today = new Date().toDateString();
    if (currentUser.lastQuestDate === today) return;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    currentUser.streak = (currentUser.lastQuestDate === yesterday) ? currentUser.streak + 1 : 1;
    currentUser.lastQuestDate = today;
}

function normalizeStreak() {
    if (!currentUser.lastQuestDate) { currentUser.streak = 0; return; }
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (currentUser.lastQuestDate !== today && currentUser.lastQuestDate !== yesterday) {
        currentUser.streak = 0;
    }
}

// ============================================================
// [BARU] PENCAPAIAN (dihitung otomatis dari state — tanpa save ekstra)
// ============================================================

const ACHIEVEMENTS = [
    { icon: '🎯', title: 'Langkah Pertama',  desc: 'Selesaikan quest pertamamu',            check: () => completedQuests.size >= 1 },
    { icon: '📚', title: 'Setengah Jalan',   desc: 'Selesaikan 5 quest',                    check: () => completedQuests.size >= 5 },
    { icon: '👑', title: 'Penakluk Boss',    desc: 'Taklukkan quest Capstone',              check: () => completedQuests.has('q8') },
    { icon: '🧭', title: 'Penjelajah Dunia', desc: 'Kunjungi semua 4 konsentrasi',          check: () => visitedWorlds.size >= CONCENTRATIONS.length },
    { icon: '💎', title: 'Kolektor Permata', desc: 'Kumpulkan 50 gems',                     check: () => currentUser.gems >= 50 },
    { icon: '🔥', title: 'Api yang Menyala', desc: 'Streak 3 hari beruntun',                check: () => currentUser.streak >= 3 },
    { icon: '⭐', title: 'Naik Kelas',       desc: 'Capai Level 3',                         check: () => currentUser.level >= 3 },
    { icon: '🏆', title: 'Master Academy',   desc: 'Selesaikan SEMUA quest di semua dunia', check: () => completedQuests.size >= countAllQuests() }
];

// ============================================================
// [BARU] NAVIGASI HALAMAN & RENDER PROFIL
// ============================================================

function showPage(page) {
    // [DIUBAH] Versi generik: sembunyikan SEMUA halaman ber-class ".page",
    // lalu tampilkan yang diminta. Ke depan, menambah tab baru cukup:
    // <div id="page-x" class="page"> + <button data-page="x"> — tanpa
    // mengubah fungsi ini lagi.
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.remove('hidden');

    navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));

    if (page === 'profile') renderProfile();
    window.scrollTo({ top: 0 });
}
function renderProfile() {
    // 1. Tanggal bergabung
    if (currentUser.joinedDate) {
        const d = new Date(currentUser.joinedDate);
        profileJoinedDate.textContent = 'Bergabung ' +
            d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }

    // 2. Kartu statistik
    profileStats.innerHTML = `
        <div class="stat-card"><span class="stat-value">${currentUser.streak}</span><span class="stat-label">🔥 Hari Beruntun</span></div>
        <div class="stat-card"><span class="stat-value">${currentUser.totalXp}</span><span class="stat-label">⚡ Total XP</span></div>
        <div class="stat-card"><span class="stat-value">${currentUser.gems}</span><span class="stat-label">💎 Permata</span></div>
        <div class="stat-card"><span class="stat-value">${currentUser.level}</span><span class="stat-label">⭐ Level</span></div>`;

    // 3. Progres per dunia (klik = lompat ke dunia)
    worldProgressList.innerHTML = CONCENTRATIONS.map(c => {
        const flat = getFlatQuests(c);
        const done = flat.filter(q => completedQuests.has(q)).length;
        const pct = flat.length ? Math.round((done / flat.length) * 100) : 0;
        const complete = done === flat.length;
        return `
            <button type="button" data-goto-world="${c.id}" class="world-progress-row">
                <span class="text-2xl shrink-0">${c.flag}</span>
                <span class="flex-1 min-w-0">
                    <span class="flex justify-between items-baseline mb-1">
                        <span class="font-bold truncate">${c.name}</span>
                        <span class="text-xs text-gray-400 whitespace-nowrap ml-2">${done}/${flat.length} node ${complete ? '🏆' : ''}</span>
                    </span>
                    <span class="block w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <span class="block h-2.5 rounded-full world-progress-bar" style="width:${pct}%"></span>
                    </span>
                </span>
                <span class="text-gray-500 text-sm shrink-0">➜</span>
            </button>`;
    }).join('');

    // 4. Pencapaian
    const unlockedCount = ACHIEVEMENTS.filter(a => a.check()).length;
    achCountText.textContent = `${unlockedCount} / ${ACHIEVEMENTS.length} terbuka`;
    achievementList.innerHTML = ACHIEVEMENTS.map(a => {
        const ok = a.check();
        return `
            <div class="achievement-card ${ok ? 'unlocked' : ''}">
                <span class="text-2xl shrink-0">${a.icon}</span>
                <span class="min-w-0">
                    <span class="block font-bold text-sm">${a.title}</span>
                    <span class="block text-xs text-gray-400">${a.desc}</span>
                </span>
                <span class="ml-auto text-lg shrink-0">${ok ? '✅' : '🔒'}</span>
            </div>`;
    }).join('');
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
    currentUser.totalXp += amount; // [BARU] XP kumulatif untuk profil
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
 * Urutan 3 fase (fix lama, dipertahankan):
 * state dulu -> addXP (picu level up) -> save + renderPath
 * agar node berikutnya terbuka TANPA refresh.
 */
function completeQuest() {
    const { questId, xpToAdd } = activeQuestData;

    // FASE 1: state
    completedQuests.add(questId);
    currentUser.gems += GEMS_PER_QUEST;
    touchStreak();

    // FASE 2: update UI / level up
    addXP(xpToAdd);

    // FASE 3: simpan + refresh path
    saveGame();
    renderPath();
}

// ============================================================
// SLIDE ENGINE (fix isAnswered per-slide tetap ada!)
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
    // [FIX] Slide baru SELALU "belum dijawab" — tanpa ini tombol slide
    // berikutnya mati (bug isAnswered basi yang sudah pernah kita obati).
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

// Klik node path
pathContainer.addEventListener('click', function (e) {
    const btn = e.target.closest('.path-node');
    if (!btn || btn.disabled) return;

    const qid = btn.dataset.questId;
    if (completedQuests.has(qid)) return; // anti-farming XP

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
    worldDropdown.classList.add('hidden');
});

// [BARU] Navigasi halaman (sidebar + bottom nav sekaligus)
navButtons.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));

// [BARU] Klik baris progres dunia di Profil -> lompat ke dunianya
worldProgressList.addEventListener('click', function (e) {
    const row = e.target.closest('[data-goto-world]');
    if (!row) return;
    switchWorld(row.dataset.gotoWorld);
    showPage('learn');
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
        console.log('💾 Progres dimuat: Lv', currentUser.level, '| Dunia:', currentUser.activeWorld);
    } else {
        currentUser.joinedDate = new Date().toISOString();
        currentUser.totalXp = 0;
        visitedWorlds.add(currentUser.activeWorld);
        addXP(INITIAL_XP);
        saveGame();
        renderPath();
        updateUI();
        console.log('🆕 Game baru dimulai.');
    }

    showPage('learn'); // pastikan halaman awal konsisten
});
