import { Component, OnInit } from '@angular/core';
import { RoomService } from '../services/room.service';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms:any[] = [];
  roomchannels:any[] = [];
  currentroom:string = "";
  currentchannel:string = "";
  newRoomName:string = "";
  newChannelName:string = "";
  id:string="";
  messages:string[] = [];
  roomSelected:boolean = false;
  ioConnection:any;
  username:string | null="";
  Super:boolean = false;
  GroupAdmin:boolean = false;
  GroupAssis:boolean = false;

  constructor(private roomService: RoomService, private socketService: SocketService, private router: Router) { }

  ngOnInit(): void {
    //reset room and channel
    sessionStorage.setItem('room', "");
    sessionStorage.setItem('channel', "");

    this.username = sessionStorage.getItem('username');
    this.id = ""+sessionStorage.getItem('id');
    var role = sessionStorage.getItem("role");
    if(role == "superAdmin"){
      this.Super=true;
      this.GroupAdmin=true;
      this.GroupAssis=true;
    }else if(role == "groupAdmin"){
      this.Super=false;
      this.GroupAdmin=true;
      this.GroupAssis=true;
    }else if(role =="assisAdmin"){
      this.Super=false;
      this.GroupAdmin=false;
      this.GroupAssis=true;
    }else{
      this.Super=false;
      this.GroupAdmin=false;
      this.GroupAssis=false;
    }
    this.roomService.initSocket();
    this.roomService.reqRooms(this.id);
    this.roomService.getRooms((retRooms) => {
      console.log(retRooms.name);
      this.rooms.push(retRooms);
    });
    this.refreshRooms();
    //console.log(this.rooms);
  }

  refreshRooms(){
    this.rooms = [];
    console.log(this.rooms);
    
  }

  selectRoom(){
    this.roomchannels = [];
    this.roomSelected=true;
    this.roomService.joinRoom(this.currentroom, this.id);
    this.roomService.joinedRoom((retChannels) => {
      this.roomchannels = retChannels;
    });
  }

  selectChannel(){
    sessionStorage.setItem('room', this.currentroom);
    sessionStorage.setItem('channel', this.currentchannel);
    this.router.navigateByUrl("/chat");
  }

  createNewRoom(){
    if(this.newRoomName != ""){
      this.roomService.createRoom(this.newRoomName, this.id);
      this.refreshRooms();
    }
  }

  createNewChannel(){
    this.roomService.createChannel(this.currentroom, this.newChannelName)
  }

  deleteRoom(){
    this.roomService.removeRoom(this.currentroom);
    this.refreshRooms();
  }

  deleteChannel(){
    this.roomService.removeChannel(this.currentroom, this.currentchannel);
  }
}