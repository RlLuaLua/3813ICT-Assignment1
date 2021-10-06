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
  id:string="";
  messages:string[] = [];
  roomSelected:boolean = false;
  ioConnection:any;
  username:string | null="";

  constructor(private roomService: RoomService, private socketService: SocketService, private router: Router) { }

  ngOnInit(): void {
    //reset room and channel
    sessionStorage.setItem('room', "");
    sessionStorage.setItem('channel', "");
    
    this.username = sessionStorage.getItem('username');
    this.id = ""+sessionStorage.getItem('id');
    this.roomService.initSocket();
    this.roomService.reqRooms(this.id);
    this.roomService.getRooms((retRooms) => {
      this.rooms.push(retRooms);
    });
    //console.log(this.rooms);
  }

  selectRoom(){
    //console.log(this.currentroom);
    this.roomchannels = [];
    this.roomService.joinRoom(this.currentroom);
    this.roomService.joinedRoom((retChannels) => {
      //console.log(retChannels);
      this.roomchannels = retChannels;
    });
  }

  selectChannel(){
    sessionStorage.setItem('room', this.currentroom);
    sessionStorage.setItem('channel', this.currentchannel);
    this.router.navigateByUrl("/chat");
  }
}