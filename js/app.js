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
    "#f0f9f0", "#e0f3e0", "#d1edcf", "#c1e7bf", "#b2e1af",  // fila 1 (verde más claro)
    "#a3db9f", "#94d38f", "#85cd7f", "#76c76f", "#67c05f",  // fila 2 (verde medio a oscuro)
    "#c7a885", "#b68f6c", "#a57653", "#955d3a", "#844422"   // fila 3 (marrón claro a oscuro)
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

