import { Component, OnInit, ViewChild } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { TodayData } from '../today.module';


import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { Country } from '../country.module';
import { WeeklyData } from '../week.module';
import { DayOneData } from '../dayone.module';

@Component({
  selector: 'app-data-viz',
  templateUrl: './data-viz.component.html',
  styleUrls: ['./data-viz.component.css']
})
export class DataVizComponent implements OnInit {

  country: Country;
  todayData: TodayData;
  weekData: WeeklyData;
  dayOneData: DayOneData;


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
      (response: JSON) => {
        // Actions after today data is loaded
        this.todayData = new TodayData(response['NewConfirmed'],
                                       response['TotalConfirmed'],
                                       response['NewDeaths'],
                                       response['TotalDeaths'],
                                       response['NewRecovered'],
                                       response['TotalRecovered']);
                                       
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

        // If worldwide
        if(this.country.getSlug() == "world"){
          // Sort days
          var cases = [];
          for(var i = 0; i < 8; i++){
            cases.push(response[i]);
          }
          cases.sort((a,b) => b['TotalConfirmed'] - a['TotalConfirmed']);
          
          var today = new Date();
          var currDay: Date;
          var i: number = 7;
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
          //console.log(aggrDate);
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
          var cases = [];
          var i: number = 0;          
          while(response[i] != null){
            cases.push(response[i]);
            i++;
          } 
          
          // sort in descending order
          cases.sort((a,b) => b['TotalConfirmed'] - a['TotalConfirmed']);
                    
          var today = new Date();
          var currDay: Date;
          var i: number = cases.length - 1;
          while(i >= 0){
            currDay = this.coviddata.date_by_subtracting_days(today, i+1);
            //console.log(cases[i]);
            //console.log("Date: " + currDay.toISOString());
            
            aggrDateDayOne.set(currDay.toISOString(),
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
          { data: this.dayOneData.dailyDeaths, label: 'Daily new deaths'},
          { data: this.dayOneData.dailyRecovered, label: 'Daily new recovered' },
          { data: this.dayOneData.dailyConfirmed, label: 'Daily new confirmed' }
        ];
      
        
      }
    );
    
  }

  // Use a getter to get the name of the country from the html page
  get countryName() {return (this.coviddata && this.coviddata.getCovidCountry()) ? this.coviddata.getCovidCountry().name : null}

}
