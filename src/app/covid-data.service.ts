import { Injectable, ɵConsole } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Country } from './country.module';
import { HttpClient } from '@angular/common/http';
import { News } from './news.module';
import { Observable } from 'rxjs';

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
    this.country = this.getCovidCountry();
    /*
    this.firestore.collection("users").doc(this.user.uid)
          .set({
            uid: this.user.uid,
            displayName: this.user.displayName,
            email: this.user.email
          }, {merge: true});
    */
    const today_string = (new Date()).toISOString().split("T")[0];    
    
    // AVOID READ FROM SERVER
    /*
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
    */

    // PATCH STARTS HERE
    var responseDoc;
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

    //PATCH ENDS HERE
  
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

  async getWeeklyData(){
    this.country = this.getCovidCountry();

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
    

    //const response = await this.httpClient.get(week_url).toPromise();

    return response;
  }

  async getDayOneData(){
    this.country = this.getCovidCountry();

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
    
    //const response = await this.httpClient.get(dayone_url).toPromise();

    return response
  }

  getNews(){
    this.country = this.getCovidCountry();
    return this.firestore.collection("news").doc(this.country.getSlug())
    .collection("country_news", ref => ref.orderBy('date', 'desc')).valueChanges();
  }

  addNews(news: News){
    this.country = this.getCovidCountry();
    this.firestore.collection("news").doc(this.country.getSlug())
    .collection("country_news").add(news);
  }

  async getCountries(){
    var countries = [];
    const response = await this.firestore
      .collection("countries", ref => ref.orderBy('name', 'asc'))
      .get().toPromise();
    
    // If countries are present on the firestore database
    if (response.docs.length > 0) {
      countries = response.docs.map(doc => doc.data());
    }
    // Otherwise get them from API and load them on the db
    else{
      //const countries_api = "https://api.covid19api.com/countries";
      const countries_api = 'https://api.covid19api.com/summary';
      const api_resp = await this.httpClient.get(countries_api).toPromise();
      for (let i = 0; api_resp['Countries'][i]!= null; i++) {
        var curr_country = {
          name: api_resp['Countries'][i]['Country'],
          slug: api_resp['Countries'][i]['Slug']
        };
        countries.push(curr_country);
        this.firestore.collection("countries").doc(curr_country.slug).set(curr_country);
      }
      // Add also worldwide
      curr_country = {name: "Worldwide", slug: "world"};
      countries.push(curr_country);
      this.firestore.collection("countries").doc(curr_country.slug).set(curr_country);
      
      console.log("Countries got from API");        
    }
    return countries;
  }

  getUsers(){
    return this.firestore.collection("users").get();
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

 
}
