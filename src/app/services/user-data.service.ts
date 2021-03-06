import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginAttempt } from '../classes/login-attempt';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http:HttpClient) { }

  login(login:LoginAttempt){
    return this.http.post<any>('http://localhost:3000/api/auth', login);
  }
}
