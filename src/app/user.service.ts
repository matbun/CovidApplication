import { Injectable } from '@angular/core';

// added by me
import firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from "./user.module";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router) { }

  // Signin method
  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
      uid: credentials.user.uid,
      displayName: credentials.user.displayName,
      email: credentials.user.email
    };

    // Save user info in browser local storage
    localStorage.setItem("user", JSON.stringify(this.user));

    // Update user data in db
    this.updateUserData();
  }

  // Update user data in the firestore db
  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid)
          .set({
            uid: this.user.uid,
            displayName: this.user.displayName,
            email: this.user.email
          }, {merge: true});
  }

  // Method used by components, in order to get user data
  getUser(){
    return JSON.parse(localStorage.getItem("user"));
  }

  isUserSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  signOut(){
    this.afAuth.signOut();
    this.user = null;
    localStorage.removeItem("user");
    this.router.navigate(["home-page"]);
  }
}
