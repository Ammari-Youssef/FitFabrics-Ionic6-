import { Injectable } from '@angular/core';
// import { Product } from '../models/Product.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public apiUrl = 'https://fakestoreapi.com/products';

  constructor(public http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map((products) =>
          products.filter((product) => product.category !== 'electronics')
        )
      );
  }

  getProductByID(id: number): Observable<Product[]> {
    // return this.http.get<any[]>(this.apiUrl)
    //   .pipe(
    //     map(products => products.filter(product => product.id== id ))
    //   );
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Category[] {
    return [
      {
        id: 'jewelery',
        title: 'jewelery',
        image: '../assets/categories/accessories.jpg',
      },
      {
        id: "men's clothing",
        title: "men's clothing",
        image: '../assets/categories/men-clothing.jpg',
      },
      {
        id: "women's clothing",
        title: "women's clothing",
        image: '../assets/categories/women-clothing.jpg',
      },
    ];
  }

  getCategoryByID(id: string) {
    const ctg = this.getAllCategories();

    return ctg.find((c) => c.id === id);
  }

  getProductsByCategoryId(categoryId: string) {
    const products = this.getAllProducts();

    return products.pipe(
      map((products) =>
        products.filter((product) => product.categoryId === categoryId)
      )
    );
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    if (categoryName != 'all') {
      const url = `${this.apiUrl}/category/${categoryName}`;
      return this.http.get<Product[]>(url);
    } else return this.getAllProducts();
  }
  // getProducts():Product[]{
  //   return [
  //     {
  //       id:1,
  //       name:"",
  //       price:25,
  //       image:"",
  //       description:"",
  //       category:"",
  //       quantity:100
  //     }
  //   ]
  // }
}
