import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserDataService } from '../services/user-data.service';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAttempt } from '../classes/login-attempt';

const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string = "";
  password:string = "";
  userlogin:LoginAttempt | undefined;
  
  constructor(private router: Router, private userdata: UserDataService, public appcomp:AppComponent) {  }
  
  ngOnInit() {
  }

  login(event) {
    this.userlogin = new LoginAttempt(this.username, this.password);
    console.log('1');
    console.log(this.userlogin);
    this.userdata.login(this.userlogin).subscribe((data)=>{
      console.log(data);
      localStorage.setItem('id', data._id);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);

      this.appcomp.LoggedIn = true;

      this.router.navigate(['group']);
    })
  }
}
