import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-save-button',
    templateUrl: './save-button.component.html',
    styleUrls: ['./save-button.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule]
})
export class SaveButtonComponent {
  @Input() dirty = true;
  @Input() valid = true;
  @Input() isSaving = false;
  @Input() color = 'primary';
  @Input() label = 'Save';

  @Input() iconName = 'cloud_done';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Output() save = new EventEmitter<void>();
}
