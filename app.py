from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# SQLite database configuration
DB_PATH = 'study_buddy.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This enables name-based access to columns
    return conn

# Initialize database
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create flashcards table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            topic TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create study_sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            flashcards_count INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("SQLite database initialized successfully")

# Initialize the database when the app starts
init_db()

# Simple question generation for demo
def generate_questions_fallback(text, num_questions=5):
    # Simple implementation that creates questions from sentences
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    flashcards = []
    
    for i, sentence in enumerate(sentences[:num_questions]):
        if sentence and len(sentence) > 10:  # Ensure the sentence is not too short
            # Create a simple question by replacing key terms
            question = sentence
            if ' is ' in sentence:
                question = sentence.replace(' is ', ' is what? ')
            elif ' are ' in sentence:
                question = sentence.replace(' are ', ' are what? ')
            else:
                question = f"What is {sentence.split(' ')[0]}?"
            
            flashcards.append({
                "question": question,
                "answer": sentence
            })
    
    return flashcards

# Root endpoint
@app.route('/')
def index():
    return jsonify({"message": "Study Buddy API is running", "endpoints": {
        "health": "/api/health",
        "generate_flashcards": "/api/generate-flashcards",
        "get_flashcards": "/api/flashcards",
        "get_study_sessions": "/api/study-sessions"
    }})

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK", "message": "Study Buddy API is running"})

# Generate flashcards endpoint
@app.route('/api/generate-flashcards', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    text = data.get('text', '')
    topic = data.get('topic', 'general')
    num_questions = data.get('num_questions', 5)
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Use our fallback method for question generation
    flashcards = generate_questions_fallback(text, num_questions)
    
    # Save flashcards to database
    conn = get_db_connection()
    cursor = conn.cursor()
    saved_ids = []
    
    for card in flashcards:
        cursor.execute(
            "INSERT INTO flashcards (question, answer, topic) VALUES (?, ?, ?)",
            (card['question'], card['answer'], topic)
        )
        saved_ids.append(cursor.lastrowid)
    
    # Record study session
    cursor.execute(
        "INSERT INTO study_sessions (topic, flashcards_count) VALUES (?, ?)",
        (topic, len(saved_ids))
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "message": f"Generated {len(saved_ids)} flashcards",
        "flashcards": flashcards,
        "saved_ids": saved_ids
    })

# Get flashcards endpoint
@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    topic = request.args.get('topic')
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if topic:
        cursor.execute("SELECT * FROM flashcards WHERE topic = ? ORDER BY created_at DESC", (topic,))
    else:
        cursor.execute("SELECT * FROM flashcards ORDER BY created_at DESC")
    
    flashcards = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({"flashcards": flashcards})

# Delete flashcard endpoint
@app.route('/api/flashcards/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM flashcards WHERE id = ?", (flashcard_id,))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Flashcard deleted successfully"})

# Get study sessions endpoint
@app.route('/api/study-sessions', methods=['GET'])
def get_study_sessions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM study_sessions ORDER BY created_at DESC")
    sessions = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({"sessions": sessions})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
