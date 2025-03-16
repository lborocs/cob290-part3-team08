from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_db():
    db = sqlite3.connect('database.db')
    db.row_factory = sqlite3.Row
    return db

@app.route('/')
def home():
    return "Welcome to the Chat API!"

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return an empty response with a 204 No Content status

@app.route('/chats', methods=['GET'])
def get_chats():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Chats")
    chats = cursor.fetchall()
    db.close()
    return jsonify([dict(chat) for chat in chats])

@app.route('/chats/<int:chat_id>/messages', methods=['GET'])
def get_messages(chat_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Messages WHERE chat_id = ?", (chat_id,))
    messages = cursor.fetchall()
    db.close()
    return jsonify([dict(msg) for msg in messages])

@app.route('/chats/<int:chat_id>/messages', methods=['POST'])
def send_message(chat_id):
    data = request.json
    sender_id = data.get('sender_id')
    message_text = data.get('message_text')

    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO Messages (chat_id, sender_id, message_text) VALUES (?, ?, ?)",
                   (chat_id, sender_id, message_text))
    db.commit()
    db.close()
    return jsonify({'status': 'Message sent'}), 201

if __name__ == '__main__':
    app.run(debug=True) 