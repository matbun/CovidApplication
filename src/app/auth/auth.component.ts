import { Component, OnInit } from '@angular/core';
import { User } from '../user.module';

import { UserService } from '../user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  user: User;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    // Get user data from service 
    this.user = this.userService.getUser();
  }

}
