import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { IconTextComponent } from '@components/icon-text/icon-text.component';
import { LoadingIndicatorComponent } from '@components/loading-indicator/loading-indicator.component';
import { PageTitleComponent } from '@components/page-title/page-title.component';
import { SafeHtmlPipe } from '@pipes/safe-html.pipe';
import { SentenceCasePipe } from '@pipes/sentence-case.pipe';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { RecipesComponent } from './recipes.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { ReadMoreComponent } from '@components/read-more/read-more.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    RecipeRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSliderModule,
    MatTabsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatToolbarModule,
    PageTitleComponent,
    LoadingIndicatorComponent,
    SafeHtmlPipe,
    SentenceCasePipe,
    IconTextComponent,
    ReadMoreComponent
  ],
  declarations: [SearchBarComponent, RecipeCardComponent, RecipeViewComponent, RecipesComponent],
  exports: [RecipesComponent]
})
export class RecipesModule {}
