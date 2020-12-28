import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CovidDataService } from './covid-data.service';

@Injectable({
  providedIn: 'root'
})
export class StatePageGuard implements CanActivate {
  constructor(private coviddata: CovidDataService,
    private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.coviddata.getCovidCountry().slug == 'world') {
      this.router.navigate(['home-page']);
    }
    return true;
  }
  
}
