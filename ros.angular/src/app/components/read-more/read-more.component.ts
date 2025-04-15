import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';

@Component({
  selector: 'app-read-more',
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './read-more.component.html',
  styleUrl: './read-more.component.scss'
})
export class ReadMoreComponent {
  @Input({required: true}) text!: string;
  readMoreOpenState = signal(false);

  currentOpenState() {
    const currentOpenState = this.readMoreOpenState();
    this.readMoreOpenState.set(!currentOpenState)
  }
}
