import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  endpoint = 'http://localhost:8000/api/products';
  constructor(private http: HttpClient) {}

  all(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endpoint);
  }
}
