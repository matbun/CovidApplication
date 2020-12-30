export class TodayData{
    newConfirmed: number;
    totalConfirmed: number;
    activeCases: number;

    newDeaths: number;
    totalDeaths: number;
    mortalityRate: number ;

    newRecovered: number;
    totalRecovered: number;
    recoveryRate: number;

    cases: Array<[string, number]>;
    deaths: Array<[string, number]>;
    recovers: Array<[string, number]>;
    
    constructor(newconf: number,
                totconf: number,
                newdeath: number,
                totdeath: number,
                newrec: number,
                totrec: number){
        this.newConfirmed = newconf;
        this.totalConfirmed = totconf;
        this.newDeaths = newdeath;
        this.totalDeaths = totdeath;
        this.newRecovered = newrec;
        this.totalRecovered = totrec;

        this.mortalityRate = totdeath / totconf * 100;
        this.activeCases = totconf - totrec;
        this.recoveryRate = totrec / totconf * 100;
    
        this.cases = [
                        ["Total Cases", this.totalConfirmed],
                        ["New Cases", this.newConfirmed],
                        ["Active Cases", this.activeCases]
                    ];
        
        this.deaths = [
                        ["Total Deaths", this.totalDeaths],
                        ["New Deaths", this.newDeaths]
                    ];
        this.recovers = [
                        ["Total Recovered", this.totalRecovered],
                        ["New Recovered", this.newRecovered]
                    ];

    }
}