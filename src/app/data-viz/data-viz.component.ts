import { Component, OnInit, ViewChild } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { TodayData } from '../today.module';
import { Sort } from '@angular/material/sort';


import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Country } from '../country.module';
import { WeeklyData } from '../week.module';
import { DayOneData } from '../dayone.module';
import { MinLengthValidator } from '@angular/forms';


@Component({
  selector: 'app-data-viz',
  templateUrl: './data-viz.component.html',
  styleUrls: ['./data-viz.component.scss']
})
export class DataVizComponent implements OnInit {

  country: Country;
  todayData: TodayData;
  weekData: WeeklyData;
  dayOneData: DayOneData;
  countriesTable: Country[] = [];
  sortedCountriesTable: Country[];

  // Pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // Bar chart
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[];

  // Line chart
  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      //borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

    

  constructor(public coviddata: CovidDataService) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    // Country data
    this.country = this.coviddata.getCovidCountry();

    // Today data
    this.coviddata.getTodayData().then(
      (response: any) => {
        let responseData;
        // If worldwide
        if(this.country.getSlug() == "world"){
          responseData = response[0];

          // Summary table
          let i: number = 0;
          for (const country of response[1]) {
            //console.log(country['Country'] + " - " + country['Slug']);
            let currCountry: Country = new Country(country['Country'], country['Slug'], i);
            currCountry.setTodayData(country['NewConfirmed'],
                                      country['TotalConfirmed'],
                                      country['NewDeaths'],
                                      country['TotalDeaths'],
                                      country['NewRecovered'],
                                      country['TotalRecovered']);
            this.countriesTable.push(currCountry);
            i++;
          }
          this.sortedCountriesTable = this.countriesTable.slice();
        }
        // If in a country page
        else{
          responseData = response;
        }

        // If worldwide or in a country page
        this.todayData = new TodayData(responseData['NewConfirmed'],
                                        responseData['TotalConfirmed'],
                                        responseData['NewDeaths'],
                                        responseData['TotalDeaths'],
                                        responseData['NewRecovered'],
                                        responseData['TotalRecovered']);
                                      
        this.pieChartLabels = ["Death cases", "Recovered cases", 'Active Cases'];
        this.pieChartData = [this.todayData.totalDeaths,
                            this.todayData.totalRecovered,
                            this.todayData.totalConfirmed
                            ];
                       
      }
    );
    
    // Week data
    var aggrDate: Map<string, [number, number, number]> = new Map();
    this.coviddata.getWeeklyData().then(
      (response: JSON) => {
        var today = new Date();        

        // If worldwide
        if(this.country.getSlug() == "world"){
          // Sort days
          var cases = [];
          var i: number = 0;
          while (response[i] != null) {
            cases.push(response[i]);
            i++;
          }
          cases.sort((a,b) => b['TotalConfirmed'] - a['TotalConfirmed']);
          
          var currDay: Date;
          var i: number = cases.length - 1;
          while(i >= 0){
            currDay = this.coviddata.date_by_subtracting_days(today, i+1);
            //console.log(cases[i]);
            aggrDate.set(currDay.toISOString(),
                              [
                                cases[i]['TotalConfirmed'],
                                cases[i]['TotalDeaths'],
                                cases[i]['TotalRecovered']
                              ]);
            i--;
          }
        }
        
        // If in a specific country
        else{
          var i: number = 0;
          while(response[i] != null){
            //console.log(response[i]);
            if(aggrDate.get(response[i]['Date']) == null){
              aggrDate.set(response[i]['Date'],
                                [
                                  response[i]['Confirmed'],
                                  response[i]['Deaths'],
                                  response[i]['Recovered']
                                ]);
            }
            else{
              const curr = aggrDate.get(response[i]['Date']);
              aggrDate.set(response[i]['Date'],
                                [
                                  response[i]['Confirmed'] + curr[0],
                                  response[i]['Deaths'] + curr[1],
                                  response[i]['Recovered'] + curr[2]
                                ]);
            }
                                
            i++;
          }
        }
        //console.log(aggrDate);

        let confirmed: number[] = [];
        let deaths: number[] = [];
        let recovered: number[] = [];

        let c: number[] = [];
        let d: number[] = [];
        let r: number[] = [];

        var i: number = 0;
        for(var tuple of aggrDate.values()){
          confirmed.push(tuple[0]);
          deaths.push(tuple[1]);
          recovered.push(tuple[2]);
          if(i > 0){
            c.push(confirmed[i] - confirmed[i-1]);  
            d.push(deaths[i] - deaths[i-1]);
            r.push(recovered[i] - recovered[i-1]);
          }
          i++;
        }
        
        var dates: string[] = [];
        var i: number = 0;
        for(var date of aggrDate.keys()){
          if(i > 0){
            var date_string = new Date(date).toDateString();
            dates.push(date_string.split(" ")[1] + " " + Number(date_string.split(" ")[2]));
          }
          i++;
        }

        // check if today data records is present. If not, fill with empty data
        let today_string = today.toISOString().split("T")[0] + "T00:00:00Z";
        if (aggrDate.get(today_string) == null) {
          date_string = new Date(today_string).toDateString();
          dates.push(date_string.split(" ")[1] + " " + Number(date_string.split(" ")[2]));
          c.push(0);
          d.push(0);
          r.push(0);
        }

        //console.log(Array.from(aggrDate.keys()));
        //console.log(dates);
                
        this.weekData = new WeeklyData(c, d, r, dates);
        
        // Bar chart
        this.barChartLabels = this.weekData.dates;
        
        this.barChartData = [
          { data: this.weekData.dailyDeaths, label: 'Daily new deaths'},
          { data: this.weekData.dailyRecovered, label: 'Daily new recovered' },
          { data: this.weekData.dailyConfirmed, label: 'Daily new confirmed' }
        ];

      }
    );


    // Day one data
    var aggrDateDayOne: Map<string, [number, number, number]> = new Map();
    this.coviddata.getDayOneData().then(
      (response: JSON) => {        

        // If worldwide
        if(this.country.getSlug() == "world"){
          // Sort days
          let confirmed: number[] = [];
          let deaths: number[] = [];
          let recovered: number[] = [];
          var i: number = 0;          
          while(response[i] != null){
            confirmed.push(response[i]['TotalConfirmed']);
            deaths.push(response[i]['TotalDeaths']);
            recovered.push(response[i]['TotalRecovered']);
            i++;
          } 
          
          // sort in descending order: smooth out errors in the api
          confirmed.sort((a,b) => b - a);
          deaths.sort((a,b) => b - a);
          recovered.sort((a,b) => b - a);
         
          
          var today = new Date();
          var currDay: Date;
          var i: number = deaths.length - 1;
          while(i >= 0){
            currDay = this.coviddata.date_by_subtracting_days(today, i+1);
            //console.log(cases[i]);
            //console.log("Date: " + currDay.toISOString());
            
            aggrDateDayOne.set(currDay.toISOString(),
                              [
                                confirmed[i],
                                deaths[i],
                                recovered[i]
                              ]);
            i--;
          }
        }
        // If in a specific country
        else{
          var i: number = 0;
          while(response[i] != null){
            //console.log(response[i]);
            if(aggrDateDayOne.get(response[i]['Date']) == null){
              aggrDateDayOne.set(response[i]['Date'],
                                [
                                  response[i]['Confirmed'],
                                  response[i]['Deaths'],
                                  response[i]['Recovered']
                                ]);
            }
            else{
              const curr = aggrDateDayOne.get(response[i]['Date']);
              aggrDateDayOne.set(response[i]['Date'],
                                [
                                  response[i]['Confirmed'] + curr[0],
                                  response[i]['Deaths'] + curr[1],
                                  response[i]['Recovered'] + curr[2]
                                ]);
            }
            i++;
          }
        }

        //console.log(aggrDateDayOne);

        let confirmed: number[] = [];
        let deaths: number[] = [];
        let recovered: number[] = [];

        for(var tuple of aggrDateDayOne.values()){
          confirmed.push(tuple[0]);
          deaths.push(tuple[1]);
          recovered.push(tuple[2]);
        }

        // sort in ascending order: smooth out errors in the api
        confirmed.sort((a,b) => a - b);
        deaths.sort((a,b) => a - b);
        recovered.sort((a,b) => a - b);
        
        var dates: string[] = [];
        for(var date of aggrDateDayOne.keys()){
            var date_string = new Date(date).toDateString();
            dates.push(date_string.split(" ")[1] + " " + Number(date_string.split(" ")[2]));
        }
        //console.log(Array.from(aggrDateDayOne.keys()));
        //console.log(dates);
                
        this.dayOneData = new DayOneData(confirmed, deaths, recovered, dates);
        //console.log(this.dayOneData);
        
        // Line chart
        this.lineChartLabels = this.dayOneData.dates;
        
        this.lineChartData = [
          { data: this.dayOneData.dailyDeaths, label: 'Total deaths'},
          { data: this.dayOneData.dailyRecovered, label: 'Total recovered' },
          { data: this.dayOneData.dailyConfirmed, label: 'Total confirmed' }
        ];
      
        
      }
    );
    
  }

  // Use a getter to get the name of the country from the html page
  get countryName() {return (this.coviddata && this.coviddata.getCovidCountry()) ? this.coviddata.getCovidCountry().name : null}
  get countrySlug() {return (this.coviddata && this.coviddata.getCovidCountry()) ? this.coviddata.getCovidCountry().slug : null}

  // Sort data in summary countries table
  sortData(sort: Sort) {
    const data = this.countriesTable.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedCountriesTable = data;
      return;
    }

    this.sortedCountriesTable = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'newConfirmed': return compare(a.newConfirmed, b.newConfirmed, isAsc);
        case 'totalConfirmed': return compare(a.totalConfirmed, b.totalConfirmed, isAsc);
        case 'newDeaths': return compare(a.newDeaths, b.newDeaths, isAsc);
        case 'totalDeaths': return compare(a.totalDeaths, b.totalDeaths, isAsc);
        case 'newRecovered': return compare(a.newRecovered, b.newRecovered, isAsc);
        case 'totalRecovered': return compare(a.totalRecovered, b.totalRecovered, isAsc);
        default: return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
