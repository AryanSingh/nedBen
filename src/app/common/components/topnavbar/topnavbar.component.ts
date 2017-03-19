import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SEARCH_URLS, ENV, NOTICE_MANAGEMENT, BADGE_MANAGEMENT, IMAGES_URLS, AUTHURLS }  from '../../../app.constant';
import { ICategory } from '../../interfaces/offer';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../common/sessionService';

@Component({
  selector: 'topnavbar',
  templateUrl: './topnavbar.html',
  styleUrls: ['./topnavbar.scss']
})
export class TopNavbarComponent implements OnInit {
  
	private ENV:any;
	private AUTHURLS:any;
	private userLogged:IUser;
	private IMAGES_URLS:any;
	private BADGE_MANAGEMENT:any;
	private notifications:any;
	private userData:any;
	private NOTICE_MANAGEMENT:any;
	private noticeList:any;
	private scrollStatus:boolean;
	private noticePaginationstart:number;
	private unreadNotice:any;
	private socketData:any;
	private unreadMsg:any;
	private noticeIdArr:any;
	private showMore:boolean;

	constructor(
		private http: Http,
	    private session: SessionService 
	){};

	ngOnInit(): void {
	    this.ENV = ENV;
		this.AUTHURLS = AUTHURLS;
		// this.userData
		this.showMore=true;
		this.IMAGES_URLS=IMAGES_URLS;
		this.noticeList=[];
		// this.$websocket = $websocket;
		// this.notifications = notifications;
		this.NOTICE_MANAGEMENT=NOTICE_MANAGEMENT;
		this.BADGE_MANAGEMENT=BADGE_MANAGEMENT;
		this.noticeIdArr=[];
		this.scrollStatus=false;
		this.noticePaginationstart=0;
		window.localStorage.setItem('unread-Msg','false');
		let checkUserInfo= () => {
			this.userData=this.session.getUserData() ? this.session.getUserData() : {};   			     
		};
		this.checkSession();
		checkUserInfo();
		// $interval(checkUserInfo, 1000);
		// this.scope.$on('checkSession', (event, data) => {
		// 	this.checkSession();
		// });
		// this.scope.$on('Update-unreadCount',(event,val)=>{
		// 	this.getUnreadCount();
		// });
		if(this.session.getUserData()){
			this.getUnreadCount();
		}			
	}

	checkSession() {
		
		if (this.session.getUserData() === undefined) {
			this.http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER,
				{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.map(res => res.json())
				.subscribe(
					(data) => {
						this.session.setUserData(data);
						this.userData = data;
						this.getUnreadCount();
						this.userLogged = this.session.getUserData();
					},
					err => console.log("No logged user found")
				);
		} else {
			this.userLogged = this.session.getUserData();
		}
	}

	logout() {
		this.http.get(this.ENV.authBasePath + this.AUTHURLS.LOGOUT,{})
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.session.setUserData(undefined);
					// if(this.$state.current.name==='index'){
					// 	this.$state.reload();
					// }else{
					// 	this.$state.go('index');
					// }
				},
				err => console.log("Was not able to log out")
			)
	}


	getNotice(){
		this.http.post(this.ENV.apiBasePath+this.NOTICE_MANAGEMENT.GET_NOTICE,
			{ idUser: this.userData.id,startFrom: this.noticePaginationstart,numRows: 5 },{headers:{'Content-Type':'application/json'}})
			.map(res => res.json())
			.subscribe(
				(data) =>{
					if(Object.keys(data).length > 0){
						for (var i = 0; i < Object.keys(data).length; i++) {
								this.noticeList.push(data[i]);
								this.noticePaginationstart++;
						}
					}else{
						this.showMore=false;
					}
				},
				err => console.log('getNotice error');
			)
	}

	getUnreadCount(){
		this.http.post(this.ENV.apiBasePath+this.NOTICE_MANAGEMENT.GET_COUNT_NOTICE,
			{ id: this.userData.id },{headers:{'Content-Type':'application/json'}})
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.unreadNotice = data['unreadNotices'];
					this.unreadMsg = data['unreadMessages'];
				},
				err => console.log('error in getting UnreadCount')
			)
	}

	setRead(noticeObject){
		if(!noticeObject['readed']){
			this.http.post(this.ENV.apiBasePath+this.NOTICE_MANAGEMENT.NOTICE_AS_READ,
				{ idNotice: noticeObject['idNotice']},{headers:{'Content-Type':'application/json'}})
				.map(res => res.json())
				.subscribe(
					data => this.getUnreadCount(),
					err => console.log('error in setRead')
				)
		}	
	}

	// changeUrl(){
	// 		if(this.$location.path()==='/profile'){
	// 			window.location.reload();
	// 		}else{
	// 			this.$location.path('profile');
	// 		}
	// }

	// goToProfile(){
	// 	window.localStorage.setItem('unread-Msg','true');
	// 	this.$location.path('profile');
	// }
  
}

 
