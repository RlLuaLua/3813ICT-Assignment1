export class Message {
    public message: string;
    public user: string;
    //public profile: any;

    constructor(message: string, user: string/*, profile: any*/){
        this.message = message;
        this.user = user;
        //this.profile = profile;
    }
}
