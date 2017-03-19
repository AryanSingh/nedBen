/**
 * Created by Invetech Solutions on 20/10/16.
 */

  
export class TimeFactory {
  private seconds:any;
  private interval:any;
  private day:any;
  
  static factory() {
    const factory = () => new TimeFactory();
    return factory;
  }

  getTimeSince(date) {
      this.seconds = Math.floor((+new Date() - date) / 1000);
      this.interval = Math.floor(this.seconds / 1);
     if(this.interval < 60){
       return this.interval+ " seconds ago";
     } else  {
       this.interval = Math.floor(this.seconds / 60);
       if(this.interval > 60){
         this.interval = Math.floor(this.seconds / 3600);
         if(this.interval < 24){
           return this.interval + " hours ago."; 
         }else{  
           this.day=Math.floor(this.interval/24);
           return  this.day+ " giorni fa";
         } 
       }else{
         return this.interval + " minutes ago";
       }

     }     
   }

}

 
