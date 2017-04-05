import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { THREAD_MANAGEMENT_URLS, ENV}  from '../../../app.constant';
import { SessionService } from '../../sessionService';

@Component({
  selector: 'messageList',
  templateUrl: './messageList.html',
  styleUrls: ['./messageList.scss']
})
export class FooterComponent implements OnInit {
    private ENV:any;
    private THREAD_MANAGEMENT_URLS:any;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
        this.ENV = ENV;
        this.THREAD_MANAGEMENT_URLS = THREAD_MANAGEMENT_URLS;
    }
}
 module nedben.directives.MessageListsDirective {
	 'use strict';
	 import IUser = nedben.interfaces.IUser;
	 class MessageListsDirective implements ng.IDirective {
		 restrict = 'E';
		 controller = MessageListsDirectiveController;
		 controllerAs = 'messageLists';
		 bindToController = true;		 
		 templateUrl = 'scripts/directives/message-list/partials/message-list.html';
		 static factory():ng.IDirectiveFactory {
			 const directive = () => new MessageListsDirective();
			 return directive;
		 }
	 }
	 class MessageListsDirectiveController {
		 static $inject = ['$log', '$scope', 'session', '$http', 'ENV','$location', '$timeout', '$rootScope','$stateParams','IMAGES_URLS','MESSAGE_MANAGEMENT','AUTHURLS'];
		 private $log:ng.ILogService;
		 private session:any;
		 private $http:ng.IHttpService;
		 private ENV:any;
		 private $location:ng.ILocationService;
		 private $timeout:ng.ITimeoutService;
		 private $rootScope:ng.IRootScopeService;
		 private MESSAGE_MANAGEMENT:any;
		 private AUTHURLS:any;
		 private IMAGES_URLS:any;
		 private $scope: ng.IScope;
		 private loggedUserId:number;
		 private messagesList:any ;
		 private user:any={};
		 private userReciver:any={};
		 private messageTrail:any;
		 private idMessagesArr: any;
		 private showMessageList:boolean;
		 private otherUserId:number;
		 constructor($log:ng.ILogService,$scope: ng.IScope, session:any, $http:ng.IHttpService, ENV:any,$location:ng.ILocationService,
			 $timeout:ng.ITimeoutService, $rootScope:ng.IRootScopeService,$stateParams:any,IMAGES_URLS:any,MESSAGE_MANAGEMENT:any,AUTHURLS:any) {
			 this.$log = $log;
			 this.$http = $http;
			 this.ENV = ENV;
			 this.session=session;
			 this.$scope=$scope;
			 this.AUTHURLS=AUTHURLS;       
			 this.$location = $location;
			 this.$timeout = $timeout;
			 this.IMAGES_URLS=IMAGES_URLS;
			 this.MESSAGE_MANAGEMENT=MESSAGE_MANAGEMENT;
			 this.$rootScope = $rootScope; 
			 this.user= this.session.getUserData()?this.session.getUserData() : {};
			 this.idMessagesArr=[];
			 this.otherUserId=$stateParams.userId!==undefined ? $stateParams.userId : 0;
			 this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;
			 if($stateParams.userId){
				if(this.user.id === parseInt($stateParams.userId)) {	
					this.showMessageList=true;
					this.getMessageLists();	 
				}else{
					this.showMessageList=false;
					this.getUserDeatil($stateParams.userId); 
				}           	
			}else{
				this.showMessageList=true;
				this.getMessageLists();  
			}
			this.$scope.$on('updateMessageTrail',(evt, val,userId)=> {
				if($stateParams.userId){
					this.getUserDeatil($stateParams.userId); 
				}else{
							this.getUserDeatil(userId); 	
				}	
			
			});
			this.$scope.$on('div-refresh', (evt, val) => {
				this.showMessageList=true;
			});
		 }

		 getUserDeatil(userId){
				 this.$http.post(this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL,{idUser: userId,idLoggedUser: this.loggedUserId},
					{ headers: {'Content-Type': 'application/json'} })
					.success(
						(data, status) => {
							this.userReciver=data['user'];
							this.replyMessage(data['user']);         
						});
		 }

		 getMessageLists(){
				this.$http.post(this.ENV.apiBasePath+this.MESSAGE_MANAGEMENT.GET_DETAIL,
					{idUser:this.user.id},{headers:{'Content-Type':'application/json'}})
				.success((data)=>{
						this.messagesList=data;
				})
				.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
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
			this.$http.post(this.ENV.apiBasePath+this.MESSAGE_MANAGEMENT.GET_MESSAGES,
					{idUserLogged:this.user.id, idOtherUser:this.userReciver.id},{headers:{'Content-Type':'application/json'}})
				.success((data)=>{
					this.messageTrail=data;	
					angular.forEach(this.messageTrail,function(val,key){
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
				})
				.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
			}
		 }

		 setMessageRead(data){
			if(this.loggedUserId > 0){
				this.$http.put(this.ENV.apiBasePath+this.MESSAGE_MANAGEMENT.SET_READ_MESSAGE,
					{idMessages:this.idMessagesArr, idUser:this.user.id},{headers:{'Content-Type':'application/json'}})
				.success((data)=>{
						this.idMessagesArr=null;
						this.getMessageLists();	
						this.$rootScope.$broadcast('Update-unreadCount','true');	 				
				})
				.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
			}else {
				this.$rootScope.$broadcast('Auth-openModal');
			}
		 }

		 returnPage(){
		 	if(this.otherUserId > 0){
				window.location.reload();
		 	}else{
				this.$rootScope.$broadcast('showDiv','false' );
		 	}
		 	
		 	
		 }


		};
		 angular.module('nedben.directives').directive('messageLists', MessageListsDirective.factory());
	 }