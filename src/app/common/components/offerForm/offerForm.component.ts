module nedben.directives.offerFormDirective {
	'use strict';
	import IOffer = nedben.interfaces.IOffer;
	import ICategory = nedben.interfaces.ICategory;
	// import IUser = nedben.interfaces.IUser;
	class OfferFormDirective implements ng.IDirective {
		restrict = 'E';
		controller = OfferFormDirectiveController;
		controllerAs = 'offerForm';
		bindToController = true;
		templateUrl = 'scripts/directives/offer-form/partials/offer-form.html';
		scope = {
			offer: '=',
		};
		static factory():ng.IDirectiveFactory {
			const directive = () => new OfferFormDirective();
			return directive;
		}
	}

	class OfferFormDirectiveController {
		static $inject = ['$scope', '$rootScope', '$http', 'ENV', 'OFFER_MANAGEMENT_URLS', 'session', '$compile', '$log',
			'GENERICS', '$location', '$sce', '$stateParams'];

		private $scope:ng.IScope;
		private $rootScope:ng.IRootScopeService;
		private $http:ng.IHttpService;
		private ENV:any;
		private OFFER_MANAGEMENT_URLS:any;
		private session:any;
		private $compile:ng.ICompileService;
		private $log:ng.ILogService;
		private GENERICS:any;
		private $location:ng.ILocationService;
		private $sce:ng.ISCEService;
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

		constructor($scope:ng.IScope, $rootScope:ng.IRootScopeService, $http:ng.IHttpService, ENV:any, OFFER_MANAGEMENT_URLS:any,
								session:any, $compile:ng.ICompileService, $log:ng.ILogService, GENERICS:any, $location:ng.ILocationService,
								$sce:ng.ISCEService, $stateParams:any) {
			this.$scope = $scope;
			this.$rootScope = $rootScope;
			this.$http = $http;
			this.ENV = ENV;
			this.OFFER_MANAGEMENT_URLS = OFFER_MANAGEMENT_URLS;
			this.session = session;
			this.user = session.getUserData();
			this.$compile = $compile;
			this.$log = $log;
			this.GENERICS = GENERICS;
			this.$location = $location;
			this.$sce = $sce;
			this.getCategories();
			this.offerInsert = false;
			this.remoteUrl=true;
			if(!this.user){
				this.$rootScope.$broadcast('Auth-openModal');
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
			if($stateParams.dealId){
			this.offerId=$stateParams.dealId;   

			this.getDealFullDeatil();   
			}
		}
		getDealFullDeatil(){
			this.$http.post(this.ENV.apiBasePath+this.OFFER_MANAGEMENT_URLS.OFFER_DETAIL,
				{idOffer: this.offerId, idLoggedUser: this.user.id},
				{headers: {'Content-Type': 'application/json'}})
															.success(
																				(data, status) => {
																						this.tag=data['tags'].toString();
																						this.offer=data;
																						if(this.offer['startDate']!==null && this.offer['endDate']!==null){																							
																						this.offerStartDate= new Date(Date.parse(this.offer['startDate']));
																						this.offerEndDate=new Date(Date.parse(this.offer['endDate']));	
																						}																		
																					}).error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
		}
		openCalendar(calendar) {
			this[calendar].opened = true;
		}

		trust(src) {
				return this.$sce.trustAsResourceUrl(src);
		}

		getTheFiles($files) {
				this.remoteUrl=false;
				this.formdata = new FormData();         
				this.formdata.append('file',$files[0]);
				this.uploadImage();
			};

		uploadImage(){
			if(this.offer){
				this.$http({
				method:'POST',
				url:this.ENV.apiBasePath+this.OFFER_MANAGEMENT_URLS.UPLOAD_IMAGE,
				data:this.formdata,
				headers: {"Content-Type": undefined}
			}).success((data,status)=>{ 
				this.offer.imgUrl=data['imageUrl'];
			})
			.error((err)=>{
				console.log(err);
			});
			}else{
				toastr.error('Please fill all the required inputs');
			}
			
		}

		getCategories() {
			this.$http.get(this.ENV.apiBasePath + this.GENERICS.GET_CATEGORY_INSLIST)
				.success(
					(data:ICategory[], status) => {
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
						angular.forEach(this.tag.split(','), (val, key) => {
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
					toastr.warning('La tua offerta data di fine deve essere maggiore o uguale a offrire data di inizio.');
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
				this.$http.put( this.apiURL, this.offer)
					.success(
						(data, status) => {             
							this.offerInsert = data;
							if(this.offerId >0 ) {
								this.$location.path('/offerta/' + this.offerId);
							}else{
								this.$location.path('/offerta/' + this.offerInsert.id);
							}
							
						}
					)
					.error(
						(error) => {
							this.message = {
								type: 'alert',
								message: error.errorMessage
							};
						}
					);
			} else {
				this.$log.error('ESEGUIRE LOGIN O REGISTRAZIONE');
				this.$rootScope.$broadcast('Auth-openModal');
			}
		}

		rateOffer(rate) {
			if (this.offer.rateUserLogged !== 0) {
				toastr.info('Hai già votato questa offerta!');
				return false;
			}
			if (this.session.getUserData()) {
				this.$http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.RATE, {
					idOffer: this.offer.id,
					idVoterUser: this.session.getUserData().id,
					rate: rate
				}, {})
					.success(
						(data, status) => {
							toastr.success('Voto registrato con successo!');
							this.getDealFullDeatil();
						}
					)
					.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
			} else {
				this.$log.error('ESEGUIRE LOGIN O REGISTRAZIONE');
				this.$rootScope.$broadcast('Auth-openModal');
			}
		}

		getDomain() {
			let link = document.createElement('a');
			link.setAttribute('href', this.offer.url);

			return link.protocol + '//' + link.hostname;
		}

		offerParser() {
			let domain = this.getDomain();

			this.$log.debug('domain', domain);

			this.$log.debug('offerParser', this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_REMOTE + '?offerUri=' + this.offer.url);
			this.$http.post(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_REMOTE + '?offerUri=' + this.offer.url,
				{},
				{
					headers: {
						'Content-Type': 'text/html',
					},
					transformResponse: (data, headersGetter, status) => {
						let parser = new DOMParser();
						let doc = parser.parseFromString(data, 'text/html');

						this.offer.name = doc.getElementById('productInfo').getElementsByClassName('main_header').item(0).textContent;
						this.offer.imgUrl = domain + doc.getElementsByClassName('product_main_image')[0].getAttribute('src');
						this.offer.description = doc.getElementById('description').getElementsByTagName('p')[0].textContent;

						this.offer.price = parseFloat(doc.getElementsByClassName('fullPrice')[0].getElementsByTagName('span')[1]
							.textContent.replace(',', '.'));

						return doc;
					},
				}
			)
				.success(
					(data, status) => {
						this.$log.debug('offerParser', data);
					}
				);
		}
	}

	angular.module('nedben.directives').directive('offerForm', OfferFormDirective.factory());
}
