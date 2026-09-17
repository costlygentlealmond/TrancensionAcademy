// ============================================================
// TRANCENSION ACADEMY — Logika Game (app.js)
// [v4] Kuis slide-by-slide interaktif:
//      salah -> clue scaffolding (jawaban tidak dibocorkan)
//      benar -> explanation debrief -> slide berikutnya
//      slide terakhir -> Fun Fact popup -> completeQuest()
// ============================================================

// --- KONFIGURASI ---
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

// [BARU] State untuk mesin slide
let slideState = {
    slides: [],       // array pertanyaan dari quizData
    currentSlide: 0,  // indeks slide aktif
    isAnswered: false // apakah slide aktif sudah dijawab benar
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
const closeQuizBtn = document.getElementById('closeQuizBtn');

// [BARU] DOM Elements Slide Engine
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

const resetProgressBtn = document.getElementById('resetProgressBtn');

// ============================================================
// SAVE SYSTEM (tidak berubah)
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
// FUNGSI INTI GAME (tidak berubah — termasuk fix urutan Boss)
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

function completeQuest() {
    const { questCard, xpToAdd, skillToUnlock, questId } = activeQuestData;

    // FASE 1: state dulu
    if (skillToUnlock) unlockSkill(skillToUnlock);
    completedQuests.add(questId);

    questCard.classList.add('opacity-30');
    const button = questCard.querySelector('.complete-btn');
    if (button) {
        button.disabled = true;
        button.textContent = 'Selesai';
        button.classList.remove('bg-cyan-500', 'hover:bg-cyan-600');
        button.classList.add('bg-gray-500');
    }

    // FASE 2: baru picu pengecekan quest (Boss terbuka tanpa refresh)
    addXP(xpToAdd);

    // FASE 3: simpan
    saveGame();
}

// ============================================================
// [BARU] SLIDE ENGINE
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
    const slide = slideState.slides[slideState.currentSlide];
    const total = slideState.slides.length;

    // [FIX] Setiap slide yang baru dirender SELALU dimulai dalam kondisi
    // "belum dijawab". Tanpa reset ini, isAnswered masih true dari
    // slide sebelumnya -> semua tombol opsi di slide berikutnya mati.
    slideState.isAnswered = false;

    // Header: counter & progress
    slideCounter.textContent = `Slide ${slideState.currentSlide + 1} / ${total}`;
    slideProgressBar.style.width = `${(slideState.currentSlide / total) * 100}%`;

    slideQuestion.textContent = `${slideState.currentSlide + 1}. ${slide.question}`;

    // Reset kotak feedback
    clueBox.classList.add('hidden');
    explanationBox.classList.add('hidden');
    nextSlideBtn.classList.add('hidden');

    // Bangun tombol opsi A-D
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
    // Slide terkunci setelah dijawab benar
    if (slideState.isAnswered || button.disabled) return;

    const slide = slideState.slides[slideState.currentSlide];
    const letter = button.dataset.letter;

    if (letter === slide.correct_answer) {
        // --- BENAR: debrief explanation ---
        slideState.isAnswered = true;
        button.classList.add('option-correct');

        // Kunci semua opsi
        slideOptions.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

        explanationText.textContent = slide.explanation;
        explanationBox.classList.remove('hidden');

        // Progress naik ke posisi slide berikutnya (terasa "melangkah")
        const total = slideState.slides.length;
        slideProgressBar.style.width = `${((slideState.currentSlide + 1) / total) * 100}%`;

        const isLastSlide = slideState.currentSlide === total - 1;
        nextSlideBtn.textContent = isLastSlide ? '🎉 Selesai & Lihat Hasil' : 'Slide Berikutnya ➜';
        nextSlideBtn.classList.remove('hidden');

    } else {
        // --- SALAH: clue scaffolding, jawaban TIDAK dibocorkan ---
        button.classList.add('option-wrong', 'shake');
        button.disabled = true; // opsi salah dieliminasi, sisanya masih bisa diklik

        clueText.textContent = slide.clue;
        clueBox.classList.remove('hidden');
    }
}

// ============================================================
// FUN FACT POPUP (tidak berubah)
// ============================================================

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

// [BARU] Klik opsi jawaban (event delegation)
slideOptions.addEventListener('click', function (e) {
    const button = e.target.closest('.option-btn');
    if (!button) return;
    handleOptionClick(button);
});

// [BARU] Tombol slide berikutnya / selesai
nextSlideBtn.addEventListener('click', function () {
    if (!slideState.isAnswered) return; // pengaman

    if (slideState.currentSlide < slideState.slides.length - 1) {
        slideState.currentSlide++;
        renderSlide();
    } else {
        // Slide terakhir selesai -> tutup kuis, tampilkan Fun Fact
        quizModal.classList.add('hidden');
        showFunFact();
    }
});

closeModalBtn.addEventListener('click', function () {
    levelUpModal.classList.add('hidden');
});

closeQuizBtn.addEventListener('click', function () {
    quizModal.classList.add('hidden');
});

funFactContinueBtn.addEventListener('click', function () {
    funFactModal.classList.add('hidden');
    completeQuest(); // XP, skill, pengecekan Boss
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
