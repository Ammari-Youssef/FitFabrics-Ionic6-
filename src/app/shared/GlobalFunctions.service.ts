import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctions {
  constructor(public toastController:ToastController,public alertController:AlertController) {}

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
}
