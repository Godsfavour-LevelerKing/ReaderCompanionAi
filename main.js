// ----------------------------
// CONFIG
// ----------------------------
const API_BASE_URL = "https://roetechhub.pythonanywhere.com/api"; 
// Make sure your Flask routes are under /api (adjust if needed)

// Sample content for different topics
const topicContents = {
    biology: `Photosynthesis is the process used by plants, algae, and certain bacteria to harness energy from sunlight into chemical energy.
Oxygen is released as a byproduct of photosynthesis. The mitochondria are known as the powerhouses of the cell...`,
    history: `The American Revolution was a colonial revolt that occurred between 1765 and 1783...
The French Revolution was a period of radical political and societal change...`,
    programming: `JavaScript is a programming language that conforms to the ECMAScript specification...
HTML (HyperText Markup Language) is the standard markup language for documents...`,
    physics: `Newton's laws of motion describe the relationship between the motion of an object and the forces acting on it...`,
    math: `Algebra is a branch of mathematics dealing with symbols and the rules for manipulating them...
Calculus is the study of continuous change...`
};

// ----------------------------
// INITIALIZATION
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    setupTopicSelector();
    setupButtons();
    setupModals();
    checkBackendConnection();
});

// ----------------------------
// NAVIGATION
// ----------------------------
function setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentSections = document.querySelectorAll(".content-section");

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSection = this.dataset.section;

            navLinks.forEach(navLink => navLink.classList.remove("active"));
            this.classList.add("active");

            contentSections.forEach(section => section.classList.remove("active"));
            document.getElementById(targetSection).classList.add("active");
        });
    });
}

// ----------------------------
// TOPIC SELECTOR
// ----------------------------
function setupTopicSelector() {
    const topicSelect = document.getElementById("topic-select");
    const customTopicInput = document.getElementById("custom-topic-input");

    topicSelect.addEventListener("change", function () {
        if (this.value === "custom") {
            customTopicInput.classList.remove("hidden");
        } else {
            customTopicInput.classList.add("hidden");
            document.getElementById("study-notes").value = topicContents[this.value] || "";
        }
    });
}

// ----------------------------
// BUTTONS
// ----------------------------
function setupButtons() {
    document.getElementById("sample-btn").addEventListener("click", () => {
        const topic = document.getElementById("topic-select").value;
        if (topic !== "custom") {
            document.getElementById("study-notes").value = topicContents[topic] || "";
            showNotification("Sample notes loaded!");
        }
    });

    document.getElementById("clear-btn").addEventListener("click", () => {
        document.getElementById("study-notes").value = "";
        showNotification("Notes cleared!");
    });

    document.getElementById("generate-btn").addEventListener("click", () => {
        const notes = document.getElementById("study-notes").value.trim();
        let topic = document.getElementById("topic-select").value;

        if (topic === "custom") {
            topic = document.getElementById("custom-topic").value.trim() || "general";
        }

        if (!notes) {
            showNotification("Please enter some study notes first!", "error");
            return;
        }

        generateFlashcards(notes, topic);
    });

    document.getElementById("load-saved-btn").addEventListener("click", () => {
        loadSavedFlashcards();
    });
}

// ----------------------------
// API FUNCTIONS
// ----------------------------
async function checkBackendConnection() {
    const indicator = document.getElementById("api-status-indicator");
    const text = document.getElementById("api-status-text");

    try {
        const res = await fetch(`${API_BASE_URL}/status`);
        if (res.ok) {
            indicator.style.backgroundColor = "green";
            text.textContent = "Backend connected!";
        } else {
            throw new Error("Failed to connect");
        }
    } catch (err) {
        indicator.style.backgroundColor = "red";
        text.textContent = "Backend unreachable!";
    }
}

async function generateFlashcards(notes, topic) {
    try {
        const res = await fetch(`${API_BASE_URL}/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes, topic })
        });

        if (!res.ok) throw new Error("Failed to generate flashcards");

        const data = await res.json();
        displayFlashcards(data.flashcards);
        showNotification("Flashcards generated successfully!");
    } catch (err) {
        console.error(err);
        showNotification("Error generating flashcards!", "error");
    }
}

async function loadSavedFlashcards() {
    try {
        const res = await fetch(`${API_BASE_URL}/saved`);
        if (!res.ok) throw new Error("Failed to load saved flashcards");

        const data = await res.json();
        displaySavedFlashcards(data.flashcards);
    } catch (err) {
        console.error(err);
        showNotification("Error loading saved flashcards!", "error");
    }
}

// ----------------------------
// UI FUNCTIONS
// ----------------------------
function displayFlashcards(flashcards) {
    const container = document.getElementById("flashcards-container");
    container.innerHTML = "";

    if (!flashcards || flashcards.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-book-open"></i><p>No flashcards generated.</p></div>`;
        return;
    }

    flashcards.forEach(card => {
        const div = document.createElement("div");
        div.className = "flashcard";
        div.innerHTML = `
            <div class="flashcard-front">${card.question}</div>
            <div class="flashcard-back">${card.answer}</div>
        `;
        container.appendChild(div);
    });

    document.getElementById("flashcard-count").textContent = flashcards.length;
}

function displaySavedFlashcards(flashcards) {
    const container = document.getElementById("saved-flashcards-container");
    container.innerHTML = "";

    if (!flashcards || flashcards.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-database"></i><p>No saved flashcards found.</p></div>`;
        return;
    }

    flashcards.forEach(card => {
        const div = document.createElement("div");
        div.className = "flashcard";
        div.innerHTML = `
            <div class="flashcard-front">${card.question}</div>
            <div class="flashcard-back">${card.answer}</div>
        `;
        container.appendChild(div);
    });
}

// ----------------------------
// MODALS
// ----------------------------
function setupModals() {
    const modals = document.querySelectorAll(".modal");
    const closeBtns = document.querySelectorAll(".close-modal");

    document.getElementById("about-link").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("about-modal").style.display = "block";
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".modal").style.display = "none";
        });
    });

    window.addEventListener("click", e => {
        modals.forEach(modal => {
            if (e.target === modal) modal.style.display = "none";
        });
    });
}

// ----------------------------
// NOTIFICATIONS
// ----------------------------
function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const text = document.getElementById("notification-text");

    text.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}
