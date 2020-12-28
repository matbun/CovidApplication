import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CovidDataService } from '../covid-data.service';
import { User } from '../user.module';
import { UserService } from '../user.service';

export class Country {
  constructor(public name: string, public slug: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  countries: Array<Country> = new Array<Country>();
  users: Array<User> = new Array<User>();

  // In list box
  selectedUserId = undefined;
  selectedUser: User;
  editedUsers: Array<User> = new Array<User>();

  // In checkbox list
  selectedCountries: Array<Country> = new Array<Country>();
  filteredCountries: Observable<Country[]>;
  lastFilter: string = '';

  countryControl = new FormControl();

  constructor(public coviddata: CovidDataService,
    public userService: UserService) { 
    }

  ngOnInit(): void {
    this.coviddata.getCountries().then(resp => {
      for (const country of resp) {
        this.countries.push(new Country(country['name'], country['slug']))
      }   
    });

    this.coviddata.getUsers().subscribe(resp => {
      for (const user of resp.docs.map(doc => doc.data())) {        
        this.users.push({
          uid: user['uid'],
          displayName: user['displayName'],
          admin: user['admin'],
          email: user['email'],
          countriesNewsEditor: user['countriesNewsEditor']
        });
      }
    });

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith<string | Country[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter => this.filter(filter))
    );
    
  }

  listChanged(){
    const userIndex = this.users.findIndex((usr) => usr.uid == this.selectedUserId);
    this.selectedUser = this.users[userIndex];    

    // Clear selected countries state
    this.selectedCountries.forEach(country => country.selected = false);
    this.selectedCountries = [];
    // Load user selected conuntries
    for (const countrySlug of this.selectedUser.countriesNewsEditor) {
      let countryIndex = this.countries.findIndex((country) => country.slug == countrySlug);      
      if (countryIndex >= 0) {
        var currCountry = this.countries[countryIndex];
        currCountry.selected = true;
        this.selectedCountries.push(currCountry);
      }
    }

    // Add to edited users list
    //this.markAsEdited(this.selectedUser);
  }

  markAsEdited(user: User){
    const wasAlreadyEdited = this.editedUsers.findIndex((usr) => usr.uid == user.uid);
    if (wasAlreadyEdited < 0) {
      this.editedUsers.push(user);
    }
  }

  filter(filter: string): Country[] {
    this.lastFilter = filter;
    if (filter) {
      return this.countries.filter(option => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
          || option.slug.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.countries.slice();
    }
  }

  displayFn(value: Country[] | string): string | undefined {
    /*
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((country, index) => {
        if (index === 0) {
          displayValue = country.name;
        } else {
          displayValue += ', ' + country.name;
        }
      });
    } else {
      displayValue = value;
    }
    return displayValue;
    */
   return ""
  }

  optionClicked(event: Event, country: Country) {
    event.stopPropagation();
    this.toggleSelection(country);
  }

  toggleSelection(country: Country) {
    country.selected = !country.selected;
    if (country.selected) {
      this.selectedCountries.push(country);
      if (this.selectedUser.countriesNewsEditor.findIndex(value => value === country.slug) < 0) {
        this.selectedUser.countriesNewsEditor.push(country.slug);
      }
    } else {
      var i = this.selectedCountries.findIndex(value => value.slug === country.slug);
      this.selectedCountries.splice(i, 1);

      i = this.selectedUser.countriesNewsEditor.findIndex(value => value === country.slug);
      this.selectedUser.countriesNewsEditor.splice(i, 1);
    }

    this.countryControl.setValue(this.selectedCountries);
    // Mark user as edited
    this.markAsEdited(this.selectedUser);
  }

  selectAllCountries(event: Event){
    if (event['checked']) {
      // push all countries in the list
      this.selectedCountries = [];
      this.selectedUser.countriesNewsEditor = [];
      for (const country of this.countries) {
        country.selected = true;
        this.selectedCountries.push(country);
        this.selectedUser.countriesNewsEditor.push(country.slug)
      }
    }
    else{
      // remove all countries in the list
      this.selectedCountries = [];
      this.selectedUser.countriesNewsEditor = [];
      for (const country of this.countries) {
        country.selected = false;
      }
    }

    // Mark user as edited
    this.markAsEdited(this.selectedUser);
    
  }

  toggleAdmin(event: Event){
    this.selectedUser.admin = !this.selectedUser.admin;
    // Mark user as edited
    this.markAsEdited(this.selectedUser);
  }

  saveChanges(){
    for (const usr of this.editedUsers) {
      this.userService.updateUser(usr);
    }
    this.editedUsers = [];
  }

  showEditedUsers(): string{
    var finalStr;
    for (let i = 0; i < this.editedUsers.length; i++) {
      if (i == 0) {
        finalStr = this.editedUsers[i].displayName;
      }
      else{
        finalStr += ", " + this.editedUsers[i].displayName;
      }
    }
    return finalStr;
  }

}
