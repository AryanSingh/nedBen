/**
 * Created by Hyperlink on 15/04/16.
 */
 module topnavbarDirective {
	'use strict';
	import IUser = nedben.interfaces.IUser;

	class TopnavbarDirective implements ng.IDirective {
		restrict = 'E';
		controller = TopnavbarDirectiveController;
		controllerAs = 'topNavBar';
		bindToController = true;
		templateUrl = 'scripts/directives/topnavbar/partials/topnavbar.html';
		scope = true;
		static factory():ng.IDirectiveFactory {
			const directive = () => new TopnavbarDirective();
			return directive;
		}
	}

	class TopnavbarDirectiveController {
		static $inject = ['$log', '$http', 'session', 'AUTHURLS', 'ENV', '$scope', '$state', '$websocket', 'notifications', '$sce','$interval','NOTICE_MANAGEMENT','$location','$rootScope','BADGE_MANAGEMENT','IMAGES_URLS'];
		private $log:ng.ILogService;
		private $http:ng.IHttpService;
		private ENV:any;
		private AUTHURLS:any;
		private userLogged:IUser;
		private session:any;
		private scope:ng.IScope;
		private $state:ng.ui.IStateService;
		private $location:ng.ILocationService;
		private IMAGES_URLS:any;
		private BADGE_MANAGEMENT:any;
		private $websocket:any;
		private notifications:any;
		private $sce:ng.ISCEService;
		private userData:any;
		private NOTICE_MANAGEMENT:any;
		private $interval:ng.IIntervalService;
		private $rootScope:ng.IRootScopeService;
		private noticeList:any;
		private scrollStatus:boolean;
		private noticePaginationstart:number;
		private unreadNotice:any;
		private socketData:any;
		private unreadMsg:any;
		private noticeIdArr:any;
		private showMore:boolean;

		constructor($log:ng.ILogService, $http:ng.IHttpService, session, AUTHURLS, ENV, $scope:ng.IScope, $state:ng.ui.IStateService,
			$websocket:any, notifications:any, $sce:ng.ISCEService,$interval:ng.IIntervalService,NOTICE_MANAGEMENT:any,$location:ng.ILocationService,$rootScope:ng.IRootScopeService,BADGE_MANAGEMENT:any,IMAGES_URLS:any) {
			this.$log = $log;
			this.$http = $http;
			this.ENV = ENV;
			this.AUTHURLS = AUTHURLS;
			this.session = session;
			this.userData
			this.scope = $scope;
			this.showMore=true;
			this.$state = $state;
			this.IMAGES_URLS=IMAGES_URLS;
			this.noticeList=[];
			this.$rootScope=$rootScope;
			this.$location=$location;
			this.$websocket = $websocket;
			this.notifications = notifications;
			this.NOTICE_MANAGEMENT=NOTICE_MANAGEMENT;
			this.BADGE_MANAGEMENT=BADGE_MANAGEMENT;
			this.noticeIdArr=[];
			this.scrollStatus=false;
			this.$sce = $sce;
			this.noticePaginationstart=0;
			window.localStorage.setItem('unread-Msg','false');
			let checkUserInfo= () => {
				this.userData=this.session.getUserData() ? this.session.getUserData() : {};   			     
			};
			this.checkSession();
			checkUserInfo();
			$interval(checkUserInfo, 1000);
			this.scope.$on('checkSession', (event, data) => {
				this.checkSession();
			});
			this.scope.$on('Update-unreadCount',(event,val)=>{
				this.getUnreadCount();
			});
			if(this.session.getUserData()){
				this.getUnreadCount();
			}			
		}
		checkSession() {
			if (this.session.getUserData() === undefined) {
				this.$http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER,
					{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.success(
					(data, status) => {
						this.session.setUserData(data);
						this.userData=data;
						this.getUnreadCount();	
						this.userLogged = this.session.getUserData();
					})
				.error(
					(error) => {
						if (error.errorMessage === 'No logged user found') {
						}
					});
					} else {
						this.userLogged = this.session.getUserData();
					}
			}

		logout() {
			this.$http.get(this.ENV.authBasePath + this.AUTHURLS.LOGOUT,
			{})
			.finally(
				() => {
					this.session.setUserData(undefined);
					if(this.$state.current.name==='index'){
						this.$state.reload();
					}else{
						this.$state.go('index');
					}
				});
		}




		getNotice(){
			this.$http.post(this.ENV.apiBasePath+this.NOTICE_MANAGEMENT.GET_NOTICE,
				{ idUser: this.userData.id,startFrom: this.noticePaginationstart,numRows: 5 },{headers:{'Content-Type':'application/json'}})
			.success((data,status)=>{
				if(Object.keys(data).length > 0){
					for (var i = 0; i < Object.keys(data).length; i++) {
							this.noticeList.push(data[i]);
							this.noticePaginationstart++;
					}
				}else{
					this.showMore=false;
				}
			})
			.error((err)=>{
				console.log(err);
			});
		}

		getUnreadCount(){
			this.$http.post(this.ENV.apiBasePath+this.NOTICE_MANAGEMENT.GET_COUNT_NOTICE,
				{ id: this.userData.id },{headers:{'Content-Type':'application/json'}})
			.success((data,status)=>{
				this.unreadNotice=data['unreadNotices'];
				this.unreadMsg=data['unreadMessages'];
			})
			.error((err)=>{
				console.log(err);
			});
		}

		setRead(noticeObject){
			if(!noticeObject['readed']){
				this.$http.post(this.ENV.apiBasePath+this.NOTICE_MANAGEMENT.NOTICE_AS_READ,
					{ idNotice: noticeObject['idNotice']},{headers:{'Content-Type':'application/json'}})
				.success((data,status)=>{
					
					this.getUnreadCount();
				})
				.error((err)=>{
					console.log(err);
				});
			}	
		}

		changeUrl(){
				if(this.$location.path()==='/profile'){
					window.location.reload();
				}else{
					this.$location.path('profile');
				}
		}

		goToProfile(){
			window.localStorage.setItem('unread-Msg','true');
			this.$location.path('profile');
		}

	}

	angular.module('nedben.directives').directive('topnavbar', TopnavbarDirective.factory());
 }
