import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { THREAD_MANAGEMENT_URLS, ENV}  from '../../../app.constant';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../common/sessionService';

@Component({
  selector: 'footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
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

 



module nedben.directives.adviceFormDirective {
		'use strict';
		import IOffer = nedben.interfaces.IOffer;
		import ICategory = nedben.interfaces.ICategory;

		class AdviceFormDirective implements ng.IDirective {
				restrict = 'E';
				controller = AdviceFormDirectiveController;
				controllerAs = 'adviceForm';
				bindToController = true;
				templateUrl = 'scripts/directives/advice-form/partials/advice-form.html';
				scope = true;
				static factory():ng.IDirectiveFactory {
						const directive = () => new AdviceFormDirective();

						return directive;
				}
		}

		class AdviceFormDirectiveController {
				static $inject = ['$http', 'ENV', 'ADVICE_MANAGEMENT_URLS', 'session', '$log', 'GENERICS', '$rootScope','$stateParams','$location'];

				private $http:ng.IHttpService;
				private ENV:any;
				private ADVICE_MANAGEMENT_URLS:any;
				private session:any;
				private $log:ng.ILogService;
				private GENERICS:any;
				private $rootScope:ng.IRootScopeService;
				private $location:any;
				private error:boolean;
				private errorMessage:string;
				private advice:any;
				private loggedUserId:number;
				private forumId:number;
				private forumCategories:{};
				private tag:string;

				constructor($http:ng.IHttpService, ENV, ADVICE_MANAGEMENT_URLS:any, session:any, $log:ng.ILogService, GENERICS:any,
																$rootScope:ng.IRootScopeService,$stateParams:any,$location:any) {
						this.$http = $http;
						this.ENV = ENV;
						this.ADVICE_MANAGEMENT_URLS = ADVICE_MANAGEMENT_URLS;
						this.session = session;
						this.$log = $log;
						this.GENERICS = GENERICS;
						this.$location=$location;
						this.$rootScope = $rootScope;
						this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;
							if(this.loggedUserId=== 0){
												this.$rootScope.$broadcast('Auth-openModal');
						}
						this.getForumCategories();
						if($stateParams.forumId){
						this.forumId=$stateParams.forumId;   
						this.getForumFullDeatil();   
						}
				}


				getForumFullDeatil(){
						this.$http.post(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.GET_DETAIL,
												{idForum:this.forumId,idLoggedUser:this.loggedUserId}
										,{headers: {'Content-Type': 'application/json'}})
										.success(
												(data, status) => {
													this.advice=data;
													this.tag=this.advice.tags.toString();
												}
										)
										.error(
												(error) => {
														this.error = true;
														this.errorMessage = error.errorMessage;
												}
										);
				}

				getForumCategories() {
						this.$http.get(this.ENV.apiBasePath + this.GENERICS.GET_FORUM_CATEGORY_INSLIST)
								.success(
										(data, status) => {        
												this.forumCategories = data;
										}
								).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
				}

				insertAdvice() {
						if (this.session.getUserData()) {
								try{
										this.advice.category= JSON.parse(this.advice.category);
								}
								catch (e){
										// console.log(e);
								}
								this.advice.dateIns = new Date();
								this.advice.tags = this.tag.split(',');
								this.advice.user = this.session.getUserData();
										if(this.forumId){
														this.$http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.UPDATE_FORUM, this.advice
														,{headers: {'Content-Type': 'application/json'}})
														.success(
																(data, status) => {
																	toastr.success('Modifiche risparmiare con successo');
																	this.$location.path('/forumdetail/'+this.forumId);
																}
														)
														.error(
																(error) => {
																		this.error = true;
																		this.errorMessage = error.errorMessage;
																}
														);

												
										} else {
														this.$http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.INSERT, this.advice
														,{headers: {'Content-Type': 'application/json'}})
														.success(
																(data, status) => {
																	toastr.success('Nuova domanda creare con successo');
																	this.$location.path('/forumdetail/'+data['id']);
																}
														)
														.error(
																(error) => {
																		this.error = true;
																		this.errorMessage = error.errorMessage;
																}
														);
								}  
						} else {
								this.$rootScope.$broadcast('Auth-openModal');
						}
				}
		}

		angular.module('nedben.directives').directive('adviceForm', AdviceFormDirective.factory());
}
