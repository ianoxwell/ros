import { animateChild, AnimationEvent, query, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ComponentBase } from '@components/base/base.component.base';
import { CloseMessage, Message } from '@models/message.model';
import { MessageService } from '@services/message.service';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [trigger('toastAnimation', [transition(':enter, :leave', [query('@*', animateChild())])])]
})

// note - strongly based off of primeFaces - https://primefaces.org/primeng/showcase/#/toast
export class ToastComponent extends ComponentBase implements OnInit {
  @Input() key = '';

  @Input() autoZIndex = true;

  @Input() baseZIndex = 0;

  @Input() styleClass = '';

  @Input() position = 'top-right';

  @Input() modal = false;

  @Input() showTransitionOptions = '300ms ease-out';

  @Input() hideTransitionOptions = '250ms ease-in';

  @Output() closeToast: EventEmitter<CloseMessage> = new EventEmitter<CloseMessage>();

  @ViewChild('container', { static: false }) containerViewChild!: ElementRef<HTMLDivElement>;

  messages: Message[] = [];

  mask: HTMLDivElement | null = null;

  constructor(public messageService: MessageService, private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.subscribeMessages().subscribe();
    this.subscribeClear().subscribe();
  }

  /**
   * On Init subscribes to messages service. On destroy unsubscribes.
   * @returns Observable of Message or array of Messages.
   */
  subscribeMessages(): Observable<Message | Message[]> {
    return this.messageService.messageObserver.pipe(
      filter((m) => !!m),
      tap((messages: Message | Message[]) => {
        if (messages instanceof Array) {
          const filteredMessages = messages.filter((m: Message) => this.key === m.key);
          this.messages = this.messages ? [...this.messages, ...filteredMessages] : [...filteredMessages];
        } else {
          this.messages = this.messages ? [...this.messages, ...[messages]] : [messages];
        }

        if (this.modal && this.messages && this.messages.length) {
          this.enableModality();
        }
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  /**
   * Listen to the messageService for clearing of messages.
   * @returns Observable string.
   */
  subscribeClear(): Observable<string> {
    return this.messageService.clearObserver.pipe(
      tap((key: string) => {
        if (key) {
          if (this.key === key) {
            this.messages = [];
          }
        } else {
          this.messages = [];
        }

        if (this.modal) {
          this.disableModality();
        }
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  /**
   * Action to take on closing of message - through timeout or manual close.
   * @param event index and message.
   */
  onMessageClose(event: CloseMessage): void {
    this.messages.splice(event.index, 1);

    if (this.messages.length === 0) {
      this.disableModality();
    }

    this.closeToast.emit({
      index: event.index,
      message: event.message
    });
  }

  /**
   * Enables Modality for messages to append to body.
   * TODO  verify that this is needed when using Material.
   */
  enableModality(): void {
    if (!this.mask) {
      this.mask = document.createElement('div');
      this.mask.style.zIndex = String(this.baseZIndex + 1000 - 1);
      if (this.mask.classList) {
        this.mask.classList.add('ui-widget-overlay');
        this.mask.classList.add('ui-dialog-mask');
      } else {
        this.mask.className = 'ui-widget-overlay ui-dialog-mask';
      }
      document.body.appendChild(this.mask);
    }
  }

  /**
   * Disables any modality for the messages.
   */
  disableModality(): void {
    if (this.mask) {
      document.body.removeChild(this.mask);
      this.mask = null;
    }
  }

  /**
   * Triggers on Animation start.
   * @param event Animation event.
   */
  onAnimationStart(event: AnimationEvent): void {
    if (event.fromState === 'void' && this.autoZIndex) {
      this.containerViewChild.nativeElement.setAttribute('style', `z-index: ${String(this.baseZIndex + 1000)}`);
    }
  }
}
