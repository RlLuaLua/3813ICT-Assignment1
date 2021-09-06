import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messagecontent:string="";
  messages:string[] = [];
  ioConnection:any;

  availRooms = [];
  selectRoom:string="";
  curRoom:string="";
  isInRoom = false;
  
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
  }
  private initIoConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message:string) => {
        //add new message to message array
        this.messages.push(message);
        console.log("messages: " + this.messages);
      });
  }
  public chat(){
    //checks if there is a message to send
    if(this.messagecontent){
      console.log("message: " + this.messagecontent);
      this.socketService.send(this.messagecontent);
      this.messagecontent="";
    } else {
      console.log("no message");
    }

  }
}