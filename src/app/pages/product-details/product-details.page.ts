import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../models/Product.model';
import { ActivatedRoute } from '@angular/router';
import { AnimationController } from '@ionic/angular';

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
  constructor(
    private prodService: ProductService,
    private activatedRoute: ActivatedRoute,
    private animatioCntrl: AnimationController
  ) {}

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id_prod');

    this.prodService.getProductByID(this.productId).subscribe((product) => {
      this.produit = product;
      
      console.log('product : ' + this.produit);
    });

    //animation
    this.activeVariation = 'size';
  }

  addToCart() {}

  segmentChanged(e: any) {
    this.activeVariation = e.detail.value;

const sizesElement = document.querySelector('.sizes');
const colorElement = document.querySelector('.colors')
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

  changeSize(size: number) {
    this.selectedSize = size;
  }

  changeColor(color: number) {
    this.selectedColor = color;
  }
}
