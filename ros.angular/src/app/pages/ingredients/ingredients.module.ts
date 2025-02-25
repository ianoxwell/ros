import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { EditCommonMineralsComponent } from './edit-common-minerals/edit-common-minerals.component';
import { EditCommonVitaminsComponent } from './edit-common-vitamins/edit-common-vitamins.component';
import { EditIngredientBasicComponent } from './edit-ingredient-basic/edit-ingredient-basic.component';
import { EditIngredientNutritionComponent } from './edit-ingredient-nutrition/edit-ingredient-nutrition.component';
import { IngredientConversionFormComponent } from './ingredient-conversion-form/ingredient-conversion-form.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { IngredientFilterComponent } from './ingredient-filter/ingredient-filter.component';
import { IngredientPricesFormComponent } from './ingredient-prices-form/ingredient-prices-form.component';
import { IngredientTableComponent } from './ingredient-table/ingredient-table.component';
import { IngredientsRoutingModule } from './ingredients-routing.module';
import { IngredientsComponent } from './ingredients.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GraphDoughnutComponent } from '@components/graph-doughnut/graph-doughnut.component';
import { ToTitleCasePipe } from '@pipes/title-case.pipe';

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
    MatTabsModule
  ],
  declarations: [
    IngredientsComponent,
    IngredientEditComponent,
    IngredientFilterComponent,
    IngredientTableComponent,
    IngredientPricesFormComponent,
    IngredientConversionFormComponent,
    EditIngredientBasicComponent,
    EditCommonMineralsComponent,
    EditCommonVitaminsComponent,
    EditIngredientNutritionComponent
  ],
  exports: [IngredientsComponent]
})
export class IngredientsModule {}
