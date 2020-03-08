import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course } from '../models/course';
import { Observable, throwError, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { MessagingService } from './messaging.service';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private coursesApi = 'api/courses';

  constructor(private http: HttpClient, private messageService: MessagingService) {
  }

  /*
  Return an observable collection of all courses on the system
  */
  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesApi).pipe(
      catchError(this.handleError('GetAll', []))
    );
  }

  /*
  Return an specific course by id
  */
  get(id): Observable<Course> {
    return this.http.get<Course>(`${this.coursesApi}/${id}`).pipe(
      tap(course => course.startDate = new Date(course.startDate)),
      catchError(this.handleError('Get', null))
    );
  }

  /*
  Create a new course using the information provided
  */
  create(course: Course): Observable<any> {
    return this.http.post(this.coursesApi, course, httpOptions).pipe(
      catchError(this.handleError('Create', null))
    );
  }

  /*
  Update an specific course using the information provided
  */
  update(course: Course): Observable<any> {
    return this.http.put(this.coursesApi+'/'+course.id, course, httpOptions).pipe(
      map(x => course),
      catchError(this.handleError('Delete', null))
    );
  }

  /*
  Delete an specific course by id
  */
  delete(id) {
    return this.http.delete(`${this.coursesApi}/${id}`).pipe(
      map(x => id),
      catchError(this.handleError('Delete', null))
    );
  }

  /*
  Handle any error occurred during http operations
  */
  handleError<T>(operation:string, result?:T) {
    return (error: any): Observable<T> => {
      //Send a message to the message service notifying the failure
      this.messageService.sendMessage({ text: `Unable to complete ${operation} operation due: ${error.message}`, type: 'error'});
      return of(result as T);
    }
  }
}
