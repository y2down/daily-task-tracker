const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const allBtn = document.getElementById('allBtn');
const activeBtn = document.getElementById('activeBtn');
const completedBtn = document.getElementById('completedBtn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

document.addEventListener('DOMContentLoaded', loadTasks);
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if(e.key === 'Enter') addTask(); });
allBtn.addEventListener('click', () => filterTasks('all'));
activeBtn.addEventListener('click', () => filterTasks('active'));
completedBtn.addEventListener('click', () => filterTasks('completed'));
clearCompletedBtn.addEventListener('click', clearCompleted);

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({text: li.firstChild.textContent, completed: li.classList.contains('completed')});
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(t => createTaskElement(t.text, t.completed));
}

function createTaskElement(text, completed=false) {
  const li = document.createElement('li');
  li.textContent = text;
  if(completed) li.classList.add('completed');

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Delete';
  removeBtn.onclick = e => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  };

  li.appendChild(removeBtn);
  li.onclick = () => {
    li.classList.toggle('completed');
    saveTasks();
  };

  taskList.appendChild(li);
}

function addTask() {
  const taskText = taskInput.value.trim();
  if(!taskText) return alert('Please enter a task!');
  createTaskElement(taskText);
  taskInput.value = '';
  saveTasks();
}

function filterTasks(status) {
  taskList.querySelectorAll('li').forEach(li => {
    li.style.display = '';
    if(status==='active' && li.classList.contains('completed')) li.style.display='none';
    if(status==='completed' && !li.classList.contains('completed')) li.style.display='none';
  });
  [allBtn, activeBtn, completedBtn].forEach(b => b.classList.remove('active'));
  if(status==='all') allBtn.classList.add('active');
  if(status==='active') activeBtn.classList.add('active');
  if(status==='completed') completedBtn.classList.add('active');
}

function clearCompleted() {
  taskList.querySelectorAll('li.completed').forEach(li => li.remove());
  saveTasks();
}