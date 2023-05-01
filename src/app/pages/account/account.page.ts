import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/shared/authentification.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

userData: any;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private authService: AuthentificationService,
    private navCtrl: NavController,
    private router:Router,
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .valueChanges()
          .subscribe((userData) => {
            this.userData = userData;
            console.log(this.userData)
          });
      }
    });

  }

  logOut() {
    this.authService.logout().then(() => {
      this.navCtrl.navigateRoot('/login');
    });
  }




}
