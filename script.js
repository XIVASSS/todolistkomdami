document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filter = 'all';

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (filter === 'all') return true;
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
        });
        filteredTodos.forEach((todo, index) => {
            if(!todo) return null;
            const div = document.createElement('div');
            div.className = `todo-card ${todo.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <div class="checkbox-container">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
                    <span>${todo.text}</span>
                </div>
                <div class="actions">
                    <button class="edit"><i class="fas fa-edit"></i></button>
                    <button class="delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
            div.querySelector('.delete').addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });
            div.querySelector('.edit').addEventListener('click', () => {
                const newText = prompt('Edit your task:', todo.text);
                if (newText) {
                    todos[index].text = newText;
                    saveTodos();
                    renderTodos();
                }
            });
            div.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                todos[e.target.dataset.index].completed = e.target.checked;
                saveTodos();
                renderTodos();
            });
            todoList.appendChild(div);
        });
    };

    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const newTodo = todoInput.value.trim();
        if (newTodo) {
            todos.push({ text: newTodo, completed: false });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filter = button.id;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTodos();
        });
    });

    renderTodos();
});
