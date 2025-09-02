# Readers Companion AI

A intelligent web application that helps students study more efficiently by automatically generating flashcards from text, tracking study progress, and organizing materials by topic.

## ✨ Features

*   **AI-Powered Flashcard Generation:** Automatically creates question-and-answer flashcards from any submitted text.
*   **Topic-Based Organization:** Easily sort and retrieve your flashcards by subject or topic.
*   **Study Session Tracking:** Monitor your study habits with timestamps and session history.
*   **Simple & Intuitive Interface:** A clean, user-friendly web interface built for focus and efficiency.
*   **RESTful API:** A well-documented API for core functionality, enabling future integrations.

## 🛠️ Tech Stack

*   **Backend:** Python, Flask, SQLite
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Deployment:** PythonAnywhere
*   **Version Control:** Git & GitHub
*   **API:** RESTful design

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
*   Python 3.8 or higher
*   `pip` (Python package manager)

### Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[your-username]/readers-companion-ai.git
    cd readers-companion-ai
    ```

2.  **(Optional) Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application:**
    ```bash
    python app.py
    ```

5.  **Open your browser and navigate to:**
    `http://localhost:5000`

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check endpoint for API status. |
| `/api/generate-flashcards` | `POST` | Submit text to generate new flashcards. |
| `/api/flashcards` | `GET` | Retrieve a list of all flashcards. |
| `/api/study-sessions` | `GET` | Retrieve a history of study sessions. |
| `/api/flashcards/<id>` | `DELETE` | Delete a specific flashcard by its ID. |

## 👥 Team

*   **Obinwa Ogechi Perpetual** (Ogechiobinwa@gmail.com) – Backend & Database Architecture
*   **Anthonia Othetheaso** (t27613850@gmail.com) – Frontend Development & UI/UX Design
*   **Godsfavour Abrahams Roe** (roetechhub@gmail.com) – Testing, Documentation & Deployment

## 🔮 Future Roadmap

*   Integration of more advanced AI models for higher-quality question generation.
*   User authentication and personalized flashcard sets.
*   Detailed analytics and visualizations on study performance.
*   Spaced repetition algorithm to optimize study schedules.
*   Mobile application for studying on the go.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
