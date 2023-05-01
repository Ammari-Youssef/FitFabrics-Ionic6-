import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  currentUser: User | null = null;
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  // Log in function with email
  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = result.user;
      if (user)
        await firebase
          .auth()
          // .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Sign up function with email
  async signup(user: User, password: string): Promise<any> {
    try {
      // Check if the email already exists
      const methods = await this.afAuth.fetchSignInMethodsForEmail(user.email);
      if (methods && methods.length > 0) {
        console.log('Email already exists');
        return;
      }
      const result = await this.afAuth.createUserWithEmailAndPassword(
        user.email,
        password
      );
      const firebaseUser = result.user;

      const userData = {
        email: user.email,
        username: user.firstname + ' ' + user.lastname,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        age: user.age,
        photoUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      };

      if (firebaseUser) {
        await this.firestore
          .collection('users')
          .doc(firebaseUser.uid)
          .set(userData);
      } else {
        console.log('User is null');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async registerUser(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    gender: string,
    dateOfBirth: string,
    age: number
  ) {
    try {
      // Check if the email already exists
      const methods = await this.afAuth.fetchSignInMethodsForEmail(email);
      if (methods && methods.length > 0) {
        console.log('Email already exists');
        return;
      }

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      const username = firstname + ' ' + lastname;
      const photoUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';

      //les données à sauvegarder
      const userData = { username, email, photoUrl, gender, dateOfBirth, age };
      if (user)
        await this.firestore.collection('users').doc(user.uid).set(userData);
      else console.log('Invalid user');
    } catch (error) {
      console.log(error);
    }
  }

  //Sign up function using google
  async googleSignIn(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const user = credential.user;

    // Save user's information to Firestore
    if (user) {
      this.firestore.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
      });
    }
  }

  //Log out function
  async logout() {
    this.afAuth.signOut();
  }
  isLoggedIn() {
    return !!this.afAuth.currentUser;
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      // Successful login logic
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') {
        console.log('Login popup was closed by the user');
      } else {
        console.error(e);
      }
    }
  }
}//Fin auth service