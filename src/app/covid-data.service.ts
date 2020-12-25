import { Injectable, ɵConsole } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Country } from './country.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CovidDataService {

  country: Country;
  today: Date = new Date();
  oneWeekAgo: Date;

  
  constructor(private firestore: AngularFirestore,
              private httpClient: HttpClient) { 
    this.oneWeekAgo = this.date_by_subtracting_days(this.today, 7);
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
  async getTodayData(): Promise<any>{
    /*
    this.firestore.collection("users").doc(this.user.uid)
          .set({
            uid: this.user.uid,
            displayName: this.user.displayName,
            email: this.user.email
          }, {merge: true});
    */
    const today_string = (new Date()).toISOString().split("T")[0];    
    const countriesSummary = this.firestore.collection("summary").doc(today_string);
    const resp = await countriesSummary.get().toPromise();
    var responseDoc;
  
    if (resp.exists) {
      console.log("Got summary data from firebase");
      responseDoc = resp.get('data'); // access 'data' field
    }
    else{
      responseDoc = null;
    }
    //console.log(responseDoc);
    
    // Update data on server if not present
    if (responseDoc == null) {
      console.log("Got summary data from API");
      
      // 1. Get from API
      const resp = await this.httpClient.get('https://api.covid19api.com/summary').toPromise();
      //console.log(resp);
      
      // 2. Format response
      responseDoc = [];
      responseDoc.push({
        Slug: 'world',
        Country: 'Worldwide',
        NewConfirmed: resp['Global']['NewConfirmed'],
        TotalConfirmed: resp['Global']['TotalConfirmed'],
        NewDeaths: resp['Global']['NewDeaths'],
        TotalDeaths: resp['Global']['TotalDeaths'],
        NewRecovered: resp['Global']['NewRecovered'],
        TotalRecovered: resp['Global']['TotalRecovered']
      })
      for (const country of resp['Countries']) {
        responseDoc.push(country);
      }
      //console.log(responseDoc);
      
      // 3. Load on server
      countriesSummary.set({data: responseDoc}, {merge: true});
    } 
  
      if (this.country.getSlug() == "world"){
        const worldIndex = responseDoc.findIndex((el) => el['Slug'] == this.country.getSlug());
        const worldDoc = responseDoc[worldIndex];
        if (worldIndex > -1) {
          responseDoc.splice(worldIndex, 1);
        }
        //console.log(worldDoc);
        //console.log(responseDoc);
        
        return [worldDoc, responseDoc];
      }
      else{
        const countryIndex = responseDoc.findIndex((el) => el['Slug'] == this.country.getSlug());
        return responseDoc[countryIndex];
      }
    }

  async getWeeklyData(): Promise<JSON>{
    let week_url = "UNDEFINED";
    // If I want to get worldwide data
    if (this.country.getSlug() == "world"){
      week_url = "https://api.covid19api.com/world?from=" + 
                  this.oneWeekAgo.toISOString().split('T')[0] +
                  "T00:00:00Z&to=" +
                  this.today.toISOString().split('T')[0] + 
                  "T00:00:00Z";
    }
    // If I want to get data for a specific country
    else{
      week_url = "https://api.covid19api.com/country/" +
                  this.country.getSlug() + 
                  "?from=" + 
                  this.oneWeekAgo.toISOString().split('T')[0] +
                  "T00:00:00Z&to=" +
                  this.today.toISOString().split('T')[0] + 
                  "T00:00:00Z";
    }
    
    console.log("Weekly data URL: " + week_url);
    const response = await fetch(week_url, { method: "GET" })
    .then(function(response) {
      return response.json();
    });

    return response
  }

  async getDayOneData(): Promise<JSON>{
    let dayone_url = "UNDEFINED";
    // If I want to get worldwide data
    if (this.country.getSlug() == "world"){
      dayone_url = "https://api.covid19api.com/world?from=" + 
                    "2020-01-01" +
                    "T00:00:00Z&to=" +
                    this.today.toISOString().split('T')[0] + 
                    "T00:00:00Z";
    }
    // If I want to get data for a specific country
    else{
      dayone_url = "https://api.covid19api.com/dayone/country/" +
                    this.country.getSlug();
    }
    
    console.log("Dayone data URL: " + dayone_url);
    const response = await fetch(dayone_url, { method: "GET" })
    .then(function(response) {
      return response.json();
    });

    return response
  }

  // subtract days to date
  date_by_subtracting_days(date, days) {
    return new Date(
        date.getFullYear(), 
        date.getMonth(), 
        date.getDate() - days,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );
}

//test
testCountry(name){
  console.log("Country selected: " + name);
  
}  
 
}
