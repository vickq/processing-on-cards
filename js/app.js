// ELEMENTS
const calendarGrid = document.getElementById("calendarGrid");
const modal = document.getElementById("modal");
const modalDayNumber = document.getElementById("modalDayNumber");
const modalTitle = document.getElementById("modalTitle");
const modalDifficulty = document.getElementById("modalDifficulty");
const modalBody = document.getElementById("modalBody");
const completeBtn = document.getElementById("completeBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let currentDay = null;

// ==============================
// LOCAL STORAGE
// ==============================
function getCompletedDays() {
    return JSON.parse(localStorage.getItem("completedDays")) || [];
}

function saveCompletedDays(days) {
    localStorage.setItem("completedDays", JSON.stringify(days));
}

// ==============================
// CALENDAR
// ==============================
const cardColors = [
    "#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da",
    "#00bcd4", "#00acc1", "#0097a7", "#00838f", "#006064",
    "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#0288d1"
];

function createCalendar() {
    calendarGrid.innerHTML = "";
    calendarGrid.style.background = "#fdf6f6"; // fondo del grid
    calendarGrid.style.padding = "20px";
    calendarGrid.style.borderRadius = "16px";

    const completedDays = getCompletedDays();
    const unlockedDay = completedDays.length + 1;

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "day-card";
        card.textContent = task.day;

        // 🔹 Color de cada card
        card.style.backgroundColor = cardColors[task.day - 1];

        // ✅ Completado
        if (completedDays.includes(task.day)) {
            card.classList.add("completed");
            card.style.backgroundColor = "#086522"; // verde completado
            card.style.color = "white";
        }

        // 🔒 Bloqueo de días futuros
        if (task.day > unlockedDay) {
            card.classList.add("locked");
        }

        card.addEventListener("click", () => {
            if (task.day > unlockedDay) return;
            openModal(task);
        });

        // Hover
        card.addEventListener("mouseenter", () => {
            if (!card.classList.contains("completed")) {
                card.style.opacity = "0.8";
            }
        });
        card.addEventListener("mouseleave", () => {
            if (!card.classList.contains("completed")) {
                card.style.opacity = "1";
            }
        });

        calendarGrid.appendChild(card);
    });

    updateProgress();
}

// ==============================
// MODAL
// ==============================
function openModal(task) {
    currentDay = task.day;

    modalDayNumber.textContent = `Day ${task.day}`;
    modalTitle.textContent = task.title;
    modalDifficulty.textContent = task.difficulty;
    modalDifficulty.className = `difficulty ${task.difficulty}`;

    modalBody.innerHTML = "";

    if (task.task) {
        const p = document.createElement("p");
        p.textContent = task.task;
        modalBody.appendChild(p);
    }

    if (task.tips.length > 0) {
        const ul = document.createElement("ul");
        task.tips.forEach(tip => {
            const li = document.createElement("li");
            li.textContent = tip;
            ul.appendChild(li);
        });
        modalBody.appendChild(ul);
    }

    if (task.bonus) {
        const bonus = document.createElement("p");
        bonus.textContent = task.bonus;
        modalBody.appendChild(bonus);
    }

    updateCompleteButton();
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

// ==============================
// COMPLETE / SKIP
// ==============================
function toggleComplete() {
    let completedDays = getCompletedDays();

    if (completedDays.includes(currentDay)) {
        // Si ya estaba completado, lo desmarcamos
        completedDays = completedDays.filter(day => day !== currentDay);
    } else {
        // Marcamos como completo
        completedDays.push(currentDay);

        // Actualizamos unlockedDay si corresponde
        let unlockedDay = parseInt(localStorage.getItem("unlockedDay")) || 1;
        if (currentDay >= unlockedDay) {
            unlockedDay = currentDay + 1;
            localStorage.setItem("unlockedDay", unlockedDay);
        }
    }

    saveCompletedDays(completedDays);
    updateCompleteButton();

    // Refresca la vista completa para recalcular cards bloqueadas
    location.reload();
}

function skipDay() {
    closeModal();
}

// ==============================
// UI UPDATES
// ==============================
function updateCompleteButton() {
    const completedDays = getCompletedDays();

    if (completedDays.includes(currentDay)) {
        completeBtn.textContent = "Completed ✓";
        completeBtn.classList.add("completed");
    } else {
        completeBtn.textContent = "Mark as Complete";
        completeBtn.classList.remove("completed");
    }
}

function updateProgress() {
    const completedDays = getCompletedDays();
    const completed = getCompletedDays().length;
    const unlockedDay = completedDays + 1;
    const total = tasks.length;
    const percent = Math.round((completed / total) * 100);

    progressFill.style.width = `${percent}%`;
    progressFill.textContent = `${percent}%`;
    progressText.textContent = `Completed ${completed} of ${total}`;
}

// ==============================
// RESET
// ==============================
function resetProgress() {
    localStorage.removeItem("completedDays");
    createCalendar();
}

// ==============================
// INIT
// ==============================
createCalendar();

// CLOSE MODAL ON OUTSIDE CLICK
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

