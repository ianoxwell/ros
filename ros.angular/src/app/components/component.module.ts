import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from '@pipes/pipes.module';
import { IngredientEditFormService } from '@services/ingredient-edit-form.service';
import { ReferenceService } from '@services/reference.service';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { CompleteMaterialModule } from '../app-material.module';
import { FormAutocompleteDirective } from '../directives/form-autocomplete.directive';
import { MatInputAutoCompleteDirective } from '../directives/mat-input-autocomplete.directive';
import { NutrientTotalValidator } from '../validators/nutrient-total.validator';
import { AppHeaderComponent } from './app-header/app-header.component';
import { GraphDoughnutComponent } from './graph-doughnut/graph-doughnut.component';
import { IconTextComponent } from './icon-text/icon-text.component';
import { EditCommonMineralsComponent } from './ingredient/edit/edit-common-minerals/edit-common-minerals.component';
import { EditCommonVitaminsComponent } from './ingredient/edit/edit-common-vitamins/edit-common-vitamins.component';
import { EditIngredientBasicComponent } from './ingredient/edit/edit-ingredient-basic/edit-ingredient-basic.component';
import { EditIngredientNutritionComponent } from './ingredient/edit/edit-ingredient-nutrition/edit-ingredient-nutrition.component';
import { IngredientConversionFormComponent } from './ingredient/edit/ingredient-conversion-form/ingredient-conversion-form.component';
import { IngredientPricesFormComponent } from './ingredient/edit/ingredient-prices-form/ingredient-prices-form.component';
import { IngredientEditComponent } from './ingredient/ingredient-edit/ingredient-edit.component';
import { IngredientFilterComponent } from './ingredient/ingredient-filter/ingredient-filter.component';
import { IngredientTableComponent } from './ingredient/ingredient-table/ingredient-table.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { RecipeCardComponent } from './recipe/recipe-card/recipe-card.component';
import { RecipeViewComponent } from './recipe/recipe-view/recipe-view.component';
import { SearchBarComponent } from './recipe/search-bar/search-bar.component';
import { SharedComponentModule } from './shared-component.module';
import { ToastComponent } from './toast/toast.component';
import { ToastModule } from './toast/toast.module';

@NgModule({
  imports: [
    CompleteMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    PipesModule,
    SharedComponentModule,
    DigitOnlyModule,
    ToastModule
  ],
  declarations: [
    SearchBarComponent,
    RecipeCardComponent,
    RecipeViewComponent,
    AppHeaderComponent,
    IngredientEditComponent,
    IngredientFilterComponent,
    IconTextComponent,
    IngredientTableComponent,
    IngredientPricesFormComponent,
    IngredientConversionFormComponent,
    PageTitleComponent,
    EditIngredientBasicComponent,
    EditCommonMineralsComponent,
    EditCommonVitaminsComponent,
    EditIngredientNutritionComponent,
    FormAutocompleteDirective,
    MatInputAutoCompleteDirective,
    GraphDoughnutComponent,
    PaginatorComponent
  ],
  exports: [
    SearchBarComponent,
    RecipeCardComponent,
    RecipeViewComponent,
    AppHeaderComponent,
    IngredientEditComponent,
    IngredientFilterComponent,
    IconTextComponent,
    IngredientTableComponent,
    IngredientPricesFormComponent,
    IngredientConversionFormComponent,
    ToastComponent,
    PageTitleComponent,
    PaginatorComponent
  ],
  providers: [NutrientTotalValidator, IngredientEditFormService, ReferenceService]
})
export class ComponentModule {}
