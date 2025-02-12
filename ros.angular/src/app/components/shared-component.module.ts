import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { SaveButtonComponent } from './save-button/save-button.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  declarations: [SaveButtonComponent, LoadingIndicatorComponent],
  exports: [SaveButtonComponent, LoadingIndicatorComponent]
})
export class SharedComponentModule {}
