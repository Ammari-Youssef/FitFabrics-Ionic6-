import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  // createUser(userId: string, user: any) {
  //   return this.afs.collection('users').doc(userId).set(user);
  // }
//   createUser(user: any) {
//   return this.afs.collection('users').add(user);
// }

  getUser(userId: string) {
    return this.afs.collection('users').doc(userId).valueChanges();
  }

  updateUser(userId: string, user: any) {
    return this.afs.collection('users').doc(userId).update(user);
  }

  deleteUser(userId: string) {
    return this.afs.collection('users').doc(userId).delete();
  }
}
