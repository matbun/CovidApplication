export class WeeklyData{
    dailyConfirmed: number[];
    dailyDeaths: number[];
    dailyRecovered: number[];
    dates: string[];
    
    constructor(conf: number[], 
                deaths: number[], 
                recovered: number[],
                dates: string[]){
        this.dailyConfirmed = conf;
        this.dailyDeaths = deaths;
        this.dailyRecovered = recovered;
        this.dates = dates;
    }

    /*
    NOTE: when printing string dates: {{ str.toDate() | date }}
     */
}