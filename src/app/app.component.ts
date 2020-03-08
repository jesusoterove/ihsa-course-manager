import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuiMessageService, MessageConfig, MessagePosition, MessageState } from 'ngx-fomantic-ui';

import { MessagingService } from './providers/messaging.service';

const messageStateHash = {
  'info': MessageState.Info,
  'error': MessageState.Error,
  'warning': MessageState.Warning,
  'success': MessageState.Success
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Course Management System';
  private messSubscription;
  constructor(
    private fuiMessService: FuiMessageService,
    private messageService: MessagingService
    ){
    this.fuiMessService.position = MessagePosition.BottomRight;
    this.fuiMessService.isNewestOnTop = true;
  }

  ngOnInit() {
    //Subscribe to the message system to notify messages using the fuiMessageService
    this.messSubscription = this.messageService.getMessage().subscribe(mess => {
      let state = messageStateHash[mess.type] || MessageState.Default;
      const message = new MessageConfig(mess.text, state, mess.header || 'Ihsa Course Management System');
      this.fuiMessService.show(message);
    });
  }

  ngOnDestroy() {
    //Clear the message subscription
    this.messSubscription.unsuscribe();
  }

}
