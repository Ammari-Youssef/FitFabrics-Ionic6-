import { Injectable } from '@angular/core';
// import { Product } from '../models/Product.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public apiUrl = 'https://fakestoreapi.com/products';
  productsCollection!: AngularFirestoreCollection;


  private FeaturedCollection: AngularFirestoreCollection<Product>;
  Featureditems: Observable<Product[]>;
  
  private BestSellCollection: AngularFirestoreCollection<Product>;
  BestSellitems: Observable<Product[]>;

  constructor(public http: HttpClient, public firestore: AngularFirestore) {
  //All products
    this.productsCollection = this.firestore.collection('products');
//Best Selling products
     this.BestSellCollection = this.firestore.collection(
       'products',
       (ref) => {
         return ref.where('isBestSell', '==', true);
       }
     );
     this.BestSellitems = this.BestSellCollection.valueChanges({
       idField: 'id',
     });

     this.FeaturedCollection = this.firestore.collection<Product>(
       'products',
       (ref) => {
         return ref.where('isFeatured', '==', true);
       }
     );
     this.Featureditems = this.FeaturedCollection.valueChanges({
       idField: 'id',
     });
  }

  //Fonction qui utilise un api qu'on a utiliser pour stocker les produits en firebase
  getAllAPIProducts(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        map((products) =>
          products.filter((product) => product.category !== 'electronics')
        )
      );
  }

  getProducts() {
    return this.productsCollection.valueChanges({ idField: 'id' });
  }

  getFeaturedProducts(): Observable<any[]> {
    return this.Featureditems
  }
  getBestSellingProducts(): Observable<any[]> {
return this.BestSellitems
  }

  getProductByID(id: string): Observable<any> {
    // return this.http.get<any[]>(this.apiUrl)
    //   .pipe(
    //     map(products => products.filter(product => product.id== id ))
    //   );
    // return this.http.get<any>(`${this.apiUrl}/${id}`);
    return this.firestore
      .collection('products')
      .doc(id)
      .valueChanges({ idField: 'id' });
  }

  getAllCategories(): Category[] {
    return [
      {
        id: 'jewelery',
        title: 'jewelery',
        image: '../assets/categories/accessories.jpg',
      },
      {
        id: 'men clothing',
        title: "men's clothing",
        image: '../assets/categories/men-clothing.jpg',
      },
      {
        id: 'women clothing',
        title: "women's clothing",
        image: '../assets/categories/women-clothing.jpg',
      },
    ];
  }

  getAPIProductsByCategoryId(categoryId: string) {
    const products = this.getAllAPIProducts();

    return products.pipe(
      map((products) =>
        products.filter((product) => product.categoryId === categoryId)
      )
    );
  }

  getProductsByCategory(categoryName: string): Observable<any[]> {
    if (categoryName == 'All products') {
      // const url = `${this.apiUrl}/category/${categoryName}`;
      // return this.http.get<Product[]>(url);
      return this.productsCollection.valueChanges({ idField: 'id' });
    }
    if (categoryName == 'Featured products') {
    
    return this.productsCollection
      .valueChanges({ idField: 'id' })
      .pipe(
        map((products) =>
          products.filter((product) => product['isFeatured'] === true)
        )
      );
    }
    if (categoryName == 'Best selling products') {
     
    return this.productsCollection
      .valueChanges({ idField: 'id' })
      .pipe(
        map((products) =>
          products.filter((product) => product['isBestSell'] === true)
        )
      );
    }
    // else return this.getAllProducts();
    else {
      return this.productsCollection
        .valueChanges({ idField: 'id' })
        .pipe(
          map((products) =>
            products.filter((product) => product['category'] === categoryName)
          )
        );
    }
  }
}
