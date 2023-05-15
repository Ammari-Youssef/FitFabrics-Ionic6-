import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { User } from 'src/app/models/User.model';
import { GlobalFunctions } from 'src/app/shared/GlobalFunctions.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  oldPassword!: string;
  newPassword!: string;
  confirmNewPassword!: string;

  constructor(public gbService: GlobalFunctions) {}
  user: any = {
    email: '',
    firstname: '',
    lastname: '',
    age: 0,
    gender: '',
    dateOfBirth: '',
  };
  ngOnInit() {
    this.user = firebase.auth().currentUser;
  }
  async changePassword() {
  
      const user = firebase.auth().currentUser;

      if(user?.email){

        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.oldPassword
        );


        // Re-authenticate the user with their current credentials
        await user
          .reauthenticateWithCredential(credential)
          .then(() => {
            // Change the user's password
            user
              .updatePassword(this.newPassword)
              .then(() => {
                this.gbService.presentAlert('Success','Password successfully updated');
              })
              .catch((error) => {
                this.gbService.presentAlert("Error",'Error updating password:');
              });
          })
          .catch((error) => {
            this.gbService.presentAlert("Error",'Error reauthenticating user:');
          });
      
      }

  }
}
