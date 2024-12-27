const API_URL = "http://127.0.0.1:5000/api/todos";

const form = document.getElementById('new-todo-form'); // Updated to match your form ID
const todoList = document.getElementById('todo-list'); // Updated to match your task container ID

// Load tasks on page load
async function loadTasks() {
    const response = await fetch(API_URL);
    const todos = await response.json();
    todoList.innerHTML = todos.map(todo =>
        `<div class="todo-item ${todo.done ? 'done' : ''}">
            <label>
                <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="markAsDone(${todo.id}, ${!todo.done})" />
                <span class="bubble ${todo.category === 'business' ? 'business' : 'personal'}"></span>
            </label>
            <div class="todo-content">
                <input type="text" value="${todo.content}" readonly />
            </div>
            <div class="actions">
                <button class="edit" onclick="editTask(${todo.id})">Edit</button>
                <button class="delete" onclick="deleteTask(${todo.id})">Delete</button>
            </div>
        </div>`
    ).join('');
}

// Add new task
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const content = document.getElementById('content').value;
    const category = document.querySelector('input[name="category"]:checked')?.value || 'General';
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category })
    });
    form.reset();
    loadTasks();
});

// Mark task as done
async function markAsDone(id, done) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done })
    });
    loadTasks();
}

// Delete task
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTasks();
}

// Edit task
async function editTask(id) {
    const taskElement = document.querySelector(`.todo-item input[value="${id}"]`).closest('.todo-item');
    const contentInput = taskElement.querySelector('.todo-content input');
    contentInput.removeAttribute('readonly');
    contentInput.focus();
    contentInput.addEventListener('blur', async () => {
        const newContent = contentInput.value;
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent })
        });
        loadTasks();
    });
}

// Initialize
loadTasks();
