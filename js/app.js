// ============================================================
// TRANCENSION ACADEMY — Logika Game (app.js)
// [v3] FIX: Boss Quest terbuka langsung tanpa refresh
// [v3] BARU: Popup Fun Fact setelah kuis dijawab benar
// ============================================================

// --- KONFIGURASI BALANCING ---
const XP_GROWTH = 1.2;
const INITIAL_XP = 30;
const SAVE_KEY = 'trancension_save_v1';

// --- GAME STATE ---
let currentUser = {
    level: 1,
    xp: 0,
    xpToNextLevel: 100
};

const unlockedSkills = new Set();
const completedQuests = new Set();

let activeQuestData = {
    questCard: null,
    xpToAdd: 0,
    skillToUnlock: null,
    questId: null
};

// --- DOM ELEMENTS ---
const xpBar = document.getElementById('xpBar');
const xpText = document.getElementById('xpText');
const levelText = document.getElementById('levelText');
const questList = document.getElementById('questList');
const levelUpModal = document.getElementById('levelUpModal');
const newLevelText = document.getElementById('newLevelText');
const closeModalBtn = document.getElementById('closeModalBtn');

const quizModal = document.getElementById('quizModal');
const quizTitle = document.getElementById('quizTitle');
const quizContent = document.getElementById('quizContent');
const quizForm = document.getElementById('quizForm');
const submitQuizBtn = document.getElementById('submitQuizBtn');
const closeQuizBtn = document.getElementById('closeQuizBtn');
const quizError = document.getElementById('quizError');

const resetProgressBtn = document.getElementById('resetProgressBtn');

// [BARU] DOM Elements untuk Fun Fact
const funFactModal = document.getElementById('funFactModal');
const funFactText = document.getElementById('funFactText');
const funFactContinueBtn = document.getElementById('funFactContinueBtn');

// ============================================================
// SAVE SYSTEM
// ============================================================

function saveGame() {
    const saveData = {
        level: currentUser.level,
        xp: currentUser.xp,
        xpToNextLevel: currentUser.xpToNextLevel,
        skills: Array.from(unlockedSkills),
        quests: Array.from(completedQuests)
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    try {
        const saveData = JSON.parse(raw);
        currentUser.level = saveData.level || 1;
        currentUser.xp = saveData.xp || 0;
        currentUser.xpToNextLevel = saveData.xpToNextLevel || 100;
        (saveData.skills || []).forEach(id => unlockedSkills.add(id));
        (saveData.quests || []).forEach(id => completedQuests.add(id));
        return true;
    } catch (e) {
        console.error('Save data rusak, dihapus:', e);
        localStorage.removeItem(SAVE_KEY);
        return false;
    }
}

function applySavedState() {
    completedQuests.forEach(questId => {
        const questCard = questList.querySelector(`[data-quest-id="${questId}"]`);
        if (questCard) {
            questCard.classList.add('opacity-30');
            const button = questCard.querySelector('.complete-btn');
            if (button) {
                button.disabled = true;
                button.textContent = 'Selesai';
                button.classList.remove('bg-cyan-500', 'hover:bg-cyan-600');
                button.classList.add('bg-gray-500', 'cursor-not-allowed');
            }
        }
    });
    unlockedSkills.forEach(id => unlockSkill(id));
}

function resetGame() {
    const konfirmasi = confirm(
        'Yakin ingin menghapus SEMUA progres?\n' +
        'Level, XP, skill, dan quest selesai akan hilang permanen.'
    );
    if (konfirmasi) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// ============================================================
// FUNGSI UTAMA
// ============================================================

function updateUI() {
    const xpPercentage = (currentUser.xp / currentUser.xpToNextLevel) * 100;
    xpBar.style.width = `${xpPercentage}%`;
    xpText.textContent = `${currentUser.xp} / ${currentUser.xpToNextLevel} XP`;
    levelText.textContent = `Level ${currentUser.level}`;
    checkQuestsAvailability();
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

function unlockSkill(skillId) {
    if (!skillId) return;
    unlockedSkills.add(skillId);

    const skillNode = document.getElementById(skillId);
    if (skillNode && skillNode.classList.contains('locked')) {
        const isBoss = skillNode.dataset.boss === 'true';

        skillNode.classList.remove('locked', 'bg-gray-600', 'opacity-50', 'boss-glow');
        skillNode.classList.add('unlocked', 'bg-gradient-to-br');

        if (isBoss) {
            skillNode.classList.remove('border-purple-500');
            skillNode.classList.add('from-purple-500', 'to-fuchsia-600', 'border-purple-300');
        } else {
            skillNode.classList.add('from-cyan-500', 'to-blue-600');
        }

        skillNode.querySelector('p').textContent = 'Telah Dipelajari';
    }
}

function checkQuestsAvailability() {
    const allQuests = questList.querySelectorAll('.quest-card');
    allQuests.forEach(quest => {
        const levelReq = parseInt(quest.dataset.levelReq || '1');
        const isCompleted = quest.classList.contains('opacity-30');

        const skillReq = quest.dataset.skillReq;
        const skillOk = !skillReq || skillReq.split(',').every(id => unlockedSkills.has(id.trim()));

        if (currentUser.level >= levelReq && skillOk && !isCompleted) {
            quest.classList.remove('opacity-50', 'cursor-not-allowed');
            const button = quest.querySelector('.complete-btn');
            if (!button) return;

            button.disabled = false;
            button.classList.remove('bg-gray-500', 'cursor-not-allowed');
            button.classList.add('bg-cyan-500', 'hover:bg-cyan-600');

            if (button.textContent.includes('Terkunci')) {
                button.textContent = 'Mulai Kuis';
            }
        }
    });
}

// ============================================================
// [FIX BUG] completeQuest — URUTAN DIPERBAIKI!
// Urutan lama: addXP() -> unlockSkill()
//   => checkQuestsAvailability() jalan SEBELUM skill terdaftar,
//      jadi Boss Quest tidak kunjung terbuka sampai refresh.
// Urutan baru: state dulu (skill + kartu selesai), BARU addXP()
//   (yang memicu pengecekan quest), terakhir simpan.
// ============================================================
function completeQuest() {
    const { questCard, xpToAdd, skillToUnlock, questId } = activeQuestData;

    // --- FASE 1: Perbarui semua STATE terlebih dahulu ---
    if (skillToUnlock) unlockSkill(skillToUnlock);
    completedQuests.add(questId);

    // Tandai kartu quest sebagai selesai (sebelum pengecekan berjalan)
    questCard.classList.add('opacity-30');
    const button = questCard.querySelector('.complete-btn');
    if (button) {
        button.disabled = true;
        button.textContent = 'Selesai';
        button.classList.remove('bg-cyan-500', 'hover:bg-cyan-600');
        button.classList.add('bg-gray-500');
    }

    // --- FASE 2: Baru picu updateUI -> checkQuestsAvailability ---
    // Sekarang skill-nya SUDAH terdaftar, jadi Boss langsung terbuka!
    addXP(xpToAdd);

    // --- FASE 3: Simpan progres ---
    saveGame();
}

// ============================================================
// [BARU] FUN FACT POPUP (ala Duolingo)
// ============================================================

function showFunFact() {
    const quiz = quizData[activeQuestData.questId];

    // Kumpulkan semua funFact dari pertanyaan kuis ini, pilih acak
    const facts = (quiz.questions || []).map(q => q.funFact).filter(Boolean);

    if (facts.length > 0) {
        funFactText.textContent = facts[Math.floor(Math.random() * facts.length)];
    } else {
        // Fallback jika suatu saat ada kuis tanpa funFact
        funFactText.textContent = 'Kerja bagus! Kamu menyelesaikan quest ini dengan sempurna.';
    }

    // Tutup kuis, mainkan popup fun fact
    quizModal.classList.add('hidden');
    funFactModal.classList.remove('hidden');
}

function loadQuiz(questId) {
    const quiz = quizData[questId];
    if (!quiz) {
        console.error('Data kuis tidak ditemukan untuk quest:', questId);
        return;
    }

    quizTitle.textContent = quiz.title;

    let quizHTML = '';
    quiz.questions.forEach((q, index) => {
        quizHTML += `<fieldset class="space-y-2">`;
        quizHTML += `<legend class="font-semibold text-lg">${index + 1}. ${q.q}</legend>`;
        for (const [key, value] of Object.entries(q.options)) {
            quizHTML += `
                <div class="flex items-center">
                    <input id="q${index}_${key}" name="q${index}_answer" type="radio" value="${key}" class="h-4 w-4 text-cyan-600 border-gray-300 focus:ring-cyan-500">
                    <label for="q${index}_${key}" class="ml-3 block text-sm font-medium text-gray-300">${value}</label>
                </div>
            `;
        }
        quizHTML += `</fieldset>`;
    });

    quizContent.innerHTML = quizHTML;
    quizError.classList.add('hidden');
    quizModal.classList.remove('hidden');
}

// --- EVENT LISTENERS ---

questList.addEventListener('click', function (e) {
    const button = e.target.closest('.complete-btn');
    if (!button || button.disabled) return;

    const questCard = button.closest('.quest-card');
    const questId = questCard.dataset.questId;
    const xpToAdd = parseInt(questCard.dataset.xp);
    const skillToUnlock = questCard.dataset.skillId;

    if (quizData[questId]) {
        activeQuestData = { questCard, xpToAdd, skillToUnlock, questId };
        loadQuiz(questId);
    } else {
        console.warn('Tidak ada kuis untuk quest ini, langsung selesaikan.');
        activeQuestData = { questCard, xpToAdd, skillToUnlock, questId };
        completeQuest();
    }
});

closeModalBtn.addEventListener('click', function () {
    levelUpModal.classList.add('hidden');
});

quizForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const quiz = quizData[activeQuestData.questId];
    let allCorrect = true;

    quiz.questions.forEach((q, index) => {
        const selectedAnswer = quizForm.querySelector(`input[name="q${index}_answer"]:checked`);
        if (!selectedAnswer || selectedAnswer.value !== q.answer) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        // [DIUBAH] Jangan langsung selesaikan — tampilkan Fun Fact dulu!
        // completeQuest() baru dipanggil saat user klik "Lanjutkan".
        showFunFact();
    } else {
        quizError.classList.remove('hidden');
    }
});

closeQuizBtn.addEventListener('click', function () {
    quizModal.classList.add('hidden');
});

// [BARU] Tombol "Lanjutkan" di Fun Fact -> baru quest benar-benar selesai
funFactContinueBtn.addEventListener('click', function () {
    funFactModal.classList.add('hidden');
    completeQuest(); // XP masuk, skill terbuka, Boss dicek di sini
});

if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', resetGame);
}

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', function () {
    if (typeof quizData === 'undefined') {
        alert('ERROR: js/quiz-data.js gagal dimuat — kuis tidak bisa jalan.');
        return;
    }

    const hasSave = loadGame();

    if (hasSave) {
        applySavedState();
        updateUI();
        console.log('💾 Progres dimuat: Level', currentUser.level, '| Quest selesai:', completedQuests.size);
    } else {
        addXP(INITIAL_XP);
        saveGame();
        console.log('🆕 Game baru dimulai, progres tersimpan otomatis.');
    }
});