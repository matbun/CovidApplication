import { Component, OnInit } from '@angular/core';
import { Country } from '../country.module';
import { CovidDataService } from '../covid-data.service';
import { News } from '../news.module';
import { User } from '../user.module';
import { UserService } from '../user.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  user: User;
  country: Country;
  news: News[] = [];

  date: any;
  title: string;
  corpus: string;

  constructor(public coviddata: CovidDataService,
              public userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.country = this.coviddata.getCovidCountry();

    this.coviddata.getNews().subscribe((news: News[])=>{
      this.news = news;
    });

  }

  addNews(){
    let lastNews = {
      date: new Date(this.date),
      title: this.title,
      corpus: this.corpus
    }
    this.coviddata.addNews(lastNews);
    this.date = undefined;
    this.title = undefined;
    this.corpus = undefined;
  }

  isUserEligibleEditor(): boolean{
    // Update user
    this.user = this.userService.getUser();

    // look for permission
    const i = this.user.countriesNewsEditor.findIndex((val) => val == this.coviddata.getCovidCountry().slug);
    if (i >= 0) {
      return true;
    }
    return false;
  }

}
