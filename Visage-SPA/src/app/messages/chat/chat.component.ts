import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../models/message';
import { AuthService } from '../../services/auth.service';
import { AlertifyService } from '../../services/alertify.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() recipientId: number;
  @ViewChild('messageHistory') private messageHistoryContainer: ElementRef;
  content: string;
  messages: Message[];
  constructor(private authService: AuthService,
    private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    this.getMessages();
  }

  getMessages() {
    this.userService
      .getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .subscribe((response: Message[]) => {
        this.messages = response;
        this.scrollToBottom();
      }, error => {
        this.alertify.error(error);
      });
  }

  sendMessage() {
    this.userService.createMessage(this.authService.decodedToken.nameid, this.recipientId, this.content)
      .subscribe((respone: Message) => {
        this.content = '';
        this.messages.push(respone);
      }, error => {
        this.alertify.error(error);
      }, () => this.scrollToBottom());
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messageHistoryContainer.nativeElement.scrollTop = this.messageHistoryContainer.nativeElement.scrollHeight;
      });
    } catch (err) {
      this.alertify.error(err);
    }
  }
}
