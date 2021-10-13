Git Documentation

The Git Repository was organised in a single branch with an online Github repository. Changes to the Git repository were committed when the functionality was completed, after which the changes were pushed to the Github Origin.

Data Structures

There are two data structures within the application, both stored in a MongoDB. The User data structure contains an array of user objects with the following properties:
{
  //unique MongoDB ID
  "_id": ObjectID("615d143e7d578e8078734308"),
  "username": "super",
  "email": "super@duper.com", 
  "password": "duper",
  //User role for granting/checking permissions
  "role": "superAdmin"
}
The Room (Group) data structure contains an array of objects, each with several nested arrays of objects, and references to the Users _id property.
Each object in the Room Structure uses the following template:
{
  "_id": ObjectID("615d143e7d578e8078734308"),
  "name": "room1", ,
  "channels": [
    //channel object array
    {
	    //channel name
      "name": "r1 channel 1", 
	    //list of messages in the channel
      "messages": [{"user": "server", "message": "start1"}],
      //list of User IDs to be excluded from viewing this channel
      "excludes": [{"id": "615d143e7d578e8078734308"}]
    }
  ],
  //list of Room(Group) users by user ID 
  "users": [
    {
      "id": "615d143e7d578e8078734306", 
      //status as a GroupAssis (0 for normal user, 1 for group Assis)
      "role": 0
    }
  ]
}
UserDataService
http://localhost:3000/api/auth

Service for login functionality, Has one post method call, which sends the inputted user login to the server for verification.

UserCreationService
http://localhost:3000/users
Has several socket emits, and socket ons

Emits:
createUser: sends the information required to create a new user under socket name: createuser

reqUsers: sends request to get all user details.
Under socket name: getusers

reqUserDetails: sends request to get user details based on user id. Under socket name: getuserdetails

updateUserDetails: sends user details to be updated by user ID. 
Under socket name: updateuserdetails

Ons:
getUsers: receives output usernames & ids, and returns them to a function.
Under socket name: getusers

getUserDetails: receives user details (id, username, email, role) and returns them to a function.
Under socket name: getuserdetails

SocketService
http://localhost:3000/chat

Has several socket emits, and socket ons

Emits:
send: sends message and user to current chat socket. 
Under socket name: message

getMessages: called upon joining chat socket room. Requests all message history under parameters roomname and channelname. 
Under socket name: gethistory

Ons:
onMessage: Observable, when socket room receives a message this socket will record it. 
Under socket name: message

recMessages: gets message history from socket room. 
Under socket name: gethistory

RoomService
http://localhost:3000/room

Has several socket emits, and socket ons

Emits:
reqRooms: requests rooms for user based on user id.
Under socket name: rooms

joinRoom: emits room to be joined, and the user joining.
Under socket name: joinroom

createRoom: creates a new room, and adds the user who created it to the user list
Under socket name: createroom

createChannel: creates a new channel for the current room called
Under socket name: createchannel

removeRoom: removes a room based off the roomname
Under socket name: removeroom

removeChannel: removes a channel based off of the room and channel names
Under socket name: removechannel

reqUsers: requests all users
Under socket name: getusers

reqRoomUsers: requests users that are in this room
Under socket name: getroomusers

addRoomUser: adds a user based off roomname, and gives them a user role for the room.
Under socket name: addroomuser

removeRoomUser: removes user with userid from room roomname
Under socket name: removeroomuser

reqChannelUsers: sends request for channel users
Under socket name: getchannelusers

addChannelUser: removes a user from the excluded list of a channel
Under socket name: addchanneluser

removeChannelUser: adds a user to the excluded list of a channel
Under socket name: removechanneluser

Ons:
getRooms: gets rooms pushes to function
Under socket name: rooms

joinedRoom: gets room information, which has been edited based on user permissions/channel exclusions.
Under socket name: joinroom



AssisStatus: returns whether the user is a groupAssis for the current group. this changes what html will be viewable for the user.
Under socket name: assisstatus

getUsers: returns all users as an object array.
Under socket name: getusers

getRoomUsers: returns the users in this room, their ids, and names.
Under socket name: getroomusers


Angular Architecture
Components
Appcomponent
Contains the HTML for the header navbar and the logic for displaying the loggedIn status.
RoomComponent
Contains the bulk of the application. This component is linked to the roomService service.
This component contains functionality for the following:
-	Room(group) creation/deletion
-	Channel creation/deletion
-	User invitation/removal from rooms (groups)
-	User invitation/removal from channels
-	Entering a room (groups) channel.
-	Links to creation/editing of users.

LoginComponent

Contains the Form for logging into the application, and storing user data in session storage, if the data is correct.

CreateUserComponent

Contains the forms for both creating a new user, and editing an existing user. The forms allow users to change information based on their permissions. E.g. a user without Super admin will not be able to create a user with superadmin, or update a user to have superadmin.

ChatComponent

Gets message history for the socket room the user has entered, and allows the user to send/receive messages to that socket channel. Messages contain the message contents as well as the username of the person who sent it.

Models

There are three model classes in the Chat application.

LoginAttempt
    public username: string;
    public password: string;
this class ensures the types of parameters being parsed as login details.

Message
    public message: string;
    public user: string;
This class ensures the types of parameters being parsed as a message

NewUser
    public username:string;
    public email:string;
    public password:string;
    public role:string;
This class ensures the types of parameters being parsed as a new user.
