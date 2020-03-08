import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryCourseService implements InMemoryDbService {

  constructor() { }

  createDb() {
    let courses = [
      { id: 1, name: 'Angular', startDate: new Date(2020, 2, 20), price: 15 },
      { id: 2, name: 'React', startDate: new Date(2020, 2, 25), price: 20 },
      { id: 3, name: 'Vue', startDate: new Date(2020, 2, 30), price: 14 },
    ];
    return {courses};
  }
}
