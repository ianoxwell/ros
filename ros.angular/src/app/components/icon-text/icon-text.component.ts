import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-icon-text',
    templateUrl: './icon-text.component.html',
    styleUrls: ['./icon-text.component.scss'],
    imports: [CommonModule, MatIconModule]
})
export class IconTextComponent {
  @Input() text = '';
  @Input() icon = '';
  @Input() titleText = '';
  @Input() color = '';
  @Input() iconLeft = true;
}
