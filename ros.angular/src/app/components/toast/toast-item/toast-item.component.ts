import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { IDictionary } from '@models/common.model';
import { CloseMessage, Message, MessageStatus } from '@models/message.model';
import { Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-toast-item',
  templateUrl: './toast-item.component.html',
  styleUrls: ['../toast.component.scss'],
  animations: [
    trigger('messageState', [
      state(
        'visible',
        style({
          transform: 'translateY(0)',
          opacity: 1
        })
      ),
      transition('void => *', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('{{showTransitionParams}}')
      ]),
      transition('* => void', [
        animate(
          '{{hideTransitionParams}}',
          style({
            height: 0,
            opacity: 0,
            transform: 'translateY(-100%)'
          })
        )
      ])
    ])
  ]
})
export class ToastItemComponent implements AfterViewInit, OnDestroy {
  @Input() message: Message = { severity: MessageStatus.Information };

  @Input() index = 0;

  @Input() showTransitionOptions = '300ms ease-out';

  @Input() hideTransitionOptions = '250ms ease-in';

  @Output() closeToast: EventEmitter<CloseMessage> = new EventEmitter<CloseMessage>();

  @ViewChild('container', { static: false }) containerViewChild!: ElementRef;

  messageStatus = MessageStatus;
  ngUnsubscribe: Subject<void> = new Subject();

  readonly baseMessageLife: number = 8000;

  /** LifeCycle event after the view has been initialised. */
  ngAfterViewInit(): void {
    this.initTimeout();
  }

  /**
   * Initialises the timeout based on the message Life, emits to closeToast when timer complete.
   */
  initTimeout(): void {
    if (!this.message.sticky) {
      timer(this.message.life || this.baseMessageLife)
        .pipe(
          tap(() =>
            this.closeToast.emit({
              index: this.index,
              message: this.message
            })
          ),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe();
    }
  }

  /** Clears any existing timeouts. */
  clearTimeout(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /** Dom event triggered by mouse enter. */
  onMouseEnter(): void {
    this.clearTimeout();
  }

  /** Dom event triggered by mouse leaving. */
  onMouseLeave(): void {
    this.initTimeout();
  }

  /** Dom event triggered by clicking on close icon. */
  onCloseIconClick(event: MouseEvent | Event): void {
    this.clearTimeout();

    this.closeToast.emit({
      index: this.index,
      message: this.message
    });

    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  /**
   * Sets the material icon related to the message status / severity.
   * @param severity enum of the message severity.
   * @returns string of the material icon to use.
   */
  getIconName(severity: MessageStatus): string {
    const iconArray: IDictionary<string> = {
      error: 'error_outline',
      warning: 'warning',
      alert: 'add_alert',
      critical: 'error',
      success: 'done'
    };
    return !!iconArray[severity] ? iconArray[severity] : '';
  }
}
