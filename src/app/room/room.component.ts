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
    }else{
      this.Super=false;
      this.GroupAdmin=false;
      this.GroupAssis=false;
    }
    this.roomService.initSocket();
    this.roomService.reqRooms(this.id);
    this.roomService.getRooms((retRooms) => {
      this.rooms.push(retRooms);
    });
    this.refreshRooms();
  }

  refreshRooms(){
    this.rooms = [];
    
  }

  return(){
    this.roomSelected=false;
  }

  UserLink(){
    this.router.navigateByUrl("/createuser");
  }
  
  selectRoom(){
    this.roomchannels = [];
    this.roomSelected=true;
    this.roomService.joinRoom(this.currentroom, this.id);
    this.roomService.joinedRoom((retChannels, AssisStatus) => {
      this.roomchannels = retChannels;
      this.roomService.AssisStatus((AssisStatus) => {
        if(AssisStatus == 1 || this.GroupAdmin == true){
          this.GroupAssis = true;
        }else{
          this.GroupAssis = false;
        }
      })
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

  InviteUserRoom(){

  }

  RemoveUserRoom(){

  }

  InviteUserChannel(){

  }

  RemoveUserChannel(){
    
  }
}