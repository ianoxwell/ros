import { Injectable } from '@angular/core';
import { Message } from '@models/message.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSource$ = new Subject<Message | Message[]>();
  private clearSource$ = new Subject<string>();

  messageObserver = this.messageSource$.asObservable();
  clearObserver = this.clearSource$.asObservable();

  add(message: Message) {
    if (message) {
      this.messageSource$.next(message);
    }
  }

  addAll(messages: Message[]) {
    if (messages && messages.length) {
      this.messageSource$.next(messages);
    }
  }

  /** Clears source subject. */
  clear(key?: string): void {
    if (!!key) {
      this.clearSource$.next(key);
    }
  }
}
