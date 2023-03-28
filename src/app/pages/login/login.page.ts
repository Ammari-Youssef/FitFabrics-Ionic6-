import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { RegisterPage } from '../register/register.page';

import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthentificationService } from 'src/app/shared/authentification.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email!:string;
  password!:string;

  constructor( public navCtrl:NavController,
    private router :Router ,
    private authService : AuthentificationService,
    private userService: UserService) { }

  ngOnInit() {
  }

  //Login using form
  login(form:NgForm){
     if (form.valid) {
      this.authService.login(this.email, this.password).then(() => {
        this.navCtrl.navigateRoot('/hometabs');
        this.userService.createUser(this.email)
        console.log("Logged in successfully")
      }).catch((error) => {
        console.log('Error logging in', error);
      });
    }else{
      alert("Form is invalid");
    }
  }

//Google Sign in function
async onGoogleSignIn(): Promise<void> {
  try {
    await this.authService.googleSignIn();
    
    // Google sign-in successful, navigate to next page
    this.navCtrl.navigateRoot("/hometabs")
  } catch (error) {
    console.log(error);
    // Handle error
  }
}

//change view
  goSignUp(){
     this.navCtrl.navigateForward("/register")
  }

}
