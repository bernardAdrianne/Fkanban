import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from './task.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Kanban';
  tasks: Task[] = [];
  currentTaskId: string | null = null;
  draggedTask: Task | null = null;
  newTask = { name: '', dueDate: '' };
  editTask = { name: '', dueDate: '' };
  showAddTaskForm = false;
  showEditTaskForm = false;
  isLoggedIn: boolean = false;

  showLoginForm: boolean = true;
  showRegisterForm: boolean = false;

  loginData = { email: '', password: '' };
  registerData = { username: '', email: '', password: '' };

  loginErrors = { email: '', password: '' };
  registerErrors = { username: '', email: '', password: '' };

  constructor(private router: Router) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = false;
    this.showLoginForm = !this.isLoggedIn;
    this.showRegisterForm = false;
  }

  login() {
    // Reset errors
    this.loginErrors = { email: '', password: '' };

    // Validate input fields
    if (!this.loginData.email) {
      this.loginErrors.email = 'Email is required';
    } else if (!this.validateEmail(this.loginData.email)) {
      this.loginErrors.email = 'Invalid email format';
    }

    if (!this.loginData.password) {
      this.loginErrors.password = 'Password is required';
    }

    // Check for errors and return if any
    if (this.loginErrors.email || this.loginErrors.password) {
      return;
    }

    // Simulate login process
    console.log('Logging in:', this.loginData);
    this.isLoggedIn = true;
    this.showLoginForm = false;
    this.showRegisterForm = false;
  }

  register() {
    // Reset errors
    this.registerErrors = { username: '', email: '', password: '' };

    // Validate input fields
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

    // Check for errors and return if any
    if (
      this.registerErrors.username ||
      this.registerErrors.email ||
      this.registerErrors.password
    ) {
      return;
    }

    // Simulate registration process
    console.log('Registering:', this.registerData);
    this.showRegisterForm = false;
    this.showLoginForm = true;
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

  addTask() {
    if (this.newTask.name.trim() === '') {
      alert('Please enter a task name.');
      return;
    }
    const task: Task = {
      id: this.generateId(),
      name: this.newTask.name,
      dueDate: this.newTask.dueDate,
      column: 'todo',
    };
    console.log('Adding task:', task);
    this.tasks = [...this.tasks, task];
    this.newTask = { name: '', dueDate: '' };
    this.showAddTaskForm = false;
  }

  editCurrentTask() {
    const task = this.tasks.find((t) => t.id === this.currentTaskId);
    if (task) {
      task.name = this.editTask.name;
      task.dueDate = this.editTask.dueDate;
      this.showEditTaskForm = false;
    }
  }

  showTaskForm() {
    this.showAddTaskForm = true;
  }

  showEditForm(task: Task) {
    this.currentTaskId = task.id;
    this.editTask.name = task.name;
    this.editTask.dueDate = task.dueDate;
    this.showEditTaskForm = true;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
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
        this.tasks = [...this.tasks];
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
