import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ENV, OFFER_MANAGEMENT_URLS,IMAGES_URLS}  from '../../../app.constant';
import { SessionService } from '../../sessionService';

@Component({
  selector: 'offer',
  templateUrl: './offer.html',
  styleUrls: ['./offer.scss']
})
export class OfferComponent implements OnInit {
    private ENV:any;
	private offerId:number;
	private offerData:any;
	private daysFrom:number;
	private loading:boolean;
	private Socialshare:any;
	private isHttpReq:boolean = true;
	private loggedUserId:number=0;
	private IMAGES_URLS:any;
	private OFFER_MANAGEMENT_URLS:any;
	

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
        this.ENV = ENV;
		this.IMAGES_URLS=IMAGES_URLS;
		this.OFFER_MANAGEMENT_URLS = OFFER_MANAGEMENT_URLS;
		this.Socialshare=Socialshare;
		this.loggedUserId= this.session.getUserData() ? this.session.getUserData().id : 0;   
		this.loading = true;
		if(window.localStorage.getItem('searchType')==='FORUM'){
			// this.$rootScope.$broadcast('search-type','OFFER'); 
		}     
		this.getOfferDetail();
    }
    getOfferDetail() {
			this.loading = true;
			this.http.post(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_DETAIL, {
				idOffer: this.offerId,
				idLoggedUser: this.session.getUserId(),
			}, {})
			.map(res => res.json())
			.subscribe(
				(data:any) => {
					this.offerData = data;
					let insertionDate = new Date(data.dateIns);
					let today = new Date();
					let one_day = 1000 * 60 * 60 * 24;
					this.daysFrom = Math.floor((today.getTime() - insertionDate.getTime()) / (one_day));
					this.loading = false;
				},
				err => {
					this.loading = false;
					this.offerData = false;
				}
			)
		}
		rateOffer(rate) {
			if (this.offerData.rateUserLogged !== 0) {
				// toastr.info('Hai già votato questa offerta!');
				return false;
			}
			if(this.isHttpReq){
				if(this.loggedUserId > 0){
					this.isHttpReq=false;
					if(this.session.getUserData().id===this.offerData.user.id){
						// toastr.warning('Non puoi votare post creati da te!');
						return false;
					}else {
						this.http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.RATE, {
							idOffer: this.offerData.id,
							idVoterUser: this.session.getUserData().id,
							rate: rate
						}, {})
						.map(res => res.json())
						.subscribe(
							(data) => {
								// toastr.success('Voto registrato con successo!');
								this.getOfferDetail();
								this.isHttpReq=true;
							},
							(err) =>{
								// toastr.error('<p><strong>'+err.errorMessage+'</strong></p>'); 
							}
						)
					}

				}else {
						// this.$rootScope.$broadcast('Auth-openModal');
					}			

			}else {
				// toastr.warning('Una richiesta già in corso, riprova piu tardi');
			}
		}

		// loadCategoryOffer(selectedObject){
		// 	this.$rootScope.$broadcast('offerList-updateList',selectedObject);
		// }
}
