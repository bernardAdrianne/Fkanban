// src/app/filter-by-column.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './task.model';

@Pipe({
  name: 'filterByColumn'
})
export class FilterByColumnPipe implements PipeTransform {

  transform(tasks: Task[], column: string): Task[] {
    console.log('Filtering tasks by column:', column);
    if (!tasks || !column) {
      return tasks;
    }
    return tasks.filter(task => task.column === column);
  }
}
