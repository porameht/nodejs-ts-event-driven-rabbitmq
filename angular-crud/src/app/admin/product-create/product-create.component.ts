import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  title = '';
  image = '';
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {}

  submit(): void {
    const data = {
      title: this.title,
      image: this.image,
    };
    this.productService.create(data).subscribe(() => {
      this.router.navigate(['/admin/products']);
    });
  }
}
