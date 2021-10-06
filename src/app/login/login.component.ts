import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserDataService } from '../services/user-data.service';

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAttempt } from '../classes/login-attempt';
import { HttpErrorResponse } from '@angular/common/http';

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
  errormsg:string="";
  
  
  constructor(private router: Router, private userdata: UserDataService, public appcomp:AppComponent) {  }
  
  ngOnInit() {
  }

  login(event) {
    this.userlogin = new LoginAttempt(this.username, this.password);
    this.userdata.login(this.userlogin).subscribe((data)=>{
      if(data.err == null){
        sessionStorage.setItem('id', data._id);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('loggedIn', 'true');

        this.router.navigate(['group']);
      }else{
        this.errormsg=data.err;
      }
    })
  }
}
