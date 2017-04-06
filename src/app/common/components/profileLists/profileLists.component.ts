import { Component, Input, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AUTHURLS, OFFER_MANAGEMENT_URLS, ENV}  from '../../../app.constant';
import { SessionService } from '../../sessionService';
import { IUser } from '../../interfaces/user';


@Component({
  selector: 'profileLists',
  templateUrl: './profileLists.html',
  styleUrls: ['./profileLists.scss']
})
export class ProfileListsComponent implements OnInit {
    
	private ENV:any;
	private AUTHURLS:any;
	private OFFER_MANAGEMENT_URLS:any;  
	private userId:number;
	private loggedUserId:number;
	private profileData:{};
	private user:IUser;
	private currentTab:any;
	private tepmpArr:any=[];

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
		this.ENV = ENV;
		this.OFFER_MANAGEMENT_URLS=OFFER_MANAGEMENT_URLS;
		this.AUTHURLS=AUTHURLS;
		this.user = session.getUserData(); 
		this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
 	// 	if(this.$stateParams.userId){
		// 	this.userId=this.$stateParams.userId;
		// }else{
		// 	this.userId=this.loggedUserId;
		// }
		// this.$scope.$on('Update-User',(evt, val)=> {				
		// 	this.getUserFullDetail();
		// }); 
		if(!this.session.getUserData()){
			this.checkLogin();
		}else{
			this.getUserFullDetail();
		}
    }
    initVar(){
	 	this.user = this.session.getUserData(); 
		this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
		// if(this.$stateParams.userId){
		// 	this.userId=this.$stateParams.userId;
		// }else{
		// 	this.userId=this.session.getUserData().id;
		// }
		if(this.userId > 0){
			this.getUserFullDetail();
		}						
	}

	checkLogin(){
		let headers = new Headers();
        headers.append('Content-Type': 'application/x-www-form-urlencoded');
		this.http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER,
			headers)
		.subscribe(
			(data) => {						
				this.session.setUserData(data);
				this.initVar();						
			},
			(error) => {
				this.loggedUserId=0;
			});
	}


		getUserFullDetail(){ 
		 	if(this.userId > 0){
		 		let headers = new Headers();
        		headers.append('Content-Type': 'application/json');
		 		this.http.post(this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL,{idUser: this.userId,idLoggedUser: this.loggedUserId},
				 headers)
					.subscribe(
						 (data) => {
							 this.profileData=data;
							 this.session.setLoggedUserData(this.profileData);
							 this.getList();
						 },
						(err)=>{
							// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
						});
			}
			 
		}

		resetValues(){
			this.tepmpArr=[];
			this.getList();
		}

		getList(){
			if(this.profileData){
				var startIndex=this.tepmpArr.length;
				if(this.currentTab===1){           
					for (var i = 0; i < 10; i++) {
						if(this.profileData['offersCreated'][startIndex]){
							this.tepmpArr.push(this.profileData['offersCreated'][startIndex]);
							startIndex++; 
						}             
					}                       
				}else if(this.currentTab===2){
					for (var i = 0; i < 10; i++) {
						if(this.profileData['forumsCreated'][startIndex]){
						this.tepmpArr.push(this.profileData['forumsCreated'][startIndex]);
						 startIndex++; 
						} 
					}

				}else if(this.currentTab===3){
					for (var i = 0; i < 10; i++) {
						if(this.profileData['usersFollowed'][startIndex]){
						this.tepmpArr.push(this.profileData['usersFollowed'][startIndex]);
						 startIndex++; 
						} 
					}

				}else if(this.currentTab===4){
					for (var i = 0; i < 10; i++) {
						if(this.profileData['offersSaved'][startIndex]){
						this.tepmpArr.push(this.profileData['offersSaved'][startIndex]);
						 startIndex++; 
						} 
					}

				}else if(this.currentTab===5){
					for (var i = 0; i < 10; i++) {
						if(this.profileData['forumsSaved'][startIndex]){
						this.tepmpArr.push(this.profileData['forumsSaved'][startIndex]);
						 startIndex++; 
						}
					}

				}else{
					for (var i = 0; i < 10; i++) {
						 if(this.profileData['usersIgnored'][startIndex]){
						this.tepmpArr.push(this.profileData['usersIgnored'][startIndex]);
						startIndex++; 
						}
					}

				}
			}
			
		}
}
 // module nedben.directives.ProfileListsDirective {
	//  'use strict';
	//  import IUser = nedben.interfaces.IUser;
	//  class ProfileListsDirective implements ng.IDirective {
	// 	 restrict = 'E';
	// 	 controller = ProfileListsDirectiveController;
	// 	 controllerAs = 'profileLists';
	// 	 bindToController = true;
	// 	 templateUrl = 'scripts/directives/profile-lists/partials/profile-lists.html';
	// 	 static factory():ng.IDirectiveFactory {
	// 		 const directive = () => new ProfileListsDirective();
	// 		 return directive;
	// 	 }
	//  }
	//  class ProfileListsDirectiveController {
	// 	 static $inject = ['$log', 'session', '$http', 'ENV','AUTHURLS','OFFER_MANAGEMENT_URLS','$location', '$timeout', '$rootScope','$stateParams','$scope'];
	// 	 private $log:ng.ILogService;
	// 	 private session:any;
	// 	 private $http:ng.IHttpService;
	// 	 private ENV:any;
	// 	 private $scope:ng.IScope;
	// 	 private AUTHURLS:any;
	// 	 private OFFER_MANAGEMENT_URLS:any;  
	// 	 private $location:ng.ILocationService;
	// 	 private $timeout:ng.ITimeoutService;
	// 	 private $rootScope:ng.IRootScopeService;
	// 	 private userId:number;
	// 	 private loggedUserId:number;
	// 	 private profileData:{};
	// 	 private user:IUser;
	// 	 private currentTab:any;
	// 	 	private $stateParams:any;
	// 	 private tepmpArr:any=[];
	// 	 constructor($log:ng.ILogService, session:any, $http:ng.IHttpService, ENV:any,AUTHURLS:any,OFFER_MANAGEMENT_URLS:any, $location:ng.ILocationService,
	// 		 $timeout:ng.ITimeoutService, $rootScope:ng.IRootScopeService,$stateParams:any,$scope:ng.IScope) {
	// 		 this.$log = $log;
	// 		 this.$http = $http;
	// 		 this.ENV = ENV;
	// 		 this.$scope=$scope;
	// 		 this.$rootScope = $rootScope; 
	// 		 this.OFFER_MANAGEMENT_URLS=OFFER_MANAGEMENT_URLS;
	// 		 this.session=session;
	// 		 this.AUTHURLS=AUTHURLS;
	// 		 this.$stateParams=$stateParams;
	// 		 this.user = session.getUserData(); 
	// 		 this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
	// 		 this.$location = $location;
	// 		 this.$timeout = $timeout;
	// 		 		 if(this.$stateParams.userId){
	// 					this.userId=this.$stateParams.userId;
	// 					}else{
	// 					this.userId=this.loggedUserId;
	// 					}
	// 		this.$scope.$on('Update-User',(evt, val)=> {				
	// 						this.getUserFullDetail();
	// 					}); 
	// 		if(!session.getUserData()){
	// 			this.checkLogin();
	// 		}else{
	// 			this.getUserFullDetail();
	// 		}
	// 	 }

	// 	initVar(){
	// 	 	this.user = this.session.getUserData(); 
	// 		this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
	// 		if(this.$stateParams.userId){
	// 			this.userId=this.$stateParams.userId;
	// 		}else{
	// 			this.userId=this.session.getUserData().id;
	// 		}
	// 		if(this.userId > 0){
	// 			this.getUserFullDetail();
	// 		}						
	// 	}

	// 	checkLogin(){
	// 		this.$http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER,
	// 			{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
	// 		.success(
	// 			(data, status) => {						
	// 				this.session.setUserData(data);
	// 				this.initVar();						
	// 			})
	// 		.error((error) => {
	// 			this.loggedUserId=0;
	// 		});
	// 	}


	// 	getUserFullDetail(){ 
	// 	 	if(this.userId > 0){
	// 	 		this.$http.post(this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL,{idUser: this.userId,idLoggedUser: this.loggedUserId},
	// 			 {headers: {'Content-Type': 'application/json'}})
	// 				.success(
	// 					 (data, status) => {
	// 						 this.profileData=data;
	// 						 this.session.setLoggedUserData(this.profileData);
	// 						 this.getList();
	// 					 })
	// 				 error((err)=>{
	// 								toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
	// 						});
	// 		}
			 
	// 	}

	// 	resetValues(){
	// 		this.tepmpArr=[];
	// 		this.getList();
	// 	}

	// 	getList(){
	// 		if(this.profileData){
	// 			var startIndex=this.tepmpArr.length;
	// 			if(this.currentTab===1){           
	// 				for (var i = 0; i < 10; i++) {
	// 					if(this.profileData['offersCreated'][startIndex]){
	// 						this.tepmpArr.push(this.profileData['offersCreated'][startIndex]);
	// 						startIndex++; 
	// 					}             
	// 				}                       
	// 			}else if(this.currentTab===2){
	// 				for (var i = 0; i < 10; i++) {
	// 					if(this.profileData['forumsCreated'][startIndex]){
	// 					this.tepmpArr.push(this.profileData['forumsCreated'][startIndex]);
	// 					 startIndex++; 
	// 					} 
	// 				}

	// 			}else if(this.currentTab===3){
	// 				for (var i = 0; i < 10; i++) {
	// 					if(this.profileData['usersFollowed'][startIndex]){
	// 					this.tepmpArr.push(this.profileData['usersFollowed'][startIndex]);
	// 					 startIndex++; 
	// 					} 
	// 				}

	// 			}else if(this.currentTab===4){
	// 				for (var i = 0; i < 10; i++) {
	// 					if(this.profileData['offersSaved'][startIndex]){
	// 					this.tepmpArr.push(this.profileData['offersSaved'][startIndex]);
	// 					 startIndex++; 
	// 					} 
	// 				}

	// 			}else if(this.currentTab===5){
	// 				for (var i = 0; i < 10; i++) {
	// 					if(this.profileData['forumsSaved'][startIndex]){
	// 					this.tepmpArr.push(this.profileData['forumsSaved'][startIndex]);
	// 					 startIndex++; 
	// 					}
	// 				}

	// 			}else{
	// 				for (var i = 0; i < 10; i++) {
	// 					 if(this.profileData['usersIgnored'][startIndex]){
	// 					this.tepmpArr.push(this.profileData['usersIgnored'][startIndex]);
	// 					startIndex++; 
	// 					}
	// 				}

	// 			}
	// 		}
			
	// 	}
	// 	 };
	// 	 angular.module('nedben.directives').directive('profileLists', ProfileListsDirective.factory());
	//  }