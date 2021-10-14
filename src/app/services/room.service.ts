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

  public initSocket(): void {//initialises socket connection
    this.socket = io(SERVER_URL);
  }

  reqRooms(id:string): void{//requests rooms for user with id; id
    this.socket.emit("rooms", id);
  }
  getRooms(next): void{//gets rooms pushes to function
    this.socket.on("rooms", res=>next(res));
  }

  joinRoom(room, id){//emits room to be joined, and the user joining.
    this.socket.emit("joinroom", room, id);
  }

  joinedRoom(next){//gets room information, which has been edited based on user permissions/channel exclusions
    this.socket.on("joinroom", res=>next(res));
  }

  AssisStatus(next){//returns whether the user is a groupAssis for the current group. this changes what html will be viewable for the user.
    this.socket.on("assisstatus", res=>next(res));
  }

  createRoom(roomname, id){//creates a new room, and adds the user who created it to the user list
    this.socket.emit("createroom", roomname, id);
  }

  createChannel(roomname, channelname){//creates a new channel for the current room called
    this.socket.emit("createchannel", roomname, channelname);
  }

  //remove sockets
  removeRoom(roomname){//removes a room based off the roomname
    this.socket.emit("removeroom", roomname);
  }

  removeChannel(roomname, channelname){//removes a channel based off of the room and channel names
    this.socket.emit("removechannel", roomname, channelname);
  }
  //get all users
  reqUsers(){//requests all users
    this.socket.emit('getusers');
  }

  getUsers(next){//returns all users as an object array.
    this.socket.on('getusers', (res)=>next(res))
  }

  //manage room users
  reqRoomUsers(roomname){//requests users that are in this room
    this.socket.emit("getroomusers", roomname);
  }

  getRoomUsers(next){//returns the users in this room, their ids, and names
    this.socket.on("getroomusers", (res)=>next(res));
  }

  addRoomUser(roomname, userid,  role){//adds a user based off roomname, and gives them a user role for the room
    this.socket.emit("addroomuser", roomname, userid, role);
  }

  removeRoomUser(roomname, userid){//removes user with userid from room roomname
    this.socket.emit("removeroomuser", roomname, userid);
  }
  //manage channel users
  reqChannelUsers(roomname){//sends request for channel users 
    this.socket.emit("getchannelusers", roomname);
  }

  getChannelUsers(next){//recieves all channel users
    this.socket.emit("getchannelusers", (res)=>next(res));
  }

  addChannelUser(roomname, channelname, userid){//removes a user from the excluded list of a channel
    this.socket.emit("addchanneluser", roomname, channelname, userid);
  }
  removeChannelUser(roomname, channelname, userid){//adds a user to the excluded list of a channel
    this.socket.emit("removechanneluser", roomname, channelname, userid);
  }
}