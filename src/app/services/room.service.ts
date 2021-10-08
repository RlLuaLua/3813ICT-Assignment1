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

  AssisStatus(next){
    this.socket.on("assisstatus", res=>next(res));
  }

  createRoom(roomname, id){
    this.socket.emit("createroom", roomname, id);
  }

  createChannel(roomname, channelname){
    this.socket.emit("createchannel", roomname, channelname);
  }

  //remove sockets
  removeRoom(roomname){
    this.socket.emit("removeroom", roomname);
  }

  removeChannel(roomname, channelname){
    this.socket.emit("removechannel", roomname, channelname);
  }
  //get all users
  reqUsers(){
    this.socket.emit('getusers');
  }

  getUsers(next){
    this.socket.on('getusers', (res)=>next(res))
  }

  //manage room users
  reqRoomUsers(roomname){
    this.socket.emit("getroomusers", roomname);
  }

  getRoomUsers(next){
    this.socket.on("getroomusers", (res)=>next(res));
  }

  addRoomUser(roomname, userid){
    this.socket.emit("addroomuser", roomname, userid);
  }

  removeRoomUser(roomname, userid){
    this.socket.emit("removeroomuser", roomname, userid);
  }
  //manage channel users
  reqChannelUsers(roomname){
    this.socket.emit("getchannelusers", roomname);
  }

  getChannelUsers(next){
    this.socket.emit("getchannelusers", (res)=>next(res));
  }

  AddChannelUser(roomname, channelname, userid){
    this.socket.emit("addchanneluser", roomname, channelname, userid);
  }
  removeChannelUser(roomname, channelname, userid){
    this.socket.emit("removechanneluser", roomname, channelname, userid);
  }
}