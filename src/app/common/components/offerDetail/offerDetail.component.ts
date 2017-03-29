module nedben.directives.offerDetailDirective {
		'use strict';

		class OfferDetailDirective implements ng.IDirective {
				restrict = 'E';
				controller = OfferDetailDirectiveController;
				controllerAs = 'offerDetail';
				bindToController = true;
				templateUrl = 'scripts/directives/offer-detail/partials/offer-detail.html';
				scope = {
						offerId: '=',
				};

				static factory():ng.IDirectiveFactory {
						const directive = () => new OfferDetailDirective();

						return directive;
				}
		}

		class OfferDetailDirectiveController {
				static $inject = ['$log', '$http', 'ENV','AUTHURLS', 'OFFER_MANAGEMENT_URLS', 'IMAGES_URLS','USER_MANAGEMENT', 'session', '$rootScope','forumFactory','$location','ngMeta'];

				private $log:ng.ILogService;
				private $http:ng.IHttpService;
				private ENV:any;
				private OFFER_MANAGEMENT_URLS:any;
				private forumFactory:any;
				private IMAGES_URLS:any;
				private AUTHURLS:any;
				private USER_MANAGEMENT:any;
				private session:any;
				private $rootScope:any;
				private user:any;
				private loggedUserId:number;    
				private offerId:number;
				private userData:{};
				private followStatus:boolean;
				private offerData:any;
				private daysFrom:any;
				private ngMeta:any;
				private isExpired:boolean;
				private isHttpReq:boolean=true;
				private isModrate:boolean;
				private $location:ng.ILocationService;

				constructor($log:ng.ILogService, $http:ng.IHttpService, ENV:any,AUTHURLS:any ,OFFER_MANAGEMENT_URLS:any, IMAGES_URLS:any,USER_MANAGEMENT:any, session:any,
						$rootScope:ng.IRootScopeService,forumFactory:any,$location:ng.ILocationService,ngMeta:any) {
						this.$log = $log;
						this.$http = $http;
						this.ENV = ENV;
						this.$location=$location;
						this.OFFER_MANAGEMENT_URLS = OFFER_MANAGEMENT_URLS; 
						this.forumFactory=forumFactory;
						this.AUTHURLS=AUTHURLS;     
						this.IMAGES_URLS = IMAGES_URLS;
						this.USER_MANAGEMENT=USER_MANAGEMENT;
						this.session = session;
						this.ngMeta=ngMeta;
						this.isModrate=false;
						this.$rootScope = $rootScope;
						this.user= this.session.getUserData();						
						this.$rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
						window.scrollTo(0, 0);

});
						this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
						this.getOfferDetail();
				}

				initValue(){
					this.user= this.session.getUserData();
					this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;
				this.getFollowStatus();
				}
				editOfferURL(){
					this.$location.path('update-offerta/'+this.offerData.id);
				}

				getFollowStatus(){
						if(this.loggedUserId > 0){
								this.$http.post(this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL,{idUser: this.loggedUserId,idLoggedUser: this.loggedUserId},
										{headers: {'Content-Type': 'application/json'}})
								.success(
										(data, status) => {
												this.userData=data;let isModrate=false;
												if(this.userData['usersFollowed'].indexOf(this.offerData.user.id) !== -1){
														this.followStatus=true;
												}else{
														this.followStatus=false;
												}
												angular.forEach(this.userData['user']['permissions'].offerRules,function(val,key){
														if(val==='edit' || val==='*'){
															isModrate=true;
														}
										});
												if(isModrate){
													this.isModrate=isModrate;
												}
												
										})
								.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
						}else{
							this.checkLogin();
						}

				}
checkLogin(){
				this.$http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER,
					{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
				.success(
					(data, status) => {						
						this.session.setUserData(data);		
						this.initValue();
					})
				.error((error) => {
						this.loggedUserId=0;

					});
				}


				getOfferDetail() {
						this.$http.post(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_DETAIL, {
								idOffer: this.offerId,
								idLoggedUser: this.session.getUserData() ? this.session.getUserData().id : null
						}, {})
						.success(
								(data:any, status) => {
										this.offerData = data;
										this.forumFactory.setForumDetail(this.offerData);										
										let insertionDate = new Date(data.dateIns);
										let today = new Date();
										let one_day = 1000 * 60 * 60 * 24;
										this.daysFrom = Math.floor((today.getTime() - insertionDate.getTime()) / (one_day));
										this.$rootScope.offerMetaTag = this.offerData;										
										this.getFollowStatus();
										this.ngMeta.setTitle(this.offerData.name+' '+this.offerData.price+'€ @ '+this.offerData.vendor['affiliationType']);
										this.ngMeta.setTag('description',this.offerData.name+' '+this.offerData.price+'€ @ '+this.offerData.vendor['affiliationType']+' Trova altri sconti, offerte e promozioni su Nedben.com')
										this.ngMeta.setTag('keyword',this.offerData.tags.toString());
								}
								)
						.error(
								(error) => {
										this.$location.path('404');
								}
								);
				}

				rateOffer(rate) {
					if (this.offerData.rateUserLogged !== 0) {
								toastr.info('Hai già votato questa offerta!');
								return false;
						}
					if(this.isHttpReq){
						this.isHttpReq=false;
						if (this.session.getUserData()) {

							if(this.session.getUserData().id===this.offerData.user.id){
					toastr.warning('Non puoi votare post creati da te!');
					return false;
				}else{
					this.$http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.RATE, {
										idOffer: this.offerData.id,
										idVoterUser: this.session.getUserData().id,
										rate: rate
								}, {})
								.success(
										(data, status) => {
												toastr.success('Voto registrato con successo!');
												this.getOfferDetail();
												this.isHttpReq=false;
										}
										)
								.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
				}

								 /*/*/
						} else {
								this.$rootScope.$broadcast('Auth-openModal');
						}

					}else {
						toastr.warning('Una richiesta già in corso, riprova piu tardi');
					}
						
						
				}

				saveOffer() {
						if (this.session.getUserData()) {
								this.$http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.SAVE_OFFER, {
										idOffer: this.offerData.id,
										idUser: this.session.getUserData().id
								}, {})
								.success(
										(data, status) => {
												toastr.success('Offerta salvata correttamente');
												this.getOfferDetail();
										}
										)
								.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
						} else {
								this.$rootScope.$broadcast('Auth-openModal');
						}
				}

				followUser(){
						if(this.loggedUserId > 0){
								if(this.followStatus){
										this.$http.post(this.ENV.apiBasePath + this.USER_MANAGEMENT.REMOVE_FOLLOW_USER_URL,{idUser: this.loggedUserId,idUserFollowed: this.offerData.user.id},
												{ headers: {'Content-Type': 'application/json'} })
										.success(
												(data, status) => {
														toastr.success('Utente seguito succussfully');
														this.getFollowStatus();                        
												})
										.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
								}
								else{
										this.$http.post(this.ENV.apiBasePath + this.USER_MANAGEMENT.FOLLOW_USER_URL,{idUser: this.loggedUserId,idUserFollowed: this.offerData.user.id},
												{ headers: {'Content-Type': 'application/json'} })
										.success(
												(data, status) => {
														toastr.success('Utente unfollowed succussfully');
														this.getFollowStatus();                        
												})
										.error((err)=> {
												console.log(err);
										});
								}
						}else{
								this.$rootScope.$broadcast('Auth-openModal');
						}

				};


				expiredOffer(){      
						if (this.session.getUserData()) {
							if(this.isHttpReq){
								this.isHttpReq=false;
								if(this.session.getUserData().id!==this.offerData.user.id){
										this.$http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.EXPIRED_OFFER, {
												idOffer: this.offerData.id,
												idUserReporter: this.session.getUserData().id
										}, {})
										.success(
												(data, status) => {
														toastr.success('Offerta report expired correttamente');
														this.isHttpReq=true;
												}
												)
										.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
								}else{
										this.isHttpReq=true;
								}
							}else{
								toastr.warning('Una richiesta già in corso, riprova piu tardi');
							} 
						}else {
										this.$rootScope.$broadcast('Auth-openModal');
								}
				}

				expiredConfirmOffer(){
						if (this.session.getUserData()) {
							if(this.isHttpReq){
								this.isHttpReq=false;
								if(this.session.getUserData().id===this.offerData.user.id){
										this.$http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.EXPIRED_CONFIRM_OFFER, {
												idOffer: this.offerData.id,
												expired: this.isExpired
										}, {})
										.success(
												(data, status) => {
														toastr.success('Offerta  expired correttamente');
														this.getOfferDetail();
														this.isHttpReq=true;
												}
												)
										.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
								} else{
									toastr.warning('Non si procede questo');
									this.isHttpReq=true;
								}


							}else{
								toastr.warning('Una richiesta già in corso, riprova piu tardi');
							}
								
						}else {
										this.$rootScope.$broadcast('Auth-openModal');
								}
				}

				reportOffer(obj){
						window.localStorage.setItem("reportObj", JSON.stringify(obj));
						window.localStorage.setItem("reportType", 'OFFER');

				};






		}
		angular.module('nedben.directives').directive('offerDetail', OfferDetailDirective.factory());
}
