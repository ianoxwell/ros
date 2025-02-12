import { Component } from '@angular/core';
import { NavigationService } from '@services/navigation/navigation.service';
import { PageTitleService } from '@services/page-title.service';
import { WidthObserverService } from '@services/width-observer/width-observer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private pageTitleService: PageTitleService,
    private widthObserverService: WidthObserverService,
    private navigationService: NavigationService
  ) {
    this.navigationService.listenToRouteEnd().subscribe();
    this.pageTitleService.listen().subscribe();
    this.widthObserverService.listenBreakpoints().subscribe();
  }
}
