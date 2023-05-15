import { Component, OnInit, Sanitizer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/shared/product.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from 'src/app/models/Product.model';

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

  data: any;
  result: any;
  profile: any;
  products: any = [];
  featured_products: any = [];
  best_selling_products : any=[]

  filteredProducts: Product[] = []; //Pour la recherche
  categories: any = []; //Les categories

  public _p= [];
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
    // this.prodService.getAllApiProducts().subscribe((data) => {
    //   this.products = data;
    //    this.filteredProducts = data;
     
    // });
    
   this.prodService.getProducts().subscribe((products) => {
     this.products = products;
     console.log("prods :" ,this.products)
   });
    //Ramener les produits speciaux
    
    this.prodService.getFeaturedProducts().subscribe((data) => {
      this.featured_products = data;
      console.log("Featured prods :" ,this.featured_products)
      //  this.filteredProducts = data;
     
    });
    this.prodService.getBestSellingProducts().subscribe((data) => {
     this.best_selling_products = data;
      //  this.filteredProducts = data;
     
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

  //Recherche d'un produit par le nom
  onSearch(searchTerm: string) {
    if (searchTerm) {
      this.filteredProducts = this.products.filter((product:any) =>
      {
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
         console.log(this.filteredProducts);
      }
      );
    } else {
      
    }
  }
}
