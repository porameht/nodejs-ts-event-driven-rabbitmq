import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './products/products.component';
import { RouterModule } from '@angular/router';
import { ProductCreateComponent } from './product-create/product-create.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavComponent,
    MenuComponent,
    AdminComponent,
    ProductsComponent,
    ProductCreateComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminModule {}
