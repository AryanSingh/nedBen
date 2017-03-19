import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SEARCH_URLS, GENERICS }  from '../app.constant';
import { ICategory } from '../common/interfaces/offer';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../common/sessionService';



@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  providers: []
})
export class HomeComponent implements OnInit  {
	private ENV:any;
	private SEARCH_URLS:any;
	private GENERICS:any;
	private categories:ICategory[];
	private categorySelected:ICategory;
	private reverseType:any;
	private sortTypeList:any;
	private user:any;
	

	constructor(
	    private http: Http,
	    private session: SessionService 
	) {}


	ngOnInit(): void {
	   this.ENV = ENV;
	   this.SEARCH_URLS = SEARCH_URLS;
	   this.GENERICS = GENERICS;
	   this.user=this.session.getUserData();
	   this.reverseType="7";
	   this.getCategories();
	   this.getSortTypeList();
	}

	this.http.get(apiUrl)
					 .map(res => res.json())
					 .subscribe(
					    data => callback(data),
					    err => this.handleError(err),
					    () => console.log('api call completed')
					  );

	getSortTypeList(){
		this.http.get(this.ENV.apiBasePath + this.GENERICS.GET_SORT_TYPE)
			.map(res => res.json())
			.subscribe(
					data => this.sortTypeList = data,
					err => console.log("error in getSortTypeList")
				)
	}

	getCategories() {
		this.http.get(this.ENV.apiBasePath + this.GENERICS.GET_CATEGORY_LIST)
			.map(res => res.json())
			.subscribe(
					data:ICategory[] => this.categories = data,
					err => console.log("error in getCategories")
				)
	}

	// filterCateogory(category) {
			//  this.categorySelected = category;
			//  this.$timeout(() => {
			// 	 this.$scope.$broadcast('offerList-updateList');
			//  }, 200);
		 // }

	 // ChangeMe(){
		//  this.$scope.$broadcast('filter-change',this.reverseType === '' ? 1 : this.reverseType);       
	 // }

}


 