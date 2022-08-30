import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  endpoint = 'http://localhost:8001/api/products';
  constructor(private http: HttpClient) {}

  all(): Observable<Product[]> {
    return this.http.get<Product[]>(this.endpoint);
  }

  like(id: number): Observable<Product> {
    return this.http.post<Product>(`${this.endpoint}/${id}/like`, {});
  }
}
