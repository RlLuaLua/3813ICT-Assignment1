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

  joinRoom(room, id){
    this.socket.emit("joinroom", room, id);
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

  AssisStatus(next){
    this.socket.on("assisstatus", res=>next(res));
  }

  createRoom(roomname, id){
    this.socket.emit("createroom", roomname, id);
  }

  createChannel(roomname, channelname){
    this.socket.emit("createchannel", roomname, channelname);
  }

  inviteUsers(roomname, userid){
    this.socket.emit("inviteuser", roomname, userid);
  }

  removeRoom(roomname){
    this.socket.emit("removeroom", roomname);
  }

  removeChannel(roomname, channelname){
    this.socket.emit("removechannel", roomname, channelname);
  }

  removeRoomUser(roomname, userid){
    this.socket.emit("removeroomuser", roomname, userid);
  }

  removeChannelUser(roomname, channelname, userid){
    this.socket.emit("removechanneluser", roomname, channelname, userid);
  }

  checkAuthLevel(id){
    this.socket.emit("authlevel", id);
  }

  returnAuthLevel(next){
    this.socket.on("authlevel", res=>next(res));
  }
}