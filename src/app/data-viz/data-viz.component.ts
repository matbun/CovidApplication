import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { TodayData } from '../today.module';


import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-data-viz',
  templateUrl: './data-viz.component.html',
  styleUrls: ['./data-viz.component.css']
})
export class DataVizComponent implements OnInit {

  todayData: TodayData;
  /*
  wwTableData: ...
  */

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

    

  constructor(public coviddata: CovidDataService) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    this.getData().then(() => {
      // Actions to do after all data are loaded

      //console.log(this.todayData);
    })
    
    /*
    // Trigger get data from db/api using coviddata service
    this.stateData = this.coviddata.getData();

    // Prepare data to be ready to be visualized
    stateData.prepare();

    if (this.coviddata.getCovidState() == "Worldwide") {
      this.wwTableData = this.coviddata.getWwTableData();
    } 
    */
  }

  async getData(){
    // Today data
    await this.coviddata.getTodayData().then(
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
  }

  // Use a getter to get the name of the country from the html page
  get countryName() {return (this.coviddata && this.coviddata.getCovidCountry()) ? this.coviddata.getCovidCountry().name : null}


}
