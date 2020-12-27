export class News{
    title: string;
    date: any;
    corpus: string;

    constructor(t: string, d: any, c: string){
        this.title = t;
        this.date = d;
        this.corpus = c;
    }
}