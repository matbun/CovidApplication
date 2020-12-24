import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { Country } from '../country.module';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  //country: Country;

  constructor(public coviddata: CovidDataService) { }

  ngOnInit(): void {
    this.coviddata.setCovidCountry("Worldwide", "world", -1);
    //this.coviddata.setCovidCountry("France", "france", 59);
    //this.coviddata.setCovidCountry("Afghanistan", 0);
    //this.country = this.coviddata.getCovidCountry();
  }

}
