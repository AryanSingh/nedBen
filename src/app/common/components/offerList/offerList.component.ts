import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { THREAD_MANAGEMENT_URLS, ENV, OFFER_MANAGEMENT_URLS}  from '../../../app.constant';
import { SessionService } from '../common/sessionService';

@Component({
  selector: 'offerList',
  templateUrl: './offerList.html',
  styleUrls: ['./offerList.scss']
})
export class OfferListComponent implements OnInit {
    private ENV:any;
	private OFFER_MANAGEMENT_URLS:any;
	private list:any;
	private idCategory:number;
	private dealPagination:{};
	private counter:boolean;
	private scrollStatus:boolean;
	private sortFilter:any;
	private pageLoadStatus:boolean;


    constructor(
        private http: Http
    ){};

    ngOnInit(): void {
        this.ENV = ENV;
		this.pageLoadStatus=false;
		this.OFFER_MANAGEMENT_URLS = OFFER_MANAGEMENT_URLS;
		this.sortFilter="7";
		this.list=[];
		this.scrollStatus=false;
		this.dealPagination={
			startFrom:0,
			offersRetuned:10,
			idCategory:0
		};

		// if($stateParams.categoryId){
		// 	this.idCategory = $stateParams.categoryId;  
		// 		this.intililaizeVariable();      
		// }
		// this.$scope.$on('filter-change',(event,type)=>{
		// 		this.sortFilter=type;
		// 		this.intililaizeVariable();  
		// });
		// this.$scope.$on('offerList-updateList', (event, category) => {
		// 		this.idCategory = category.idCategory;  
		// 		this.intililaizeVariable();           
		// });
    }

    intililaizeVariable(){
		this.list=[];
		this.dealPagination['startFrom']=0; 
		this.getList(); 
	}

	getList() {
		this.http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.LAST_OFFERS_POSTED,
			{
				startFrom: this.dealPagination['startFrom'],
				offersRetuned: this.dealPagination['offersRetuned'],
				idCategory: this.idCategory,
				idSorting: this.sortFilter
			},{})
			.map(res => res.json())
			.subscribe(
				(data) => {
					this.pageLoadStatus=true;
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
				err => console.log('err in getList')
			)
	}

}


