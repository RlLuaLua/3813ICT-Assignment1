import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

//const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  
  constructor(private router: Router, private http: HttpClient) {  }
  
  ngOnInit() {
  }

  loginClicked() {
    /*var userlogin = {username: this.username, password: this.password};
    console.log(userlogin);
    this.http.post(BACKEND_URL + '/api/auth', userlogin, httpOptions)
      .subscribe((data: any) => {
        alert(JSON.stringify(userlogin));
        if (data.valid) {
          sessionStorage.setItem('username', data.username);;
          sessionStorage.setItem('email', data.email);
          sessionStorage.setItem('role', data.role);
          
          this.http.post(BACKEND_URL + '/loginafter', data, httpOptions);
          this.router.navigateByUrl('account');
        } else {
          alert('Sorry, username or password is not valid');
        }
      });*/
  }
}
