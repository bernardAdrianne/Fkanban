// src/app/app.component.ts
import { Component } from '@angular/core';
import { Task } from './task.model'; // Import Task interface

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    const task = this.tasks.find(t => t.id === this.currentTaskId);
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
    this.tasks = this.tasks.filter(t => t.id !== task.id);
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
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.column = column;
        this.tasks = [...this.tasks];
      }
    }
  }
}
