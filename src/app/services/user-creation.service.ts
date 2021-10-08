import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewUser } from '../classes/new-user';
import io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root'
})
export class UserCreationService {
  private socket;
  constructor() { }

  public initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  createUser(userInfo:NewUser){
    this.socket.emit("createuser", userInfo);
  }

  reqUsers(){
    this.socket.emit('getusers');
  }

  getUsers(next){
    this.socket.on('getusers', (res)=>next(res));
  }

  reqUserDetails(id){
    this.socket.emit('getuserdetails', id);
  }

  getUserDetails(next){
    this.socket.on('getuserdetails', (res)=>next(res));
  }

  updateUserDetails(id:string, username:string, email:string, role:string){
    this.socket.emit('updateuserdetails', id, username, email, role)
  }
}
