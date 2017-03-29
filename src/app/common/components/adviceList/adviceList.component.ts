import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ADVICE_MANAGEMENT_URLS, ENV}  from '../../../app.constant';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../common/sessionService';

@Component({
  selector: 'adviceList',
  templateUrl: './adviceList.html',
  styleUrls: ['./adviceList.scss']
})
export class AdviceListComponent implements OnInit {
	
	private ENV:any;
	private ADVICE_MANAGEMENT_URLS:any;
	private list:any[];
	private idForumCategory:number = 0;
	private dealPagination:any;
	private scrollStatus:boolean;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
		this.list=[];	
		this.ENV = ENV;
		this.scrollStatus=false;
		this.ADVICE_MANAGEMENT_URLS = ADVICE_MANAGEMENT_URLS;
		this.dealPagination={
			startFrom:0,
			offersRetuned:10
		};
		// this.$scope.$on('offerList-updateList', (event, category) => {
		// 	this.idForumCategory = category.idCategory;  
		// 	this.intililaizeVariable();           
		// });
		
		// if($stateParams.categoryId){
		// 	this.idForumCategory = $stateParams.categoryId;  
		// 		this.intililaizeVariable();      
		// }else {
		// 	this.getList();
		// }
    }

    intililaizeVariable(){
		this.list=[];			
		this.dealPagination['startFrom']=0; 		
		this.getList(); 
	}

	getList() {
		this.http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.LAST_FORUMS_POSTED,
		{
			startFrom: this.dealPagination['startFrom'],
			forumsRetuned: this.dealPagination['offersRetuned'],
			idCategory: this.idForumCategory,
		},{})
		.subscribe(
			(data:any) => {
				if(Object.keys(data).length === 0){
					this.scrollStatus=true;                     
				}else {
					for (var i = 0; i < Object.keys(data).length; i++) {
						if(this.list.indexOf(data[i])===-1){
							this.list.push(data[i]);
							this.dealPagination['startFrom']++;                      
						}
					}
				} 
			},
			(error) => {
				this.list = [];
			}
		);
	}
}

 



// module nedben.directives.adviceListDirective {
// 	'use strict';

// 	class AdviceListDirective implements ng.IDirective {
// 		restrict = 'E';
// 		controller = AdviceListDirectiveController;
// 		controllerAs = 'adviceList';
// 		bindToController = true;
// 		templateUrl = 'scripts/directives/advice-list/partials/advice-list.html';
// 		scope = true;

// 		static factory():ng.IDirectiveFactory {
// 			const directive = () => new AdviceListDirective();

// 			return directive;
// 		}
// 	}

// 	class AdviceListDirectiveController {
// 		static $inject = ['$log', '$http', 'ENV', 'ADVICE_MANAGEMENT_URLS','$scope','$stateParams'];

// 		private $log:ng.ILogService;
// 		private $http:ng.IHttpService;
// 		private ENV:any;
// 		private ADVICE_MANAGEMENT_URLS:any;
// 		private $scope:ng.IScope;
// 		private list:any[];
// 		private idForumCategory:number = 0;
// 		private dealPagination:any;
// 		private scrollStatus:boolean;
// 		constructor($log:ng.ILogService, $http:ng.IHttpService, ENV:any, ADVICE_MANAGEMENT_URLS:any,$scope:ng.IScope,$stateParams:any) {
// 			this.$log = $log;
// 			this.$http = $http;
// 			this.list=[];	
// 			this.ENV = ENV;
// 			this.$scope = $scope;
// 			this.scrollStatus=false;
// 			this.ADVICE_MANAGEMENT_URLS = ADVICE_MANAGEMENT_URLS;
// 			this.dealPagination={
// 				startFrom:0,
// 				offersRetuned:10
// 			};
// 			this.$scope.$on('offerList-updateList', (event, category) => {
// 							this.idForumCategory = category.idCategory;  
// 							this.intililaizeVariable();           
// 					});
			
// 			if($stateParams.categoryId){
// 				this.idForumCategory = $stateParams.categoryId;  
// 					this.intililaizeVariable();      
// 			}else {
// 				this.getList();
// 			}
			
// 		}

// 		intililaizeVariable(){
// 			this.list=[];			
// 			this.dealPagination['startFrom']=0; 		
// 			this.getList(); 
// 		}

// 		getList() {
// 			this.$http.put(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.LAST_FORUMS_POSTED,
// 			{
// 				startFrom: this.dealPagination['startFrom'],
// 				forumsRetuned: this.dealPagination['offersRetuned'],
// 				idCategory: this.idForumCategory,
// 			},{})
// 			.success(
// 				(data:any, status) => {
// 					if(Object.keys(data).length === 0){
// 						this.scrollStatus=true;                     
// 					}else {
// 						for (var i = 0; i < Object.keys(data).length; i++) {
// 							if(this.list.indexOf(data[i])===-1){
// 								this.list.push(data[i]);
// 								this.dealPagination['startFrom']++;                      
// 							}
// 						}
// 					} 
// 				})
// 			.error((error) => {
// 				this.list = [];
// 			});
// 		}
// 	}

// 	angular.module('nedben.directives').directive('adviceList', AdviceListDirective.factory());
// }
