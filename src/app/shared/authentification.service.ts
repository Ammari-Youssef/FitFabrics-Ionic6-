import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private afAuth: AngularFireAuth) { }

  // Log in function with email
  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
       await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Sign up function with email
  async signup(email: string, password: string,): Promise<any> {
     try {
    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const user = {
      uid: result.user?.uid,
      email: result.user?.email,
      displayName: result.user?.displayName,
      photoURL: result.user?.photoURL
    };
    return user;
  } catch (error) {
    throw error;
  }
}
//Sign up function using google
async googleSignIn(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await this.afAuth.signInWithPopup(provider);
  }

  //Log out function
  async logout(){

  }
}