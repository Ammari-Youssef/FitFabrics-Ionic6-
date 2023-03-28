import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/shared/authentification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email!:string;
  password !:string ;
  repassword !:string ;
  lastname !:string ;
  firstname !:string ;
  
  constructor(private authService:AuthentificationService,
    public navCtrl:NavController,) { }

  ngOnInit() {
  }

  checkpwd(){
    
  }
  register(form:NgForm){
    this.password ==this.repassword ? console.log("password confirmation checked"):alert("Error with password confirmation");
    
    if (form.valid && this.password === this.repassword) {
      this.authService.signup(this.email, this.password)
        .then(() => {
          console.log('Registration successful!');
          this.navCtrl.navigateRoot("/hometabs")
        })
        .catch(error => console.error(error));
    }
    
  }
}
