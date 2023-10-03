document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-links li');
  const content = document.getElementById('content');
  const popupTask = document.querySelector('.popupTask');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = link.getAttribute('id').replace('-link', '');
      loadPage(page);
      navLinks.forEach(link => link.classList.remove('active'));
      link.classList.add('active');
    });
  });

  function loadPage(page) {
    content.innerHTML = '';
    if (page === 'add-task') {
      loadAddTaskPage();
    } else if (page === 'view-task') {
      loadViewTaskPage();
    } else if (page === 'contact') {
      loadContactPage();
    }
  }

  taskCountt();
  checkTaskPopup();

  function loadAddTaskPage() {
    content.innerHTML = `
      <h3>Super Daily Reminder For You</h3>
      <form id="taskForm">
        <label for="taskDescription">Enter Task:</label>
        <input type="text" id="taskDescription" placeholder="Enter new task" required>
        <label for="taskTime">Enter Time:</label>
        <input type="time" id="taskTime" required>
        <button type="submit" id='submitBtn'>Add Task</button>
      </form>
    `;

    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const taskDescription = document.getElementById('taskDescription').value;
      const taskTime = document.getElementById('taskTime').value;
      const task = {
        isCompleted: false, 
        description: taskDescription,
        time: `<em>by <b>${taskTime}</b></em>`,
      };
      addTaskToLocalStorage(task);
      taskForm.reset();
      checkTaskPopup();
    });
  }

  function loadViewTaskPage() {
    content.innerHTML = `
      <h2>My Tasks</h2>
      <div id="taskList" class="task-list"></div>
      <button class="clearCompleteBtn">Clear Completed</button>
    `;
    displayTasks();
    setupClearCompletedButton();
  }

  function loadContactPage() {
    content.innerHTML = `
        <div class="">
          <h2> Contact Me </h2>
          <div class="contact-form">
              <form action="https://formspree.io/f/xrgwzkjy"
                    method="POST"
                    id="contactForm">
                  <div>
                      <label for="name">Name:</label>
                      <input type="text" name="name" class="form-control" id="name" placeholder="Enter your fullname" required />
                  </div>
                  <div class="form-group">
                      <label for="email">Email:</label>
                      <input type="email" name="email" class="form-control" id="email" placeholder="Enter your email address" required />
                  </div>
                  <div class="form-group">
                      <label for="message">Message:</label>
                      <textarea name="message"
                          class="form-control"
                          id="message"
                          rows="4"
                          required>
                      </textarea>
                  </div>
                  <button type="submit" id="submitBtn">Submit</button>
              </form>
              <div class="social-media">
                  <h5>Follow Us</h5>
                <div class="social-icons">
                  <a href="https://www.facebook.com/Iamipheco/"><i class="fab fa-facebook"></i></a>
                  <a href="https://www.linkedin.com/in/Iamipheco/"><i class="fab fa-linkedin"></i></a>
                  <a href="https://www.x.com/iam_ipheco/"><i class="fab fa-twitter"></i></a>
                  <a href="https://www.instagram.com/Iamipheco/"><i class="fab fa-instagram"></i></a>
                  <a href="https://github.com/iamipheco/"><i class="fab fa-github"></i></a>
                </div>
              </div>
          </div>
          <div class='footer-page'> 
              Capstone Project Powered by LmTech Hub  
              <br/> 
              Project by ANYAEFIENA IFECHUKWU C.M
              <br />
              &copy 2023
          </div>
        </div>
    `;
  }

  function addTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    taskCountt();
    checkTaskPopup();
  }

  function taskCountt() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskCountElement = document.getElementById('taskCount');
    taskCountElement.textContent = tasks.length;
  }

  function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task-item');
      taskItem.innerHTML = `
        <div class="myTaskInput">
          <div class="task-info">
            <input type="checkbox" class="completion-checkbox" data-index="${index}" ${task.isCompleted ? 'checked' : ''}>
            <span class="description">${task.description}</span>
            <span class="time">${task.time}</span>
          </div>
          <div class="actions">
            <button class="edit-button" data-index="${index}">Edit</button>
            <button class="delete-button" data-index="${index}">Delete</button>
          </div>
        </div>
      `;
  
      taskList.appendChild(taskItem);
    });
  
    addCompletionCheckboxListeners();
    addEditButtonListeners();
    addDeleteButtonListeners();
  }

  function addCompletionCheckboxListeners() {
    const completionCheckboxes = document.querySelectorAll('.completion-checkbox');
    completionCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const index = parseInt(checkbox.getAttribute('data-index'));
        updateCompletionStatus(index, checkbox.checked);
      });
    });
  }

  function addEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(button.getAttribute('data-index'));
        if (button.textContent === 'Edit') {
          toggleEditSaveButton(button);
          editTask(index, button);
        } else {
          saveEditedTask(index, button);
        }
      });
    });
  }
  
  function toggleEditSaveButton(button) {
    if (button.textContent === 'Edit') {
      button.textContent = 'Save';
    } else {
      button.textContent = 'Edit';
    }
  }
  
  function saveEditedTask(index, button) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskItem = document.querySelectorAll('.task-item')[index];
    const inputField = taskItem.querySelector('.edit-input');
    
    tasks[index].description = inputField.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayTasks();
    toggleEditSaveButton(button); 
  }

  function addDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(button.getAttribute('data-index'));
        deleteTask(index);
      });
    });
  }

  function setupClearCompletedButton() {
    const clearCompleteBtn = document.querySelector('.clearCompleteBtn');
    clearCompleteBtn.addEventListener('click', function () {
      clearCompletedTasks();
    });
  }

  function clearCompletedTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => !task.isCompleted);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    taskCountt();
  }

  function updateCompletionStatus(index, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].isCompleted = isCompleted;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function editTask(index, button) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskItem = document.querySelectorAll('.task-item')[index];
    const descriptionElement = taskItem.querySelector('.description');
    
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = tasks[index].description;
    inputField.classList.add('edit-input');
    inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        saveEditedTask(index, button); // Save on Enter key press
      }
    });
  
    descriptionElement.replaceWith(inputField);
    inputField.focus();
  }
  

  function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    taskCountt();
  }

  function checkTaskPopup() {
    const currentTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
  
    currentTasks.forEach(task => {
      const taskTimeParts = task.time.match(/(\d{2}):(\d{2})/);
      if (taskTimeParts) {
        const taskHour = parseInt(taskTimeParts[1]);
        const taskMinute = parseInt(taskTimeParts[2]);
  
        if (currentHour === taskHour && currentMinute >= taskMinute && currentMinute < taskMinute + 5) {
          showPopup(task);
        }
      }
    });
  }
  
  function showPopup(task) {
    popupTask.innerHTML = `
      <div class="popup-content">
        <p>Hey there, you have a task set  ${task.time}, kindly check your task to carry out that activity.</p>
      </div>
    `;
    popupTask.style.display = 'block';

    setTimeout(() => {
      popupTask.style.display = 'none';
    }, 300000);
  }

    popupTask.addEventListener('click', function () {
      popupTask.style.display = 'none';
      loadPage('view-task');
    });

  setInterval(checkTaskPopup, 60000); 

  loadPage('add-task');
});
