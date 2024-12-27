from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import pg8000

app = Flask(__name__)
CORS(app)

# PostgreSQL connection using pg8000
conn = pg8000.connect(
    database="todo_db",  
    user="postgres",    
    password="48207",  
    host="localhost",    
    port=5432           
)
cursor = conn.cursor()

# Route to serve the frontend
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

# Serve other static files like CSS and JS
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)

# API route to get all todos
@app.route('/api/todos', methods=['GET'])
def get_todos():
    cursor.execute("SELECT * FROM todos;")
    todos = cursor.fetchall()
    return jsonify([{
        "id": row[0],
        "content": row[1],
        "category": row[2],
        "done": row[3],
        "created_at": row[4]
    } for row in todos])

# API route to create a new todo
@app.route('/api/todos', methods=['POST'])
def create_todo():
    data = request.json
    cursor.execute(
        "INSERT INTO todos (content, category, done, created_at) VALUES (%s, %s, %s, NOW()) RETURNING id;",
        (data['content'], data.get('category', 'General'), False)
    )
    conn.commit()
    return jsonify({"message": "Task added successfully"}), 201

# API route to update a todo
@app.route('/api/todos/<int:todo_id>', methods=['PATCH'])
def update_todo(todo_id):
    data = request.json
    cursor.execute(
        "UPDATE todos SET done = %s WHERE id = %s RETURNING id;",
        (data['done'], todo_id)
    )
    conn.commit()
    return jsonify({"message": "Task updated successfully"}), 200

# API route to delete a todo
@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    cursor.execute("DELETE FROM todos WHERE id = %s;", (todo_id,))
    conn.commit()
    return jsonify({"message": "Task deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
