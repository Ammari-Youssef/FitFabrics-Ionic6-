import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/models/CartItem.model';
import { Product } from 'src/app/models/Product.model';
import { CartService } from 'src/app/shared/cart.service';
import { ProductService } from 'src/app/shared/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  constructor(
    public prodService: ProductService,
    public activatedRoute: ActivatedRoute,
    public cartService: CartService
  ) {}

  products!: any[];
  categoryId!: string;

  ngOnInit() {
    // this.categoryId = this.activatedRoute.snapshot.paramMap.get('id_cat') as string;
    //   // this.prodService.getAllProducts().subscribe((data) => {this.products = data;});
    //    this.prodService.getProductsByCategory(this.categoryId).subscribe( p => {this.products=p});
    //     //  this.prodService.getCategoryByID(id);
  }

  ionViewWillEnter() {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get(
      'id_cat'
    ) as string;
    this.prodService
      .getProductsByCategory(this.categoryId)
      .subscribe((products) => {
        console.log(products);
        this.products = products;
      });
  }


}
