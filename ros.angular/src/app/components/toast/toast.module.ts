import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastItemComponent } from '../toast/toast-item/toast-item.component';
import { ToastComponent } from '../toast/toast.component';

@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, MatIconModule, MatButtonModule],
  declarations: [ToastItemComponent, ToastComponent],
  exports: [ToastComponent]
})
export class ToastModule {}
