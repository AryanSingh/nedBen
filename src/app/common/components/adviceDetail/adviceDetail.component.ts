import { Component, Input, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ADVICE_MANAGEMENT_URLS, ENV, IMAGES_URLS, AUTHURLS, USER_MANAGEMENT }  from '../../../app.constant';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../../sessionService';
import { ForumService } from '../../ForumService';
import forEach from 'lodash/forEach';



@Component({
  selector: 'adviceDetail',
  templateUrl: './adviceDetail.html',
  styleUrls: ['./adviceDetail.scss']
})
export class AdviceDetailComponent implements OnInit {
    private ENV:any;
	private ADVICE_MANAGEMENT_URLS:any;
	private IMAGES_URLS:any;
	private AUTHURLS:any;
	private USER_MANAGEMENT:any;
	private user:any;
	private ngMeta:any;
	private loggedUserId:number;    
	private forumId:number;
	private userData:{};
	private followStatus:boolean;
	private forumData:any;
	private daysFrom:any;
	// private $location:ng.ILocationService;
	private isModrate:boolean;
	private pageLoadStatus:boolean;

    constructor(
        private http: Http,
        private session: SessionService,
        private forumService : ForumService; 
    ){};

    ngOnInit(): void {
        this.ENV = ENV;
		this.isModrate=false;			
		this.pageLoadStatus=false;
		this.ADVICE_MANAGEMENT_URLS = ADVICE_MANAGEMENT_URLS; 
		this.AUTHURLS = AUTHURLS;     
		// this.$location=$location;
		this.IMAGES_URLS = IMAGES_URLS;
		this.USER_MANAGEMENT= USER_MANAGEMENT;
		this.user= this.session.getUserData();
		// this.$scope.$on('update-formDeatil',()=>{
		// 	this.getForumDetail();
		// });
		this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
		this.getForumDetail();
    }

	getFollowStatus(){
		if(this.loggedUserId > 0){
			this.http.post(this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL,{idUser: this.loggedUserId,idLoggedUser: this.loggedUserId})
				.map(res => res.json())
				.subscribe(
					(data) => {
						this.userData=data;let isModrate=false;
							if(this.userData['usersFollowed'].indexOf(this.forumData.user.id) !== -1){
							this.followStatus=true;
						}else{
							this.followStatus=false;
						}
						forEach(this.userData['user']['permissions'].forumRules,function(val,key){
							if(val==='edit' || val==='*'){
								isModrate=true;
							}
						});
						if(isModrate){
							this.isModrate=isModrate;
						}

					},
					(err)=>{
						// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
					}
				);
		}else{
			this.checkLogin();
		}
	}
	editForumURL(){
		// this.$location.path('update-forum/'+this.forumData.id);
	}

	initValue(){
		this.user= this.session.getUserData();
		this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;
		this.getFollowStatus();
	}

	checkLogin(){
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		this.http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER, headers )
		.map(res => res.json())
		.subscribe(
			(data) => {						
				this.session.setUserData(data);		
				this.initValue();
			},
			(err) => {
				this.loggedUserId=0;
			}
		);
	}


	getForumDetail() {
		this.http.post(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.GET_DETAIL, {
			idForum: this.forumId,
			idLoggedUser: this.session.getUserData() ? this.session.getUserData().id : null
		}, {})
		.subscribe(
			(data:any) => {
				this.pageLoadStatus=true;
				this.forumData = data;
				this.forumService.setForumDetail(this.forumData); 
				let insertionDate = new Date(data.dateIns);
				let today = new Date();
				let one_day = 1000 * 60 * 60 * 24;
				this.getFollowStatus();
				this.daysFrom = Math.floor((today.getTime() - insertionDate.getTime()) / (one_day));
				// this.$rootScope.offerMetaTag = this.forumData;    
				// this.ngMeta.setTitle(this.forumData.name);
				// this.ngMeta.setTag('description',this.forumData.name+' Trova altri sconti, offerte e promozioni su Nedben.com')
				// this.ngMeta.setTag('keyword',this.forumData.tags.toString());
			},
			
		
			(err) => {
				// this.$location.path('404');
			}
		);
	}

	saveForum() {
		if (this.session.getUserData()) {
			if(this.forumData.forumAlreadySaved){
				// toastr.info('Si salva giá questo consiglio');
			}else{
				this.http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.SAVE_FORUM, {
				idForum: this.forumData.id,
				idUser: this.session.getUserData().id
			}, {})
			.subscribe(
				(data) => {
					// toastr.success('Offerta salvata correttamente');
					this.getForumDetail();
				},
				
			
				(err) => {
					// toastr.error('<p><strong>'+error.errorMessage+'</strong></p>');
				}
			);
			}
		} else {
			// this.$rootScope.$broadcast('Auth-openModal');
		}
	}

	followUser(){
		if(this.loggedUserId > 0){
			if(this.followStatus){
				let headers = new Headers();
				headers.append('Content-Type', 'application/json');
				this.http.post(this.ENV.apiBasePath + this.USER_MANAGEMENT.REMOVE_FOLLOW_USER_URL,{idUser: this.loggedUserId,idUserFollowed: this.forumData.user.id},headers )
				.subscribe(
					(data) => {
						// toastr.success('Utente seguito succussfully');
						this.getFollowStatus();                        
					},
					(err)=> {
							// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
					}
				);
			}
			else{
				let headers = new Headers();
				headers.append('Content-Type', 'application/json');
				this.http.post(this.ENV.apiBasePath + this.USER_MANAGEMENT.FOLLOW_USER_URL,{idUser: this.loggedUserId,idUserFollowed: this.forumData.user.id},
					headers )
				.subscribe(
					(data) => {
						// toastr.success('Utente unfollowed succussfully');
						this.getFollowStatus();                        
					},
					(err)  => {
					// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
					}
				);
			}
		}else{
			// this.$rootScope.$broadcast('Auth-openModal');
		}

	};
	reportOffer(obj){
			window.localStorage.setItem("reportObj", JSON.stringify(obj));
			window.localStorage.setItem("reportType", 'FORUM');

	};

    
}

// module nedben.directives.AdviceDetailDirective {
// 	'use strict';

// 	class AdviceDetailDirective implements ng.IDirective {
// 		restrict = 'E';
// 		controller = AdviceDetailDirectiveController;
// 		controllerAs = 'adviceDetail';
// 		bindToController = true;
// 		templateUrl = 'scripts/directives/advice-detail/partials/advice-detail.html';
// 		scope = {
// 			forumId: '=',
// 		};

// 		static factory():ng.IDirectiveFactory {
// 			const directive = () => new AdviceDetailDirective();

// 			return directive;
// 		}
// 	}

// 	class AdviceDetailDirectiveController {
// 		static $inject = ['$log','$scope' ,'$http', 'ENV','AUTHURLS', 'ADVICE_MANAGEMENT_URLS', 'IMAGES_URLS','USER_MANAGEMENT', 'session', '$rootScope','forumFactory','$location','ngMeta'];

// 		private $log:ng.ILogService;
// 		private $http:ng.IHttpService;
// 		private $scope:ng.IScope;
// 		private ENV:any;
// 		private ADVICE_MANAGEMENT_URLS:any;
// 		private IMAGES_URLS:any;
// 		private AUTHURLS:any;
// 		private USER_MANAGEMENT:any;
// 		private session:any;
// 		private forumFactory:any;
// 		private $rootScope:any;
// 		private user:any;
// 		private ngMeta:any;
// 		private loggedUserId:number;    
// 		private forumId:number;
// 		private userData:{};
// 		private followStatus:boolean;
// 		private forumData:any;
// 		private daysFrom:any;
// 		private $location:ng.ILocationService;
// 		private isModrate:boolean;
// 		private pageLoadStatus:boolean;

// 		constructor($log:ng.ILogService, $scope:ng.IScope, $http:ng.IHttpService, ENV:any,AUTHURLS:any ,ADVICE_MANAGEMENT_URLS:any, IMAGES_URLS:any,USER_MANAGEMENT:any, session:any,
// 			$rootScope:ng.IRootScopeService,forumFactory:any,$location:ng.ILocationService,ngMeta:any) {
// 			this.$log = $log;
// 			this.$http = $http;
// 			this.ENV = ENV;
// 			this.$scope=$scope;
// 			this.ngMeta=ngMeta;
// 			this.isModrate=false;			
// 			this.pageLoadStatus=false;
// 			this.ADVICE_MANAGEMENT_URLS = ADVICE_MANAGEMENT_URLS; 
// 			this.AUTHURLS=AUTHURLS;     
// 			this.$location=$location;
// 			this.IMAGES_URLS = IMAGES_URLS;
// 			this.USER_MANAGEMENT=USER_MANAGEMENT;
// 			this.session = session;
// 			this.forumFactory=forumFactory;
// 			this.$rootScope = $rootScope;
// 			this.user= this.session.getUserData();
// 			this.$scope.$on('update-formDeatil',()=>{
// 				this.getForumDetail();
// 			});
// 			this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;       
// 			this.getForumDetail();
// 		}
// 		initValue(){
// 			this.user= this.session.getUserData();
// 			this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;
// 			this.getFollowStatus();
// 		}
// 		getFollowStatus(){
// 			if(this.loggedUserId > 0){
// 				this.$http.post(this.ENV.apiBasePath + this.AUTHURLS.USER_DETAIL,{idUser: this.loggedUserId,idLoggedUser: this.loggedUserId},
// 					{headers: {'Content-Type': 'application/json'}})
// 						.success(
// 							(data, status) => {
// 								this.userData=data;let isModrate=false;
// 									if(this.userData['usersFollowed'].indexOf(this.forumData.user.id) !== -1){
// 									this.followStatus=true;
// 								}else{
// 									this.followStatus=false;
// 								}
// 								angular.forEach(this.userData['user']['permissions'].forumRules,function(val,key){
// 														if(val==='edit' || val==='*'){
// 															isModrate=true;
// 														}
// 										});
// 												if(isModrate){
// 													this.isModrate=isModrate;
// 												}

// 							})
// 						.error((err)=>{
// 							toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
// 						});
// 			}else{
// 				this.checkLogin();
// 			}
// 		}
// 		editForumURL(){
// 			this.$location.path('update-forum/'+this.forumData.id);
// 		}

// 		checkLogin(){
// 			this.$http.get(this.ENV.authBasePath + this.AUTHURLS.GETLOGGEDUSER,
// 				{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
// 			.success(
// 				(data, status) => {						
// 					this.session.setUserData(data);		
// 					this.initValue();
// 				})
// 			.error((error) => {
// 					this.loggedUserId=0;

// 				});
// 		}


// 		getForumDetail() {
// 			this.$http.post(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.GET_DETAIL, {
// 				idForum: this.forumId,
// 				idLoggedUser: this.session.getUserData() ? this.session.getUserData().id : null
// 			}, {})
// 			.success(
// 				(data:any, status) => {
// 					this.pageLoadStatus=true;
// 					this.forumData = data;
// 					this.forumFactory.setForumDetail(this.forumData); 
// 					let insertionDate = new Date(data.dateIns);
// 					let today = new Date();
// 					let one_day = 1000 * 60 * 60 * 24;
// 					this.getFollowStatus();
// 					this.daysFrom = Math.floor((today.getTime() - insertionDate.getTime()) / (one_day));
// 					this.$rootScope.offerMetaTag = this.forumData;    
// 					this.ngMeta.setTitle(this.forumData.name);
// 					this.ngMeta.setTag('description',this.forumData.name+' Trova altri sconti, offerte e promozioni su Nedben.com')
// 					this.ngMeta.setTag('keyword',this.forumData.tags.toString());
// 				}
// 				)
// 			.error(
// 				(error) => {
// 					this.$location.path('404');
// 					}
// 					);
// 		}

// 		saveForum() {
// 			if (this.session.getUserData()) {
// 				if(this.forumData.forumAlreadySaved){
// 					toastr.info('Si salva giá questo consiglio');
// 				}else{
// 							this.$http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.SAVE_FORUM, {
// 					idForum: this.forumData.id,
// 					idUser: this.session.getUserData().id
// 				}, {})
// 				.success(
// 					(data, status) => {
// 						toastr.success('Offerta salvata correttamente');
// 						this.getForumDetail();
// 					}
// 					)
// 				.error(
// 					(error) => {
// 						toastr.error('<p><strong>'+error.errorMessage+'</strong></p>');
// 					}
// 					);
// 				}
// 			} else {
// 				this.$rootScope.$broadcast('Auth-openModal');
// 			}
// 		}

// 		followUser(){
// 			if(this.loggedUserId > 0){
// 				if(this.followStatus){
// 					this.$http.post(this.ENV.apiBasePath + this.USER_MANAGEMENT.REMOVE_FOLLOW_USER_URL,{idUser: this.loggedUserId,idUserFollowed: this.forumData.user.id},
// 						{ headers: {'Content-Type': 'application/json'} })
// 					.success(
// 						(data, status) => {
// 							toastr.success('Utente seguito succussfully');
// 							this.getFollowStatus();                        
// 						})
// 					.error((err)=> {
// 							toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
// 					});
// 				}
// 				else{
// 					this.$http.post(this.ENV.apiBasePath + this.USER_MANAGEMENT.FOLLOW_USER_URL,{idUser: this.loggedUserId,idUserFollowed: this.forumData.user.id},
// 						{ headers: {'Content-Type': 'application/json'} })
// 					.success(
// 						(data, status) => {
// 							toastr.success('Utente unfollowed succussfully');
// 							this.getFollowStatus();                        
// 						})
// 					.error((err)=> {
// 						toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
// 					});
// 				}
// 			}else{
// 				this.$rootScope.$broadcast('Auth-openModal');
// 			}

// 		};
// 		reportOffer(obj){
// 				window.localStorage.setItem("reportObj", JSON.stringify(obj));
// 				window.localStorage.setItem("reportType", 'FORUM');

// 		};
// 	}
// 	angular.module('nedben.directives').directive('adviceDetail', AdviceDetailDirective.factory());
// }
