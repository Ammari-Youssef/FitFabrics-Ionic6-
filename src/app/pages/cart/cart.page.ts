import { Component, OnInit } from '@angular/core';

import {Product} from 'src/app/models/Product.model'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cartItems:Product[]=[
    {
    id: 1,
    name: 'Product 1',
    description:"desc",
    price: 9.99,
    quantity: 2,
    image: '../../assets/images/1.jpg'
  },
  {
    id: 2,
    name: 'Product 2',
    description:"desc",
    price: 19.99,
    quantity: 1,
    image: '../../assets/images/1.jpg'
  },
  ];
  constructor() { }

  ngOnInit() {
  }

  removeFromCart(item:Product){}
  getTotalPrice():number{return 5;}
  checkout(){}
 updateCartItem(item:Product){}
}
