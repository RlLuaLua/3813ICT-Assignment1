import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket; //connects to socket.io server
  constructor() { }

  public initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  public send(message: string, user: string): void {
    console.log(message + " " + user);
    this.socket.emit('message', message, user);
  }
  public onMessage(): Observable<any> {
    let observable = new Observable(observer=>{
      this.socket.on('message', (data:object) => observer.next(data));
    });
    return observable;
  }

  public getMessages(room: string, channel: string){
    this.socket.emit('gethistory', room, channel)
  }
  
  public recMessages(next){
    this.socket.on('gethistory', (res)=>next(res));
  }
}
