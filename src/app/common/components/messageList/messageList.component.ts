import { Component, Input, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ENV, IMAGES_URLS, MESSAGE_MANAGEMENT, AUTHURLS }  from '../../../app.constant';
import { SessionService } from '../../sessionService';
import { IUser } from '../../interfaces/user';
import forEach from 'lodash/forEach';


@Component({
  selector: 'messageList',
  templateUrl: './messageList.html',
  styleUrls: ['./messageList.scss']
})
export class FooterComponent implements OnInit {
	 
	 private ENV:any;
	 private MESSAGE_MANAGEMENT:any;
	 private AUTHURLS:any;
	 private IMAGES_URLS:any;
	 private loggedUserId:number;
	 private messagesList:any ;
	 private user:any={};
	 private userReciver:any={};
	 private messageTrail:any;
	 private idMessagesArr: any;
	 private showMessageList:boolean;
	 private otherUserId:number;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
		 this.ENV = ENV;
		 this.session=session;
		 this.AUTHURLS=AUTHURLS;       
		 // this.$location = $location;
		 // this.$timeout = $timeout;
		 this.IMAGES_URLS=IMAGES_URLS;
		 this.MESSAGE_MANAGEMENT=MESSAGE_MANAGEMENT;
		 this.user= this.session.getUserData()?this.session.getUserData() : {};
		 this.idMessagesArr=[];
		 // this.otherUserId=$stateParams.userId!==undefined ? $stateParams.userId : 0;
		 this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;
		//  if($stateParams.userId){
		// 	if(this.user.id === parseInt($stateParams.userId)) {	
		// 		this.showMessageList=true;
		// 		this.getMessageLists();	 
		// 	}else{
		// 		this.showMessageList=false;
		// 		this.getUserDeatil($stateParams.userId); 
		// 	}           	
		// }else{
		// 	this.showMessageList=true;
		// 	this.getMessageLists();  
		// }
		// this.$scope.$on('updateMessageTrail',(evt, val,userId)=> {
		// 	if($stateParams.userId){
		// 		this.getUserDeatil($stateParams.userId); 
		// 	}else{
		// 				this.getUserDeatil(userId); 	
		// 	}	
		
		// });
		// this.$scope.$on('div-refresh', (evt, val) => {
		// 	this.showMessageList=true;
		// });
    }
    getMessageLists(){
    	let headers = new Headers();
        headers.append('Content-Type', 'application/json');
		this.http.post(this.ENV.apiBasePath+this.MESSAGE_MANAGEMENT.GET_DETAIL,
			{idUser:this.user.id},headers)
		.subscribe((data)=>{
			this.messagesList=data;
		},
		(err)=>{
			// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
		});
 	}

	replyMessage(selectedData){		 
		if(this.showMessageList){
			if(selectedData['otherUser']){
				this.userReciver=selectedData['otherUser'];
				this.showMessageList=false;
			}				
		}
		if(this.loggedUserId > 0) {
			let loggedUser=this.user.id;
			let tempIdArr = [];		 	
			this.http.post(this.ENV.apiBasePath+this.MESSAGE_MANAGEMENT.GET_MESSAGES,
				{idUserLogged:this.user.id, idOtherUser:this.userReciver.id},{headers:{'Content-Type':'application/json'}})
			.subscribe((data)=>{
				this.messageTrail=data;	
				forEach(this.messageTrail,function(val,key){
					if(!val.read){
						if(loggedUser === val.userReceiver.id) {
							tempIdArr.push(val.idMessage);
							val.read=true;
						}
					}
				});
				if(tempIdArr.length > 0) {
					this.idMessagesArr=tempIdArr;
					this.setMessageRead(selectedData);
				}		 					 				
			},
			(err)=>{
				// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
			});
		}
	}

	setMessageRead(data){
		if(this.loggedUserId > 0){
			this.http.put(this.ENV.apiBasePath+this.MESSAGE_MANAGEMENT.SET_READ_MESSAGE,
				{idMessages:this.idMessagesArr, idUser:this.user.id},{headers:{'Content-Type':'application/json'}})
			.subscribe((data)=>{
				this.idMessagesArr=null;
				this.getMessageLists();	
				// this.$rootScope.$broadcast('Update-unreadCount','true');	 				
			},
			(err)=>{
				// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
			});
		}else {
			// this.$rootScope.$broadcast('Auth-openModal');
		}
	}

	returnPage(){
	 	if(this.otherUserId > 0){
			window.location.reload();
	 	}else{
			// this.$rootScope.$broadcast('showDiv','false' );
	 	}
	 	
	}
}
 