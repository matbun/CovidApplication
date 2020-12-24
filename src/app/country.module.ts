import { TodayData } from "./today.module";

export class Country{
    name: string;
    slug: string;
    code: number;
    
    newConfirmed: number;
    totalConfirmed: number;
    newDeaths: number;
    totalDeaths: number;
    newRecovered: number;
    totalRecovered: number;

    constructor(name: string, slug: string, code: number){
        this.name = name;
        this.code = code;
        this.slug = slug;
    }
    setTodayData(nconf, tconf, ndea, tdea, nrec, trec){
        this.newConfirmed = nconf;
        this.totalConfirmed = tconf;
        this.newRecovered = nrec;
        this.totalRecovered = trec;
        this.newDeaths = ndea;
        this.totalDeaths = tdea;
    }

    getName(){
        return this.name;
    }
    getCode(){
        return this.code;
    }
    getSlug(){
        return this.slug;
    }
}