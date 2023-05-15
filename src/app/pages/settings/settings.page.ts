import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    private alertController: AlertController,
  
    private router:Router,
  ) {}

  ngOnInit() {}

  //TODO:
  async deleteAccount() {
    const userId = firebase.auth().currentUser?.uid;
    if (userId) {
      // Delete user from Firebase Authentication
      firebase
        .auth()
        .currentUser?.delete()
        .then(() => {

          // Delete user data from Firestore
          firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .delete()
            .then(() => {
              console.log('User data deleted from Firestore');
            })
            .catch((error) => {
              console.error('Error deleting user data from Firestore:', error);
            });
        })
        .catch((error) => {
          console.error(
            'Error deleting user from Firebase Authentication:',
            error
          );
        });

        this.presentAlert("Account deleted successfully !")
       this.router.navigate(['/login'])
    }
  }

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Warning: Delete Account',
      message: 'Are you sure you want to delete your account ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-no',
        },
        {
          text: 'Delete',
          cssClass: 'alert-button-yes',
          handler: () => {
            this.deleteAccount();
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(msg: string, head?: string) {
    const alert = await this.alertController.create({
      header: head ? head : 'Message',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
