import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@components/app-header/app-header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  imports: [RouterModule, MainRoutingModule, LayoutModule, FooterComponent, AppHeaderComponent],
  declarations: [MainComponent],
  exports: [MainComponent]
})
export class MainModule {}
