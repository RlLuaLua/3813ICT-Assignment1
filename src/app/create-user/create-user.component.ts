import { Component, OnInit } from '@angular/core';
import { UserCreationService } from '../services/user-creation.service';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';
import { NewUser } from '../classes/new-user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  Super:boolean = false;
  groupAdmin:boolean = false;

  username:string = "";
  email:string = "";
  password:string="";
  role:string="";
  roles:string[]=["superAdmin", "groupAdmin", ""];
  groupRoles:string[]=["groupAdmin", ""];

  editid:string=""
  editusername:string = "";
  editemail:string = "";
  editrole:string="";
  
  users:any[]=[];
  selecteduserID:string="";
  userSelected:boolean=false;


  constructor(private userService: UserCreationService, private router: Router) { }

  ngOnInit(): void {
    var role = sessionStorage.getItem("role");
    if(role == "superAdmin"){
      this.Super = true;
      this.groupAdmin = true;
    }else if(role == "groupAdmin"){
      this.Super = false;
      this.groupAdmin = true;
    }else{
      this.Super = false;
      this.groupAdmin = false;
    }
    this.userService.initSocket();
    this.userService.reqUsers();
    this.userService.getUsers((res)=>{
      this.users=res;
    });
  }

  createUser(){
    var newuser = new NewUser(this.username,this.email, this.password, this.role);
    this.userService.createUser(newuser);
  }

  editUser(){
    this.userSelected = true;
    this.userService.reqUserDetails(this.selecteduserID);
    this.userService.getUserDetails((res)=>{
      this.editid=res._id;
      this.editusername=res.username;
      this.editemail=res.email;
      this.editrole=res.role;
    })
  }

  updateUser(){
    this.userService.updateUserDetails(this.editid, this.editusername, this.editemail, this.editrole);
  }
}
