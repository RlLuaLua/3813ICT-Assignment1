import { Component, OnInit } from '@angular/core';
import { RoomService } from '../services/room.service';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms:any[] = [];
  ioConnection:any;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.initSocket();
    this.roomService.reqRooms(1);
    this.roomService.getRooms((retRooms) => {
      this.rooms.push(retRooms);
    });
    console.log(this.rooms);
  }

  
}
