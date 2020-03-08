import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private subject = new Subject<any>();
  constructor() { }

  /*
  Allow to publish a new message ({text:string, type:error|info|success|warning}) into the messaging system
  */
  sendMessage(message: any) {
    this.subject.next(message);
  }

  //Allow to clear the message stack
  clearMessages() {
    this.subject.next({});
  }

  //Get the last message published on the message stack
  getMessage() {
    return this.subject.asObservable();
  }
}
