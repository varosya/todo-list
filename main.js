let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

todoList = todoList.map(task => ({
    ...task,
    completed: task.completed || false
}));

renderTodoList();

function renderTodoList() {
    let todoListHtml = '';

    for (let i = todoList.length - 1; i >= 0; i--) {
        const { name, dueDate, completed } = todoList[i];
        const displayDate = dueDate ? new Date(dueDate).toLocaleDateString() : 'No date';
        
        const html = `
        <div class="task-container">
            <div class='task'>
                <input type='checkbox' class='checkboxes' ${completed ? 'checked' : ''}>
                <div class='task-name ${completed ? 'completed-task' : ''}'>${name}</div>
            </div>
            <div class="due-date">${displayDate}</div>
            <button class="delete-button" data-index="${i}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        </div>`;
        todoListHtml += html;
    };
    
    document.querySelector('.js-todo-list').innerHTML = todoListHtml;

    addEventListeners();
    displayTaskAmount();
}

function addEventListeners() {
    document.querySelectorAll('.delete-button')
        .forEach((deleteButton) => {
            deleteButton.addEventListener('click', (event) => {
                const index = parseInt(event.currentTarget.dataset.index);
                todoList.splice(index, 1);
                renderTodoList();
                saveToStorage();
            });
        });

    document.querySelectorAll('.checkboxes')
        .forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                const index = parseInt(event.currentTarget.closest('.task-container').querySelector('.delete-button').dataset.index);
                const taskName = event.currentTarget.closest('.task').querySelector('.task-name');
                
                todoList[index].completed = event.target.checked;
                
                if (event.target.checked) {
                    taskName.classList.add('completed-task');
                } else {
                    taskName.classList.remove('completed-task');
                }
                
                saveToStorage();
                displayTaskAmount();
            });
        });
}

function displayTaskAmount() {
    const pendingTasksAmount = todoList.filter(task => !task.completed).length;
    const numberOfTasks = document.querySelector('.task-amount');

    if (todoList.length === 0) {
        numberOfTasks.innerHTML = '';
    } else {
        numberOfTasks.innerHTML = `
        <span>You have ${pendingTasksAmount} ${pendingTasksAmount === 1 ? 'task' : 'tasks'} pending</span>
        <button id="clear-all-button">Clear all</button>`;
    }

    if (todoList.length) {
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
    
document.body.addEventListener('keydown', (event) => {
    if (event.key === "Enter") addTodo();
});

function addTodo() {
    const inputElement = document.querySelector('.name-input');
    const name = inputElement.value.trim();

    const inputDate = document.querySelector('.due-date-input');
    const dueDate = inputDate.value;

    if (name) {
        todoList.push({
            name,
            dueDate,
            completed: false
        });
        
        inputElement.value = '';
        inputDate.value = '';
        renderTodoList();
        saveToStorage();
    }
}

function saveToStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
