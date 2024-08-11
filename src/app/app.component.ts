import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from './task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Kanban';
  tasks: Task[] = [];
  currentTaskId: string | null = null;
  draggedTask: Task | null = null;
  newTask = { name: '', dueDate: '', dueTime: '' };
  editTask = { name: '', dueDate: '', dueTime: '' };
  showAddTaskForm = false;
  showEditTaskForm = false;
  showLogoutModal: boolean = false;
  isLoggedIn: boolean = false;

  showLoginForm: boolean = false;
  showRegisterForm: boolean = false;

  loginData = { email: '', password: '' };
  registerData = { username: '', email: '', password: '' };

  loginErrors = { email: '', password: '' };
  registerErrors = { username: '', email: '', password: '' };

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeApp();
  }

  initializeApp() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadTasks();
    } else {
      this.showLoginForm = true;
    }
    this.loadFormData();
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  loadFormData() {
    const storedLoginData = localStorage.getItem('loginData');
    const storedRegisterData = localStorage.getItem('registerData');

    if (storedLoginData) {
      this.loginData = JSON.parse(storedLoginData);
    }

    if (storedRegisterData) {
      this.registerData = JSON.parse(storedRegisterData);
    }
  }

  saveFormData() {
    localStorage.setItem('loginData', JSON.stringify(this.loginData));
    localStorage.setItem('registerData', JSON.stringify(this.registerData));
  }

  loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  login() {
    this.loginErrors = { email: '', password: '' };

    if (!this.loginData.email) {
      this.loginErrors.email = 'Email is required';
    } else if (!this.validateEmail(this.loginData.email)) {
      this.loginErrors.email = 'Invalid email format';
    }

    if (!this.loginData.password) {
      this.loginErrors.password = 'Password is required';
    }

    if (this.loginErrors.email || this.loginErrors.password) {
      return;
    }

    console.log('Logging in:', this.loginData);
    this.isLoggedIn = true;
    this.showLoginForm = false;
    this.showRegisterForm = false;
    localStorage.setItem('isLoggedIn', 'true');
    this.saveFormData();
    this.loadTasks();
  }

  register() {
    this.registerErrors = { username: '', email: '', password: '' };

    if (!this.registerData.username) {
      this.registerErrors.username = 'Username is required';
    }

    if (!this.registerData.email) {
      this.registerErrors.email = 'Email is required';
    } else if (!this.validateEmail(this.registerData.email)) {
      this.registerErrors.email = 'Invalid email format';
    }

    if (!this.registerData.password) {
      this.registerErrors.password = 'Password is required';
    } else if (this.registerData.password.length < 6) {
      this.registerErrors.password = 'Password must be at least 6 characters';
    }

    if (
      this.registerErrors.username ||
      this.registerErrors.email ||
      this.registerErrors.password
    ) {
      return;
    }

    console.log('Registering:', this.registerData);
    this.showRegisterForm = false;
    this.showLoginForm = true;
    this.saveFormData();
  }

  validateEmail(email: string): boolean {
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  handleInputFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    target.classList.add('focused');
  }

  handleInputBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    target.classList.remove('focused');
    this.validateField(target);
  }

  validateField(input: HTMLInputElement) {
    if (input.classList.contains('input-error')) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }
  }

  generateId(): string {
    return 'task-' + Date.now();
  }

  hasTasks(column: string): boolean {
    return this.tasks.some(task => task.column === column);
  }
  
  addTask() {
    if (this.newTask.name.trim() === '') {
      alert('Please enter a task name.');
      return;
    }
    const task: Task = {
      id: this.generateId(),
      name: this.newTask.name,
      dueDate: this.newTask.dueDate,
      dueTime: this.newTask.dueTime,
      column: 'todo',
    };
    console.log('Adding task:', task);
    this.tasks = [...this.tasks, task];
    this.newTask = { name: '', dueDate: '', dueTime: ''};
    this.showAddTaskForm = false;
    this.saveTasks();
  }

  editCurrentTask() {
    const task = this.tasks.find((t) => t.id === this.currentTaskId);
    if (task) {
      task.name = this.editTask.name;
      task.dueDate = this.editTask.dueDate;
      dueTime: this.editTask.dueTime,
      this.showEditTaskForm = false;
      this.saveTasks();
    }
  }
  
  getTaskCount(column: string): number {
    return this.tasks.filter(task => task.column === column).length;
  }

  isOverdue(task: Task): boolean {
    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return dueDate < currentDate;
  }

  showTaskForm() {
    this.showAddTaskForm = true;
  }

  showEditForm(task: Task) {
    this.currentTaskId = task.id;
    this.editTask.name = task.name;
    this.editTask.dueDate = task.dueDate;
    this.editTask.dueTime = task.dueTime;
    this.showEditTaskForm = true;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    this.saveTasks();
  }

  startDrag(event: DragEvent, task: Task) {
    event.dataTransfer?.setData('text/plain', task.id);
    this.draggedTask = task;
  }

  endDrag() {
    this.draggedTask = null;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  dropTask(column: string, event: DragEvent) {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (task) {
        task.column = column;
    
        if (column === 'done') {
          task.dueDate = new Date().toISOString().split('T')[0];  
        }
        this.tasks = [...this.tasks];
        this.saveTasks();
      }
    }
  }

  logout() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    this.showLogoutModal = false;
    this.isLoggedIn = false;
    this.showLoginForm = true;
    this.showRegisterForm = false;
    console.log('Logging out...');

    this.loginData = { email: '', password: '' };
    this.registerData = { username: '', email: '' , password: '' };

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginData');
    localStorage.removeItem('registerData');
    localStorage.removeItem('tasks');

    console.log('Logging out...');
  }


  handleKeydown(event: KeyboardEvent, currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (currentInput.value.trim() === '') {
        this.validateField(currentInput);
      } else if (nextInput) {
        nextInput.focus();
      }
    }
  }
}
