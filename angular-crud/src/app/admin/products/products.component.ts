import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.all().subscribe((products) => {
      this.products = products;
    });
  }

  

  delete(id: number): void {
    if (confirm('Are you should you want to delete this prodcut?')) {
      this.productService.delete(id).subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
    }
  }
}
