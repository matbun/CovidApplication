import { Injectable, ɵConsole } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Country } from './country.module';

@Injectable({
  providedIn: 'root'
})

export class CovidDataService {

  country: Country;
  today: Date = new Date();
  oneWeekAgo: Date = new Date();

  
  constructor(private firestore: AngularFirestore) { 
    // 8 giorni, così posso sottrarre e beccare la variazione giornaliera
    this.oneWeekAgo.setDate(this.today.getDate() - 8);
  }

  // Add informaiton about data visualization
  setCovidCountry(country: string, slug: string, code: number){
    this.country = new Country(country, slug, code);
    localStorage.setItem("country", JSON.stringify(this.country));
  }

  getCovidCountry(): Country{
    var c: Country = JSON.parse(localStorage.getItem("country"));
    return new Country(c.name, c.slug, c.code);
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
    
      if (this.country.getSlug() == "world"){
        return response['Global'];
      }
      else{
        return response['Countries'][this.country.getCode()];
      }
    }

  

  async getWeeklyData(): Promise<JSON>{
       /*
    this.firestore.collection("users").doc(this.user.uid)
          .set({
            uid: this.user.uid,
            displayName: this.user.displayName,
            email: this.user.email
          }, {merge: true});
    */

    // If I want to get worldwide data
    if (this.country.getSlug() == "world"){
      const URL = "https://api.covid19api.com/world?from=" + 
                  this.oneWeekAgo.toISOString().split('T')[0] +
                  "T00:00:00Z&to=" +
                  this.today.toISOString().split('T')[0] + 
                  "T00:00:00Z";
      console.log(URL);
      const response = await fetch(URL, { method: "GET" })
      .then(function(response) {
        return response.json();
      });

      return response
    }

    // If I want to get data for a specific country
    const URL = "https://api.covid19api.com/country/" +
                this.country.getSlug() + 
                "?from=" + 
                this.oneWeekAgo.toISOString().split('T')[0] +
                "T00:00:00Z&to=" +
                this.today.toISOString().split('T')[0] + 
                "T00:00:00Z";
    //console.log(URL);
    const response = await fetch(URL, { method: "GET" })
    .then(function(response) {
      return response.json();
    });

    return response
  }

  
 
}
