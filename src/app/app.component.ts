import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent{
  title = '';
  LoggedIn:boolean=false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("username")){
      this.LoggedIn=true;
    }
  }

  LogIn(){
    this.router.navigateByUrl("");
  }

  LogOut(){
    this.LoggedIn=false
    sessionStorage.clear();
    this.router.navigateByUrl("");
  }
}
