import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthentificationService } from 'src/app/shared/authentification.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email!: string;
  password!: string;
  loginError: boolean = false;
  isLoggingIn!: boolean;

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private authService: AuthentificationService,
    private afAuth:AngularFireAuth,
  ) {}

  ngOnInit() {}

  // ionViewWillEnter() {

  //   let isLogged= this.afAuth.currentUser
  //   if (this.authService.isLoggedIn()) {

  //     this.router.navigate(['hometabs/home']);
  //   }
  //   else{
  //     this.router.navigate(['login']);
  //   }
  // }

  //Login using form
  login(form: NgForm) {
    if (form.valid) {
      this.isLoggingIn = true;
      console.log('isLoggingIn', this.isLoggingIn);

      this.authService
        .login(this.email, this.password)
        .then(() => {
          this.isLoggingIn = false;
          console.log('isLoggingIn', this.isLoggingIn);

          this.navCtrl.navigateRoot('/hometabs/home');
          // this.userService.createUser(this.email);
          console.log('Logged in successfully');
          this.loginError = false;
          console.log('loginError', this.loginError);
        })
        .catch((error) => {
          this.isLoggingIn = false;
          console.log('isLoggingIn', this.isLoggingIn);

          console.log('Error logging in', error);
          this.loginError = true;
          console.log('loginError', this.loginError);
        });
    } else {
      alert('Form is invalid');
    }
  }

  //Google Sign in function
  async onGoogleSignIn(): Promise<void> {
    try {
      await this.authService.googleSignIn();
      this.isLoggingIn = true;
      // Google sign-in successful, navigate to next page
      this.navCtrl.navigateRoot('/hometabs/home');
    } catch (error) {
      console.log(error);
      // Handle error
    }
  }

  //change view
  goSignUp() {
    this.navCtrl.navigateForward('/register');
  }
}
