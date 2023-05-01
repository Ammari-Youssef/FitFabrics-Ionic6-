import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';

import {Product} from 'src/app/models/Product.model'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  
  profile: any;
  cartItems: any[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'desc',
      price: 9.99,
      category: 'men',
      quantity: 2,
      image: '../../assets/images/1.jpg',
    },
    {
      category: 'men',
      id: 2,
      title: 'Product 2',
      description: 'desc',
      price: 19.99,
      quantity: 1,
      image: '../../assets/images/1.jpg',
    },
  ];
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    //Ramener la photo du profil de l'utilisateur
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .valueChanges()
          .subscribe((userData) => {
            this.profile = userData;
          });
      }
    });
  }

  removeFromCart(item: Product) {}
  getTotalPrice(): number {
    return 5;
  }
  checkout() {}
  updateCartItem(item: Product) {}
}
