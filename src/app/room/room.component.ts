import { Component, OnInit } from '@angular/core';
import { RoomService } from '../services/room.service';


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
  roomSelected:boolean = false;
  ioConnection:any;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.initSocket();
    this.roomService.reqRooms(0);
    this.roomService.getRooms((retRooms) => {
      this.rooms.push(retRooms);
    });
    console.log(this.rooms);
  }

  selectRoom(){
    console.log(this.currentroom);
    this.roomchannels = [];
    for (let i=0; i < this.rooms.length; i++) {
      if(this.rooms[i].name == this.currentroom){
        this.roomchannels = this.rooms[i].channels;
        console.log(this.roomchannels);
      }
    }
  }
}