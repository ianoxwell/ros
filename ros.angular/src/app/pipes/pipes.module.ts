import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToTitleCasePipe } from './title-case.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SentenceCasePipe } from './sentence-case.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ToTitleCasePipe, SafeHtmlPipe, SentenceCasePipe],
  exports: [ToTitleCasePipe, SafeHtmlPipe, SentenceCasePipe],
  providers: [ToTitleCasePipe, SentenceCasePipe]
})
export class PipesModule {}
