import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../models/Product.model';
import { ActivatedRoute } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { CartService } from 'src/app/shared/cart.service';
import { CartItem } from 'src/app/models/CartItem.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  selectedSize!: number;
  selectedColor!: number;
  activeVariation!: string;
  //Produit recuperation
  productId!: any;
  produit!: any;
  //Couleur et taille choisis
  color!: string;
  size!: string;
  //

  constructor(
    private prodService: ProductService,
    private activatedRoute: ActivatedRoute,
    private animatioCntrl: AnimationController,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id_prod');

    this.prodService.getProductByID(this.productId).subscribe((product) => {
      this.produit = product;

      console.log(this.produit);
    });

    //animation
    this.activeVariation = 'size';
  }

  segmentChanged(e: any) {
    this.activeVariation = e.detail.value;

    const sizesElement = document.querySelector('.sizes');
    const colorElement = document.querySelector('.colors');
    if (sizesElement && colorElement) {
      if (this.activeVariation == 'color') {
        this.animatioCntrl
          .create()
          .addElement(sizesElement)
          .duration(500)
          .iterations(1)
          .fromTo('transform', 'translateX(0px)', 'translateX(100%)')
          .fromTo('opacity', '1', '0.2')
          .play();

        this.animatioCntrl
          .create()
          .addElement(colorElement)
          .duration(500)
          .iterations(1)
          .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
          .fromTo('opacity', '0.2', '1')
          .play();
      } else {
        this.animatioCntrl
          .create()
          .addElement(sizesElement)
          .duration(500)
          .iterations(1)
          .fromTo('transform', 'translateX(100%)', 'translateX(0)')
          .fromTo('opacity', '0.2', '1')
          .play();

        this.animatioCntrl
          .create()
          .addElement(colorElement)
          .duration(500)
          .iterations(1)
          .fromTo('transform', 'translateX(0px)', 'translateX(-100%)')
          .fromTo('opacity', '1', '0.2')
          .play();
      }
    }
  }

  changeSize(size: any) {
    this.selectedSize = size;

    switch (size) {
      case 1:
        this.size = 'S';

        break;
      case 2:
        this.size = 'M';

        break;
      case 3:
        this.size = 'L';

        break;
      case 4:
        this.size = 'XL';

        break;
    }
  }

  changeColor(color: any) {
    this.selectedColor = color;

    switch (color) {
      case 1:
        this.color = 'Black';

        break;
      case 2:
        this.color = 'Green';

        break;
      case 3:
        this.color = 'Blue';

        break;
    }
  }

  addToCart() {
    if (this.produit.category != 'jewelery' && (!this.color || !this.size))
    
    this.cartService.showToast('Choose size and color before adding it to your cart');

    // create cart item object with all the necessary properties
  else  if (this.produit.category == 'jewelery' ) {
      const item: CartItem = {
        id: this.produit.id,
        product: this.produit,
        quantity: 1,
        size: 'no size',
        color: 'no color',
        timestamp: new Date(),
      };

      // add item to cart
      this.cartService.addToCart(item);
    } else {
      const item: CartItem = {
        id: this.produit.id,
        product: this.produit,
        quantity: 1,
        size: this.size,
        color: this.color,
        timestamp: new Date(),
      };
      this.produit.quantity = 1;

      // add item to cart
      this.cartService.addToCart(item);
    }
  }
}
