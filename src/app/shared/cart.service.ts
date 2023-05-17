import { Injectable, OnInit } from '@angular/core';
//FireBase
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
//Les components sepeciales
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
//Srvices
import { AuthentificationService } from './authentification.service';
//Models
import { Product } from '../models/Product.model';
import { CartItem } from '../models/CartItem.model';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private userId!: string;
  profile!: any;
  private cartItems = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  cartCollection: AngularFirestoreCollection;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthentificationService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    // this.authService.getCurrentUser().then((user) => {
    //   this.userId = user ? user.uid : 'NullUser';
    // });
    afAuth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        console.log('Current user ID:', this.userId);
      }
    });
    this.cartCollection = this.firestore.collection<CartItem>('carts');
  }

  getCartItems(): Observable<CartItem[]> {
    return this.firestore
      .collection<CartItem>('cart', (ref) =>
        ref.where('userId', '==', this.userId)
      )
      .valueChanges({ idField: 'id' });
  }

  // SaveCartItem(item: CartItem): void {
  //   //check if product exists

  //   //Add if()
  //   this.firestore
  //     .collection('carts')
  //     .doc(`${this.userId}`) //_${item.product.id}`)
  //     .set({
  //       // userId: this.userId,
  //       color: item.color,
  //       size: item.size,
  //       product: item.product,
  //       quantity: item.product.quantity,
  //       timestamp: new Date(),
  //     })
  //     .then(() =>
  //       this.firestore
  //         .collection('products')
  //         .doc(item.product.id)
  //         .update({
  //           stock: firebase.firestore.FieldValue.increment(
  //             -item.product.quantity
  //           ), //decrementer le stock
  //         })
  //         .then(() => this.presentAlert('success', 'suss'))
  //         .catch(() => this.presentAlert('Error', 'error'))
  //     );
  // }

  DeleteFromCart(itemId: string): void {
    this.firestore.collection('carts').doc(itemId).delete();
  }

  public addToCart(item: CartItem) {
    if (item.product.stock === 0) {
      this.presentAlert('Sold Out', 'Sorry, this item is sold out.');
      return;
    }
    let items = this.cartItems.getValue();
    let index = items.findIndex(
      (x) => x.id === item.id && x.color === item.color && x.size === item.size
    );
    if (index === -1) {
      items.push(item);
      this.showToast('Item has been added to cart');
    } else {
      items[index].quantity += item.product.quantity;
      this.showToast('Quantity of item has been incremented');
    }
    this.cartItems.next(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
    console.log(items);
  }

  public removeFromCart(item: CartItem) {
    let items = this.cartItems.getValue();
    let index = items.findIndex(
      (x) => x.id === item.id && x.color === item.color && x.size === item.size
    );

    items.splice(index, 1);
    this.showToast('Item has been removed from cart');

    this.cartItems.next(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
    console.log(items);
  }

  SaveCartItem2(item: CartItem): void {
    const cartRef = this.firestore.collection('carts').doc(`${this.userId}`);

    cartRef
      .get()
      .toPromise()
      .then((docSnapshot) => {
        const cartData = docSnapshot?.data() as any;
        if (Array.isArray(cartData?.product)) {
          const existingItemIndex = cartData.product.findIndex(
            (p: Product, ci: CartItem) =>
              p.id === item.product.id &&
              ci.color === item.color &&
              ci.size === item.size
          );
          if (existingItemIndex !== -1) {
            // Item already exists in cart, update quantity
            const existingItem = cartData.product[existingItemIndex];
            cartData.product[existingItemIndex] = {
              ...existingItem,
              quantity: existingItem.product.quantity + item.product.quantity,
              stock: firebase.firestore.FieldValue.increment(
                -item.product.quantity
              ),
            };
          } else {
            const newItem = {
              product: item.product,
              quantity: item.product.quantity,
              size: item.size,
              color: item.color,
            };
            // Item does not exist in cart, add new item
            cartData.product.push(newItem);
          }
          // Update cart in Firestore
          cartRef.set({
            userId: this.userId,
            product: cartData.product,
            // quantity: item.quantity,
            size: item.size,
            color: item.color,
            timestamp: new Date(),
          });
        } else {
          // Cart does not exist yet, create new cart with item
          cartRef.set({
            userId: this.userId,
            product: item.product,
            // quantity: item.quantity,
            size: item.size,
            color: item.color,
            timestamp: new Date(),
          });
        }

        // Update product stock in Firestore
        this.firestore
          .collection('products')
          .doc(item.product.id)
          .update({
            stock: firebase.firestore.FieldValue.increment(
              -item.product.quantity
            ),
          });

        console.log('userid ' + this.userId);
        this.presentAlert('Checkout Success', 'Products items saved in cart');
      });
  }

  

  //Notifications de system
  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
    });
    toast.present();
  }
  async presentAlert(h: string, msg: string) {
    const alert = await this.alertController.create({
      header: h,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // async SaveCartItem5(item: CartItem) {
  //   const cartRef: AngularFirestoreDocument<any> = this.firestore
  //     .collection('carts')
  //     .doc(this.userId);
  //   const cartDocRef = cartRef.ref;

  //   await firebase
  //     .firestore()
  //     .runTransaction(async (transaction) => {
  //       const cartDoc = await transaction.get(cartDocRef);

  //       // Check if the product already exists in the cart
  //       const existingCartItemIndex = cartDoc
  //         .data()
  //         ?.items?.findIndex((it: any) => {
  //           return (
  //             item.product === it.product &&
  //             item.color === it.color &&
  //             item.size === it.size
  //           );
  //         });

  //       if (existingCartItemIndex !== -1) {
  //         // If the product exists in the cart, update its quantity
  //         const existingCartItem = cartDoc.data()?.items[existingCartItemIndex];
  //         if (existingCartItem) {
  //           transaction.update(cartDocRef, {
  //             ['items.' + existingCartItemIndex + '.quantity']:
  //               item.product.quantity,
  //           });
  //         }
  //       } else {
  //         // If the product doesn't exist in the cart, add it as a new item
  //         transaction.set(
  //           cartDocRef,
  //           {
  //             items: firebase.firestore.FieldValue.arrayUnion(item),
  //           },
  //           { merge: true }
  //         ); // Use merge option to update only the items array
  //       }

  //       this.firestore
  //         .collection('products')
  //         .doc(item.product.id)
  //         .update({
  //           stock: firebase.firestore.FieldValue.increment(
  //             -item.product.quantity
  //           ),
  //         });
  //     })
  //     .then(() => this.presentAlert('success', 'yay'))
  //     .catch(() => this.presentAlert('', 'yay'));
  // }

  async SaveCartItem7(item: CartItem) {
    const cartRef: AngularFirestoreDocument<any> = this.firestore
      .collection('carts')
      .doc(this.userId);
    const cartDocRef = cartRef.ref;

    await firebase.firestore().runTransaction(async (transaction) => {
      const cartDoc = await transaction.get(cartDocRef);

      // Check if the product already exists in the cart
      const existingCartItems = cartDoc.data()?.items || [];

      const existingCartItemIndex = existingCartItems.findIndex((it: any) => {
        return (
          item.product.id === it.product.id &&
          item.color === it.color &&
          item.size === it.size
        );
      });

      if (existingCartItemIndex !== -1) {
        // If the product exists in the cart, update its quantity
        const existingCartItem = existingCartItems[existingCartItemIndex];
        if (existingCartItem) {
          existingCartItem.quantity += item.product.quantity;
        }
      } else {
        // If the product doesn't exist in the cart, add it as a new item
        existingCartItems.push(item);
      }

      transaction.set(cartDocRef, {
        items: existingCartItems,
      });

      this.firestore
        .collection('products')
        .doc(item.product.id)
        .update({
          stock: firebase.firestore.FieldValue.increment(
            -item.product.quantity
          ),
        }).then(()=> this.presentAlert("Checkout Succeeded","Items has been saved "))
        .catch(()=> this.presentAlert("Checkout Failed","Something went wrong "));
    });
  }
}