document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const errorMessage = document.getElementById('errorMessage');

  // Load tasks from localStorage
  let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  renderTasks(savedTasks);

  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === '') {
      errorMessage.textContent = 'Please enter a task.';
      return; // Prevent adding empty tasks
    }

    errorMessage.textContent = '';

    const newTask = { text: taskText, done: false, pinned: false };
    savedTasks.push(newTask);

    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(savedTasks));

    renderTasks(savedTasks);
    taskInput.value = '';
  });

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
          <div class="item">
            <input class="taskItem ${task.done ? 'done' : ''} ${
        task.pinned ? 'pinned' : ''
      }" type="text" value="${task.text}" disabled /> 
            <input type="checkbox" class="pinCheckbox" ${
              task.pinned ? 'checked' : ''
            } />
            <button class="doneToggleBtn" data-index="${index}">Done / Undo</button>
            <button class="editTaskBtn" data-index="${index}">Edit</button>
            <button class="deleteTaskBtn" data-index="${index}">X</button>
          </div>
        `;
      taskList.appendChild(listItem);
    });

    // Add event listeners for edit and delete buttons, and set status
    document.querySelectorAll('.editTaskBtn').forEach((editBtn) => {
      editBtn.addEventListener('click', handleEditTask);
    });

    document.querySelectorAll('.deleteTaskBtn').forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', handleDeleteTask);
    });

    document.querySelectorAll('.doneToggleBtn').forEach((doneToggleBtn) => {
      doneToggleBtn.addEventListener('click', (event) => {
        const clickedElement =
          event.target.parentElement.querySelector('.taskItem');

        if (clickedElement.classList.contains('taskItem')) {
          handleToggleTaskStatus(clickedElement);
        }
      });
    });

    document.querySelectorAll('.pinCheckbox').forEach((pinCheckbox, index) => {
      pinCheckbox.addEventListener('change', () => {
        savedTasks[index].pinned = pinCheckbox.checked;
        if (savedTasks[index].pinned) {
          savedTasks.unshift(savedTasks[index]);
          savedTasks.splice(index + 1, 1);
        }
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
        renderTasks(savedTasks);
      });
    });
  }

  function handleEditTask(event) {
    const index = event.target.dataset.index;
    const itemInput = event.target.parentElement.querySelector('.taskItem');

    itemInput.disabled = false;

    // Focus on input field
    itemInput.focus();

    // Add a blur event listener to save the changes when the input loses focus
    itemInput.addEventListener('blur', function () {
      itemInput.disabled = true;
      savedTasks[index].text = itemInput.value;
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
      renderTasks(savedTasks);
    });
  }

  function handleDeleteTask(event) {
    const index = event.target.dataset.index;
    savedTasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
    renderTasks(savedTasks);
  }

  function handleToggleTaskStatus(taskItem) {
    taskItem.classList.toggle('done');
    const tasks = Array.from(document.querySelectorAll('.taskItem')).map(
      (taskItem) => ({
        text: taskItem.value,
        done: taskItem.classList.contains('done'),
        pinned: taskItem.parentElement.querySelector('.pinCheckbox').checked,
      })
    );

    savedTasks = tasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(savedTasks);
  }
});
