let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
let l = todoList.length;

renderTodoList();

function renderTodoList() {
    let todoListHtml = '';

    for (let i = todoList.length - 1; i >= 0; i--) {
        const { name, dueDate} = todoList[i];
        const html = `
        <div class='task'>
            <input type='checkbox' class='checkboxes'>
            <div class='task-name'>${name}</div>
        </div>
        <div>${dueDate}</div>
        <button class="delete-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
        </button>`;
        todoListHtml += html;
    };
    document.querySelector('.js-todo-list').innerHTML = todoListHtml;

    document.querySelectorAll('.delete-button')
        .forEach((deleteButton, index) => {
            deleteButton.addEventListener('click', () => {
                todoList.splice(l - index - 1, 1);
                renderTodoList();
                saveToStorage();
                displayTaskAmount();
            });
        });

    document.querySelectorAll('.checkboxes')
        .forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                const taskName = checkbox.closest('.task').querySelector('.task-name');
                todoList[l - index - 1].completed = checkbox.checked;
                if (checkbox.checked) {
                    taskName.classList.add('completed-task');
                } else {
                    taskName.classList.remove('completed-task');    
                }
                saveToStorage();
                displayTaskAmount();
            });
        });
    displayTaskAmount();
}

function displayTaskAmount() {
    const pendingTasksAmount = todoList.filter(task => !task.completed).length;
    const numberOfTasks = document.querySelector('.task-amount');


    if (l === 0) {
        numberOfTasks.innerHTML = '';
    } else {
        numberOfTasks.innerHTML = `
        <span>You have ${pendingTasksAmount} ${pendingTasksAmount === 1 ? 'task' : 'tasks'} pending task</span>
        <button id="clear-all-button">Clear all</button>`;
    }

    if (l) {
    document.getElementById('clear-all-button')
        .addEventListener('click', () => {
            todoList = [];
            renderTodoList();
            saveToStorage();
        });
    }
}

document.querySelector('.add-button')
    .addEventListener('click', () => addTodo());
document.body.addEventListener
    ('keydown', (event) => event.key === "Enter" ? addTodo() : false);

function addTodo() {
    const inputElement = document.querySelector('.name-input');
    const name = inputElement.value;

    const inputDate = document.querySelector('.due-date-input');
    const dueDate = inputDate.value;

    if (name) {
        todoList.push({
        name,
        dueDate
    });}

    inputElement.value = '';

    renderTodoList();

    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
