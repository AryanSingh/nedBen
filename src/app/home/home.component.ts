import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SEARCH_URLS, GENERICS }  from '../app.constant';
import { ICategory } from '../common/interfaces/offer';


@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  providers: []
})
export class HomeComponent implements OnInit  {

	constructor(
    private http: Http,
  ) {}


 ngOnInit(): void {
   
 }

}


 module nedben.pages.homeModule {
	 'use strict';
	 // import ILocationService = angular.ILocationService;
	 // import ICategory = nedben.interfaces.ICategory;

	 class HomeController {
		 static $injector:string[] = ['$log', '$http', 'ENV', 'SEARCH_URLS', 'GENERICS', '$location', '$scope', '$timeout','$rootScope','$websocket','session'];

		 private $log:ng.ILogService;
		 private $http:ng.IHttpService;
		 private ENV:any;
		 private SEARCH_URLS:any;
		 private GENERICS:any;
		 private $location:ILocationService;
		 private $rootScope:ng.IRootScopeService;
		 private $scope:ng.IScope;
		 private $timeout:ng.ITimeoutService;
		 private categories:ICategory[];
		 private categorySelected:ICategory;
		 private reverseType:any;
		 private sortTypeList:any;
		 private user:any;
		 private session:any;
		 // private $websocket:any;

		 constructor($log:ng.ILogService, $http:ng.IHttpService, ENV:any, SEARCH_URLS:any, GENERICS:any, $location:ILocationService,
			 $scope:ng.IScope, $timeout:ng.ITimeoutService,$rootScope:ng.IRootScopeService,$websocket:any,session:any) {
			 this.$log = $log;
			 this.$http = $http;
			 this.ENV = ENV;
			 this.SEARCH_URLS = SEARCH_URLS;
			 this.GENERICS = GENERICS;
			 this.$location = $location;
			 this.$rootScope=$rootScope;
			 this.session=session
			 this.user=this.session.getUserData();
			 this.$scope = $scope;
			 this.$timeout = $timeout;
			 this.reverseType="7";
			 this.getCategories();
			 this.getSortTypeList();			 
			 this.$rootScope.$broadcast('search-type','OFFER'); 
		 }

		 getSortTypeList(){
		 	
				 this.$http.get(this.ENV.apiBasePath + this.GENERICS.GET_SORT_TYPE)
			 .success((data, status) => {
					 this.sortTypeList = data;
				 });
		 }

		 getCategories() {
			 this.$http.get(this.ENV.apiBasePath + this.GENERICS.GET_CATEGORY_LIST)
			 .success(
				 (data:ICategory[], status) => {
					 this.categories = data;
				 });
		 }

		 filterCateogory(category) {
			 this.categorySelected = category;
			 this.$timeout(() => {
				 this.$scope.$broadcast('offerList-updateList');
			 }, 200);
		 }

		 ChangeMe(){
			 this.$scope.$broadcast('filter-change',this.reverseType === '' ? 1 : this.reverseType);       
		 }
	 }

	 angular.module('nedben.pages')
	 .controller('homeController', HomeController);
 }

