export class Country{
    name: string;
    slug: string;
    code: number;

    constructor(name: string, slug: string, code: number){
        this.name = name;
        this.code = code;
        this.slug = slug;
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