import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GraphDoughnutComponent } from '@components/graph-doughnut/graph-doughnut.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { PaginatorComponent } from '@components/paginator/paginator.component';
import { SentenceCasePipe } from '@pipes/sentence-case.pipe';
import { ToTitleCasePipe } from '@pipes/title-case.pipe';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { IngredientFilterComponent } from './ingredient-filter/ingredient-filter.component';
import { IngredientTableComponent } from './ingredient-table/ingredient-table.component';
import { IngredientsRoutingModule } from './ingredients-routing.module';
import { IngredientsComponent } from './ingredients.component';

@NgModule({
  imports: [
    CommonModule,
    IngredientsRoutingModule,
    PageTitleComponent,
    ReactiveFormsModule,
    LoadingIndicatorComponent,
    GraphDoughnutComponent,
    ToTitleCasePipe,
    DigitOnlyModule,
    DragDropModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    SentenceCasePipe,
    PaginatorComponent
  ],
  declarations: [
    IngredientsComponent,
    IngredientFilterComponent,
    IngredientTableComponent
  ],
  exports: [IngredientsComponent]
})
export class IngredientsModule {}
