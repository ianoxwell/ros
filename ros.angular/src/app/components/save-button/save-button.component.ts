import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
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
