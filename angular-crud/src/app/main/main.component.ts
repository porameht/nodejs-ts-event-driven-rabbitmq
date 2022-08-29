import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  products: any[] = [];
  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.mainService.all().subscribe((products) => (this.products = products));
  }
}
