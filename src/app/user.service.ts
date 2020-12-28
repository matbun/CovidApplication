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

  user: User;

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router) { }

  // Signin method
  async signInWithGoogle(){
    // Auth with google 
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

    // Look for user data on firestore db
    const userDoc = await this.firestore.collection("users").doc(credentials.user.uid).get().toPromise();
    if (userDoc.exists) {
      this.user = {
        uid: userDoc.get("uid"),
        displayName: userDoc.get("displayName"),
        email: userDoc.get("email"),
        admin: userDoc.get("admin"),
        countriesNewsEditor: userDoc.get("countriesNewsEditor")
      }
    }
    else{
      this.user = {
        uid: credentials.user.uid,
        displayName: credentials.user.displayName,
        email: credentials.user.email,
        admin: false,
        countriesNewsEditor: []
      }
    }

    // Save user info in browser local storage
    localStorage.setItem("user", JSON.stringify(this.user));

    // Update user data in db
    this.updateUserData();
  }

  // Update user data in the firestore db
  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid)
          .set(this.user, {merge: true});
  }

  // Update user information for a specific user
  updateUser(user: User){
    this.firestore.collection("users").doc(user.uid)
          .set(user, {merge: true});
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
