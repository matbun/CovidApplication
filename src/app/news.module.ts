export class News{
    title: string;
    date: any;
    corpus: string;
    author: string;

    constructor(t: string, d: any, c: string, a:string){
        this.title = t;
        this.date = d;
        this.corpus = c;
        this.author = a;
    }
}