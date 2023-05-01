import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/shared/authentification.service';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  password!: string;
  repassword!: string;

  age!: number;
  lastname!: string;
  firstname!: string;
  email!: string;

  dateOfBirth!: string;
  gender!: string;

  user: User = {
    email: '',
    firstname: '',
    lastname: '',
    age: 0,
    gender: '',
    dateOfBirth: '',
  };

  constructor(
    private authService: AuthentificationService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  calculateAge() {
    if (this.user.dateOfBirth) {
      const birthDate = new Date(this.user.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.user.age = age;
    }
  }

  register(form: NgForm) {
    this.password == this.repassword
      ? console.log('password confirmation checked')
      : alert('Error with password confirmation');

    if (form.valid && this.password === this.repassword) {
      this.authService
        .signup(this.user, this.password)
        .then(() => {
          console.log('Registration successful!');
          this.presentAlert();
          this.navCtrl.navigateRoot('/login');
        })
        .catch((error) => console.error(error));
    }
  }

  //Fonction affichante un message quand l'enregistrement d'utilisateur est reussi
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Registration Successful',
      message: 'You have successfully registered ! Try logging in',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
