import { OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ComponentBase implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ngUnsubscribe: Subject<any> = new Subject();

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  destroySubscriptions(): void {
    this.ngUnsubscribe.next(undefined);
    this.ngUnsubscribe.complete();
  }
}
