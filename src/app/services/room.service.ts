import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private socket; //connects to socket.io server
  constructor() { }

  public initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  reqRooms(id:string): void{
    this.socket.emit("rooms", id);
  }
  getRooms(next): void{
    this.socket.on("rooms", res=>next(res));
  }

  joinRoom(room){
    this.socket.emit("joinroom", room);
  }

  joinedRoom(next){
    this.socket.on("joinroom", res=>next(res));
  }
  
  joinChannel(room, channel){
    this.socket.emit("joinchannel", room, channel);
  }

  joinedChannel(next){
    this.socket.on("joinchannel", res=>next(res));
  }
}
