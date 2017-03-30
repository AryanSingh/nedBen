/**
	* Updated by Invetech Solutions on 28/09/2016.
	*/
	module nedben.directives.UserOfferDirective {
		'use strict';
		import IUser = nedben.interfaces.IUser;
		class UserOfferDirective implements ng.IDirective {
			restrict = 'E';
			controller = UserOfferDirectiveController;
			controllerAs = 'useroffer';
			bindToController = true;
			templateUrl = 'scripts/directives/profile-lists/partials/user-offer.html';
			scope = {
				offerObject: '=',
			};
			static factory():ng.IDirectiveFactory {
				const directive = () => new UserOfferDirective();
				return directive;
			}
		}
		class UserOfferDirectiveController {
			static $inject = ['$log', 'session', '$http', 'ENV', 'ADVICE_MANAGEMENT_URLS' ,'AUTHURLS','OFFER_MANAGEMENT_URLS','$location', '$timeout', '$rootScope','USER_MANAGEMENT','IMAGES_URLS'];
			private $log:ng.ILogService;
			private session:any;
			private $http:ng.IHttpService;
			private ENV:any;
			private ADVICE_MANAGEMENT_URLS:any;
			private AUTHURLS:any;
			private OFFER_MANAGEMENT_URLS:any; 
			private USER_MANAGEMENT:any; 
			private IMAGES_URLS:any;
			private $location:ng.ILocationService;
			private $timeout:ng.ITimeoutService;
			private $rootScope:ng.IRootScopeService;
			private offerObject:any;   
			private user:IUser;
			private loggedUserId:number;
			private offerType:any;
			private offerData:{};
			private loading:boolean;
			private loggedUser:any={};
			constructor($log:ng.ILogService, session:any, $http:ng.IHttpService, ENV:any,ADVICE_MANAGEMENT_URLS:any,AUTHURLS:any,OFFER_MANAGEMENT_URLS:any, $location:ng.ILocationService,
				$timeout:ng.ITimeoutService, $rootScope:ng.IRootScopeService,USER_MANAGEMENT:any,IMAGES_URLS:any) {
				this.$log = $log;
				this.$http = $http;
				this.ENV = ENV;
				this.loading = true;
				this.USER_MANAGEMENT=USER_MANAGEMENT;
				this.ADVICE_MANAGEMENT_URLS=ADVICE_MANAGEMENT_URLS;
				this.OFFER_MANAGEMENT_URLS=OFFER_MANAGEMENT_URLS;
				this.AUTHURLS=AUTHURLS;
				this.$rootScope = $rootScope;
				this.IMAGES_URLS=IMAGES_URLS;
				this.session=session;
				// this.$rootScope.$broadcast('checkSession');
				this.user = this.session.getUserData() ? this.session.getUserData() : {};
				this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0; 
				this.$location = $location;
				this.$timeout = $timeout;				
				this.offerType=this.offerObject.type;  
				console.log()
				this.getOfferFullDeatil();
			}
			getOfferFullDeatil(){
				this.loggedUser=this.session.getLoggedUserData(); 
				if(this.offerObject.type==='OFFER' || this.offerObject.type==='OFFERSAVE'){
					let getOfferAPI = this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.OFFER_DETAIL;
					this.$http.post(getOfferAPI,{idOffer: this.offerObject.x.id,idLoggedUser: this.loggedUserId},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {	
							if(data){	
									if(this.loggedUserId===data['user'].id){
										data['notifyActive']=this.offerObject.x.notifyActive;
									}else{
										data['notifyActiveUserLogged']=this.offerObject.x.notifyActiveUserLogged;
									}									
									this.offerData=data;
							}
							
						});
				}else if(this.offerObject.type==='FORUM' || this.offerObject.type==='FORUMSAVE'){
					let getFourmApi= this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.GET_DETAIL;
					this.$http.post(getFourmApi,{idForum: this.offerObject.x.id,idLoggedUser: this.loggedUserId},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							data['notifyActiveUserLogged']=this.offerObject.x.notifyActiveUserLogged;
									this.offerData=data;
						});
				}else {
					let getUserApi= this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL;
					this.$http.post(getUserApi,{idUser: this.offerObject.x,idLoggedUser: this.loggedUserId},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							this.offerData=data;
						});
				}
				
			}

			removeNotification(){
				if(this.loggedUserId > 0){
				if(this.offerObject.type==='OFFERSAVE'){
					let getOfferAPI = this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.REMOVE_SAVE_OFFER;
					this.$http.put(getOfferAPI,{idOffer: this.offerObject.x.id,idUser: this.loggedUserId},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							angular.element('.offer-'+this.offerObject.x.id).remove();
							toastr.success('Offer Remove succssfully');
							this.$rootScope.$broadcast('Update-User');
						})
					.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
				}else if(this.offerObject.type==='FORUMSAVE'){
					let getFourmApi= this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.REMOVE_SAVE_FORUM;
					this.$http.put(getFourmApi,{idForum: this.offerObject.x.id,idUser: this.loggedUserId},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							angular.element('.offer-'+this.offerObject.x.id).remove();
							toastr.success('Forum Remove succssfully');
							this.$rootScope.$broadcast('Update-User');
						}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

				} else if(this.offerObject.type==='FORUM'){
					if(this.loggedUserId===this.offerData['user'].id){
						this.offerData['notifyActive']=this.offerData['notifyActive']===true ? false : true;
					let getFourmApi= this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.DEACIVE_NOTIFY;
					this.$http.put(getFourmApi,{id: this.offerObject.x.id,user: this.user, notifyActive:this.offerData['notifyActive']},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							toastr.success('Action save successfully');
							this.$rootScope.$broadcast('Update-User');
						}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

					}else{
						if(this.offerData['notifyActiveUserLogged']==true){
								let getFourmApi= this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.REMOVE_SAVE_FORUM;
							this.$http.put(getFourmApi,{idForum: this.offerObject.x.id,idUser: this.loggedUserId},
								{headers: {'Content-Type': 'application/json'}})
								.success(
									(data, status) => {
										toastr.success('Forum Remove succssfully');
										this.offerData['notifyActiveUserLogged']=false;
									}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
							}else{
						let getFourmApi= this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.SAVE_FORUM;
					this.$http.put(getFourmApi,{idForum: this.offerObject.x.id,idUser: this.loggedUserId},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							this.offerData['notifyActiveUserLogged']=true;
							toastr.success('Forum save successfully');
							this.$rootScope.$broadcast('Update-User');
						}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
					}
					}
				} else if(this.offerObject.type==='OFFER'){
						if(this.loggedUserId===this.offerData['user'].id){
							this.offerData['notifyActive']=this.offerData['notifyActive']===true ? false : true;
					let getFourmApi= this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.DEACIVE_NOTIFY;
					this.$http.put(getFourmApi,{id: this.offerObject.x.id,user: this.user, notifyActive:this.offerData['notifyActive']},
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {
							toastr.success('Action save successfully');
							this.$rootScope.$broadcast('Update-User');
						}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
						}else{
							if(this.offerData['notifyActiveUserLogged']==true){
								let getOfferAPI = this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.REMOVE_SAVE_OFFER;
								this.$http.put(getOfferAPI,{idOffer: this.offerObject.x.id,idUser: this.loggedUserId},
									{headers: {'Content-Type': 'application/json'}})
								.success(
									(data, status) => {
										toastr.success('Offer Remove succssfully');
										this.offerData['notifyActiveUserLogged']=false;
									})
								.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
							}else{
								let getFourmApi= this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.SAVE_OFFER;
								this.$http.put(getFourmApi,{idOffer: this.offerObject.x.id,idUser: this.loggedUserId},
								{headers: {'Content-Type': 'application/json'}})
								.success(
									(data, status) => {
										this.offerData['notifyActiveUserLogged']=true;
										toastr.success('Offer save successfully');
										this.$rootScope.$broadcast('Update-User');
									}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
							}
						
					}
					

				}else {
					let getUserApi= null;
					let postData={};
					if(this.offerObject.type==='USERFOLLOW'){
						getUserApi= this.ENV.apiBasePath + this.USER_MANAGEMENT.REMOVE_FOLLOW_USER_URL;
						postData={idUser: this.loggedUserId,idUserFollowed: this.offerObject.x};
					}else{
						getUserApi= this.ENV.apiBasePath + this.USER_MANAGEMENT.REMOVE_IGNORE_USER_URL;
						postData={idUser: this.loggedUserId,idUserIgnored: this.offerObject.x};
					}
					this.$http.post(getUserApi,postData,
						{headers: {'Content-Type': 'application/json'}})
					.success(
						(data, status) => {	
							angular.element('.user-'+this.offerObject.x).remove();
							toastr.success('Delete user in your profile..');
							this.$rootScope.$broadcast('Update-User');
						}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});				
				}

				}else{
					this.$rootScope.$broadcast('Auth-openModal');
				}
			}



			}
			angular.module('nedben.directives').directive('useroffer', UserOfferDirective.factory());
		}
