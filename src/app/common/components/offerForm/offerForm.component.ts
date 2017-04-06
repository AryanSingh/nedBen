import { Component, Input, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ENV, OFFER_MANAGEMENT_URLS, GENERICS }  from '../../../app.constant';
import { SessionService } from '../../sessionService';
import { ICategory } from '../../interfaces/offer';
import forEach from 'lodash/forEach';


@Component({
  selector: 'offerForm',
  templateUrl: './offerForm.html',
  styleUrls: ['./offerForm.scss']
})
export class OfferFormComponent implements OnInit {
	private ENV:any;
	private OFFER_MANAGEMENT_URLS:any;
	private GENERICS:any;
	private message:any;
	private offerInsert:any;
	private offer:any;
	private categories:ICategory[];
	private tag:string;
	private user:any;
	private offerId:number;
	private calendarStart:any = {};
	private calendarEnd:any = {};
	private dateOptionsStart:any = {};
	private dateOptionsEnd:any = {};
	private apiURL:any;
	private formdata:any;
	private remoteUrl:boolean;
	private offerStartDate:any;
	private offerEndDate:any;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
		this.ENV = ENV;
		this.OFFER_MANAGEMENT_URLS = OFFER_MANAGEMENT_URLS;
		this.user = this.session.getUserData();
		this.GENERICS = GENERICS;
		this.getCategories();
		this.offerInsert = false;
		this.remoteUrl=true;
		if(!this.user){
			// this.$rootScope.$broadcast('Auth-openModal');
		}
		this.dateOptionsStart = {
			formatYear: 'yy',
			startingDay: 1,
			showWeeks: false
		};
		this.dateOptionsEnd = {
			formatYear: 'yy',
			startingDay: 1,
			showWeeks: false
		};
		this.calendarStart.opened = false;
		// this.offerStartDate = new Date();
		this.calendarEnd.opened = false;
		// this.offerEndDate = new Date();
		// if($stateParams.dealId){
		// 	this.offerId=$stateParams.dealId; 
		// }  

		this.getDealFullDeatil();   
		
    }

    	getDealFullDeatil(){
    		let headers = new Headers();
        	headers.append('Content-Type', 'application/json');
			this.http.post(this.ENV.apiBasePath+this.OFFER_MANAGEMENT_URLS.OFFER_DETAIL,
				{idOffer: this.offerId, idLoggedUser: this.user.id},
				headers)
				.subscribe(
					(data) => {
						this.tag=data['tags'].toString();
						this.offer=data;
						if(this.offer['startDate']!==null && this.offer['endDate']!==null){																							
						this.offerStartDate= new Date(Date.parse(this.offer['startDate']));
						this.offerEndDate=new Date(Date.parse(this.offer['endDate']));	
						}																		
						},
						(err)=>{
							// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
						});
		}
		openCalendar(calendar) {
			this[calendar].opened = true;
		}

		trust(src) {
			// return this.$sce.trustAsResourceUrl(src);
		}

		getTheFiles($files) {
				this.remoteUrl=false;
				this.formdata = new FormData();         
				this.formdata.append('file',$files[0]);
				this.uploadImage();
		};

		uploadImage(){

			if(this.offer){
				let headers = new Headers();
        		headers.append("Content-Type": undefined);
				this.http.post(this.ENV.apiBasePath+this.OFFER_MANAGEMENT_URLS.UPLOAD_IMAGE,
				{data:this.formdata},
				headers)
				.subscribe(
					(data)=>{ 
						this.offer.imgUrl=data['imageUrl'];
					},
					(err)=>{
						console.log(err);
					});
			}else{
				// toastr.error('Please fill all the required inputs');
			}
			
		}

		getCategories() {
			this.http.get(this.ENV.apiBasePath + this.GENERICS.GET_CATEGORY_INSLIST)
				.subscribe(
					(data:any) => {
						this.categories = data;
					}
				);
		}

		insertOffer() {
			if (this.session.getUserData()) {
				try{
					this.offer.category=JSON.parse(this.offer.category);
				}
				catch (e){
					// console.log(e);
				}
				
				this.offer.dateIns = new Date();
				this.offer.tags = [];

				if ( this.tag && this.tag !== '' ) {
					forEach(this.tag.split(','), (val, key) => {
							this.offer.tags.push(val.trim());
					});
				} else {
					this.offer.tags = null;
				}

				if ( this.offerStartDate && this.offerStartDate !== '' ) {
					this.offer.startDate = this.offerStartDate;
				} else {
					this.offer.startDate = null;
				}
				if ( this.offerEndDate && this.offerEndDate !== '' ) {
					this.offer.endDate = this.offerEndDate;
				} else {
					this.offer.endDate = null;
				}

				if(this.offerEndDate < this.offer.startDate){
					// toastr.warning('La tua offerta data di fine deve essere maggiore o uguale a offrire data di inizio.');
					return false;
			}
				this.offer.user = this.session.getUserData();
				this.message = { message: 'Offerta inserita correttamente'};
				if(this.offerId > 0){
					this.apiURL = this.ENV.apiBasePath+this.OFFER_MANAGEMENT_URLS.UPDATE;
					this.message = {
								type: 'success',
								message: 'Offerta aggiornato correttamente'
							};
				}else{
					this.apiURL = this.ENV.apiBasePath+this.OFFER_MANAGEMENT_URLS.INSERT;
					this.message = {
													type: 'success',
													message: 'Offerta inserita correttamente'
												};
				}
				this.http.put( this.apiURL, this.offer)
					.subscribe(
						(data) => {             
							this.offerInsert = data;
							if(this.offerId >0 ) {
								// this.$location.path('/offerta/' + this.offerId);
							}else{
								// this.$location.path('/offerta/' + this.offerInsert.id);
							}
							
						},
					
					
						(err) => {
							this.message = {
								type: 'alert',
								message: err.errorMessage
							};
						}
					);
			} else {
				// this.$log.error('ESEGUIRE LOGIN O REGISTRAZIONE');
				// this.$rootScope.$broadcast('Auth-openModal');
			}
		}

		rateOffer(rate) {
			if (this.offer.rateUserLogged !== 0) {
				// toastr.info('Hai già votato questa offerta!');
				return false;
			}
			if (this.session.getUserData()) {
				this.http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.RATE, {
					idOffer: this.offer.id,
					idVoterUser: this.session.getUserData().id,
					rate: rate
				}, {})
					.subscribe(
						(data) => {
							// toastr.success('Voto registrato con successo!');
							this.getDealFullDeatil();
						},
					
						(err)=>{
							// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
						});
			} else {
				// this.$log.error('ESEGUIRE LOGIN O REGISTRAZIONE');
				// this.$rootScope.$broadcast('Auth-openModal');
			}
		}

		getDomain() {
			let link = document.createElement('a');
			link.setAttribute('href', this.offer.url);

			return link.protocol + '//' + link.hostname;
		}

		offerParser() {
			let domain = this.getDomain();
			let headers = new Headers();
        	headers.append("Content-Type": undefined);

			// this.$log.debug('domain', domain);

			// this.$log.debug('offerParser', this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_REMOTE + '?offerUri=' + this.offer.url);
			this.http.post(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_REMOTE + '?offerUri=' + this.offer.url,
				{},
				headers
					// transformResponse: (data, headersGetter, status) => {
					// 	let parser = new DOMParser();
					// 	let doc = parser.parseFromString(data, 'text/html');

					// 	this.offer.name = doc.getElementById('productInfo').getElementsByClassName('main_header').item(0).textContent;
					// 	this.offer.imgUrl = domain + doc.getElementsByClassName('product_main_image')[0].getAttribute('src');
					// 	this.offer.description = doc.getElementById('description').getElementsByTagName('p')[0].textContent;

					// 	this.offer.price = parseFloat(doc.getElementsByClassName('fullPrice')[0].getElementsByTagName('span')[1]
					// 		.textContent.replace(',', '.'));

					// 	return doc;
					// },
				
			)
				.subscribe(
					(data) => {
						// this.$log.debug('offerParser', data);
					}
				);
		}
}

