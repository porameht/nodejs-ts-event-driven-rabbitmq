import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavComponent,
    MenuComponent,
    AdminComponent,
    ProductsComponent,
  ],
  imports: [CommonModule, RouterModule],
})
export class AdminModule {}
