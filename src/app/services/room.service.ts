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

  reqRooms(id: number): void{
    this.socket.emit("rooms", id);
  }
  getRooms(next): void{
    this.socket.on("rooms", res=>next(res));
  }
}
