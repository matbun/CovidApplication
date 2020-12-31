import { Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { Country } from '../country.module';
import { CovidDataService } from '../covid-data.service';
import { News } from '../news.module';
import { User } from '../user.module';
import { UserService } from '../user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export interface Post{
  post: News;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})

export class NewsComponent implements OnInit, AfterViewInit {

  user: User;
  country: Country;
  news: News[] = [];

  // Mat table
  posts: Post[] = [];
  displayedColumns = ['post'];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource<Post>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /*
  @ViewChild(MatPaginator, {static: true}) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  */

  date: any;
  title: string;
  corpus: string;

  constructor(public coviddata: CovidDataService,
              public userService: UserService) { }
  
  ngAfterViewInit(): void {    
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {  
    this.user = this.userService.getUser();
    
    this.country = this.coviddata.getCovidCountry();

    this.coviddata.getNews().subscribe((news: News[])=>{
      this.news = news;
      // Load news as posts
      this.posts = [];
      for (const n of this.news) {
        this.posts.push({post: n});
      }
      // Add posts to dataSource object
      this.dataSource.data = this.posts;
    });
  }

  addNews(){
    let lastNews: News = {
      date: new Date(this.date),
      title: this.title,
      corpus: this.corpus,
      author: this.userService.getUser().displayName
    }
    this.coviddata.addNews(lastNews);
    this.date = undefined;
    this.title = undefined;
    this.corpus = undefined;
  }

  isUserEligibleEditor(): boolean{
    // Refresh user
    this.user = this.userService.getUser();

    // look for permission
    if (this.user != null) {
      const i = this.user.countriesNewsEditor.findIndex((val) => val == this.coviddata.getCovidCountry().slug);
      if (i >= 0) {
        return true;
      }
    }
    return false;
  }

}
