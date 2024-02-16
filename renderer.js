const db = require('./database.js');

// Get form elements
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Load todos on startup
loadTodos();
;
// Handle form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const task = input.value.trim();
  if (task) {
    addTodo(task);
    input.value = '';
    input.focus();
  }
});

function loadTodos() {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      displayTodo(row);
    });
  });
}

function addTodo(task) {
  db.run('INSERT INTO todos(task) VALUES(?)', [task], function(err) {
    if (err) {
      return console.log(err.message);
    }
    displayTodo({ id: this.lastID, task, done: 0 });
  });
}

function displayTodo(todo) {
  const li = document.createElement('li');
  li.id = todo.id;
  li.textContent = todo.task;
  if (todo.done) {
    li.classList.add('done');
  }

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteTodo(todo.id);
  });
  li.appendChild(deleteButton);

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Update';
  updateButton.addEventListener('click', () => {
    const newTask = prompt('Update task', todo.task);
    if (newTask) {
      updateTodo(todo.id, newTask);
    }
  });
  li.appendChild(updateButton);

  list.appendChild(li);
}

function deleteTodo(id) {
  db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      return console.log(err.message);
    }
    document.getElementById(id).remove();
  });
}

function updateTodo(id, task) {
  db.run('UPDATE todos SET task = ? WHERE id = ?', [task, id], (err) => {
    if (err) {
      return console.log(err.message);
    }
    const li = document.getElementById(id);
    li.textContent = task;
  });
}