import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ProductService } from 'src/app/shared/product.service';

@Component({
  selector: 'app-searchar',
  templateUrl: './searchar.component.html',
  styleUrls: ['./searchar.component.scss'],
})
export class SearcharComponent implements OnInit {
  products$!: Observable<any[]>;
  searchQuery: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  searchProducts(): void {
    if (this.searchQuery.trim()) {
      // if the search query is empty or contains only whitespaces, show all products
      this.products$ = this.productService.getProducts();
      return;
    }

    this.products$ = this.productService
      .getProducts()
      .pipe(
        map((products) =>
          products.filter((product) =>
            product['title'].toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        )
      );
  }

  onSearchInput(event: any): void {
    // wait for 500ms after the user stops typing to reduce unnecessary API calls
    this.searchQuery = event.target.value.trim();
    this.productService
      .getProducts()
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.searchProducts());

      return
  }
}
