import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CartItem } from 'src/app/models/CartItem.model';


import { CartService } from 'src/app/shared/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  profile: any;
  totalPrice: number =0
  cartItems: CartItem[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private cartService: CartService
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
    //Ramenez les items du panier
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }
  
  //Mise à jour du montant total 
  ionViewWillEnter(){
   this.calculateTotalPrice();

 }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item);
    this.calculateTotalPrice()
    
  }
 
  checkout() {
    if(this.cartItems.length)
    for (let i of this.cartItems) this.cartService.SaveCartItem2(i);

    else this.cartService.showToast("No items to checkout !")
  }

  

  increaseQuantity(item: CartItem) {
    item.product.quantity++;
    this.calculateTotalPrice()
  }

  decreaseQuantity(item: CartItem) {
    if (item.product.quantity > 1) {
      item.product.quantity--;
      this.calculateTotalPrice();
    } else {
      item.product.quantity = 1;
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.product.quantity;
    }, 0);

  }
}
