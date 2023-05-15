import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/User.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GlobalFunctions } from 'src/app/shared/GlobalFunctions.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  password!: string;
  repassword!: string;

  age!: number;
  lastname!: string;
  firstname!: string;
  email!: string;

  dateOfBirth!: string;
  gender!: string;

  myUser: User = {
    email: '',
    firstname: '',
    lastname: '',
    age: 0,
    gender: '',
    dateOfBirth: '',
  };

  constructor(
    private gbService: GlobalFunctions,
    public navCtrl: NavController,
    public alertController: AlertController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public router: Router,
    private storage: AngularFirestore
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .subscribe((doc) => {
            const userData: any = doc.data();
            [this.myUser.firstname, this.myUser.lastname] = userData.username
              .toString()
              .split(' ');
            this.myUser.email = userData.email;
            this.myUser.age = userData.age;
            this.myUser.dateOfBirth = userData.dateOfBirth;
            this.myUser.photoUrl = userData.photoUrl;
          });
      }
    });
  }

  calculateAge() {
    if (this.myUser.dateOfBirth) {
      const birthDate = new Date(this.myUser.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.myUser.age = age;
    }
  }

  edit(frm: NgForm) {
    // Validate the input
    if (
      !this.myUser.firstname ||
      !this.myUser.lastname ||
      !this.myUser.email ||
      !this.myUser.dateOfBirth
    ) {
    }

    // Update the user data in Firestore
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc(user.uid)
          .update({
            username: this.myUser.firstname + ' ' + this.myUser.lastname,
            dateOfBirth: this.myUser.dateOfBirth,
            age: this.myUser.age,
            photoUrl: this.myUser.photoUrl,
          })
          .then(() => {
            this.gbService.presentAlert(
              'User Info updated successfully !',
              'Success'
            );
            this.router.navigate(['/hometabs/aboutme']);
          })
          .catch((error) => {
            this.gbService.presentAlert(
              'Error updating user profile: try again later',
              'Somthing went wrong'
            );
          });
      }
    });
  }

  async confirmEditAccount(frm: NgForm) {
    const alert = await this.alertController.create({
      header: 'Modify User Account',
      message: 'Do you want to update these data to your account ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.edit(frm);
          },
        },
      ],
    });

    await alert.present();
  }
}
