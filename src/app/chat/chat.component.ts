import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../classes/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messagecontent:string="";
  user:string="";
  messages: Message[] = [];
  room:any = "";
  channel:any = "";
  ioConnection:any;
  
  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
  }
  private initIoConnection(){
    this.socketService.initSocket();
    this.room = sessionStorage.getItem("room");
    this.channel = sessionStorage.getItem("channel");
    this.user = ""+sessionStorage.getItem("username");
    this.socketService.getMessages(this.room, this.channel);
    this.socketService.recMessages((msgArr) => {
      console.log(msgArr);
      this.messages = msgArr;
    })
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message:Message) => {
        //add new message to message array
        this.messages.push(message);
        console.log(this.messages);
      });
  }
  public chat(){
    //checks if there is a message to send
    if(this.messagecontent){
      console.log(this.user + " " + this.messagecontent);

      this.socketService.send(this.messagecontent, this.user);
      this.messagecontent="";
    } else {
      console.log("no message");
    }

  }
}