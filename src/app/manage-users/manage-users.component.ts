import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../covid-data.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'
            ]
})
export class ManageUsersComponent implements OnInit {

  //countries: Map<string, Object>;
  countries;
  usersPermissions: Map<Object, string[]>;
  users;

  constructor(public coviddata: CovidDataService,
    public userService: UserService) { 
      //this.countries = new Map<string, Object>();
      this.usersPermissions = new Map<Object, string[]>();
    }

  ngOnInit(): void {
    this.coviddata.getCountries().then(resp => {
      this.countries = resp;
      /*
      for (const country of resp) {
        this.countries.set(country['slug'], country)
      }   
      */   
    });

    this.coviddata.getUsers().subscribe(resp => {
      for (const user of resp.docs.map(doc => doc.data())) {
        this.usersPermissions.set({
          uid: user['uid'],
          displayName: user['displayName']
        }, user['countriesNewsEditor']);
      }      
      this.users = Array.from(this.usersPermissions.keys());
      console.log(this.users);
      
    })
  }

}
