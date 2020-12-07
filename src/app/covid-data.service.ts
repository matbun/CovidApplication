import { Injectable, ɵConsole } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Country } from './country.module';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {

  country: Country;
  
  constructor(private firestore: AngularFirestore) { }

  // Add informaiton about data visualization
  setCovidCountry(country: string, code: number){
    this.country = new Country(country, code);
    localStorage.setItem("country", JSON.stringify(this.country));
  }

  getCovidCountry(): Country{
    return JSON.parse(localStorage.getItem("country"));
  }

  // Check if there are info about which data visualize 
  isCovidCountryPresent(): boolean{
    return JSON.parse(localStorage.getItem("country")) != null;
  }

  // get data from api/db
  async getTodayData(): Promise<JSON>{
    /*
    this.firestore.collection("users").doc(this.user.uid)
          .set({
            uid: this.user.uid,
            displayName: this.user.displayName,
            email: this.user.email
          }, {merge: true});
    */
    const response = await fetch('https://api.covid19api.com/summary', { method: "GET" })
      .then(function(response) {
        return response.json();
      });
    
      if (this.country.getName() == "Worldwide"){
        return response['Global'];
      }
      else{
        return response['Countries'][this.country.getCode()];
      }
    }

  
 
}
