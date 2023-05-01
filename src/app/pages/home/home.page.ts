import { Component, OnInit, Sanitizer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/shared/product.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    public prodService: ProductService,
    public navCtrl: NavController,
    private activeroute: ActivatedRoute,
    public router: Router,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  
  data:any  ; 
  result:any;
  profile: any;
  products: any = [];

  categories: any = [];

  public featuredProducts = [];
  public bestSellProducts = [];

  ngOnInit() {
    //Recherche des produits

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

    //ramener les produits
    this.prodService.getAllProducts().subscribe((data) => {
      this.products = data;
    });

    //Ramener les categories
    this.categories = this.prodService.getAllCategories();

    console.log(this.categories);
    // console.log(this.products);
  }

  goToCategoryPage(categoryId: string) {
    console.log('Category ID:', categoryId);

    // this.navCtrl.navigateForward(`category/${categoryId}`)
    this.router.navigateByUrl(`/category/${categoryId}`);
  }

  

  

 
}
