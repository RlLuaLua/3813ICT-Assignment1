import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './room/room.component';
import { CreateUserComponent } from './create-user/create-user.component';


const routes: Routes = [
  {path: 'chat', component: ChatComponent},
  {path: '', component: LoginComponent},
  {path: 'group', component: RoomComponent},
  {path: 'createuser', component: CreateUserComponent}
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
