/**
	* Created by Hyperlink on 15/04/16.
	*/
module SliderDirective {
		'use strict';
		import IOffer = nedben.interfaces.IOffer;

		class SliderDirective implements ng.IDirective {
				restrict = 'E';
				controller = SliderDirectiveController;
				controllerAs = 'slider';
				bindToController = true;
				templateUrl = 'scripts/directives/slider/partials/slider.html';
				scope = true;

				static factory():ng.IDirectiveFactory {
						const directive = () => new SliderDirective();

						return directive;
				}
		}

		class SliderDirectiveController {
				static $inject = ['$log', '$http', '$filter', 'ENV', 'OFFER_MANAGEMENT_URLS', '$scope','$location'];

				private $log:ng.ILogService;
				private $http:ng.IHttpService;
				private $filter:ng.IFilterService;
				private ENV:any;
				private OFFER_MANAGEMENT_URLS:any;
				private scope:ng.IScope;
				private offers:IOffer[] = [];
				private $location:ng.ILocationService;
				private myInterval:number;
				private noWrapSlides:boolean;
				private active:number;

				constructor($log:ng.ILogService, $http:ng.IHttpService, $filter:ng.IFilterService, ENV, OFFER_MANAGEMENT_URLS, $scope:ng.IScope,$location:ng.ILocationService) {
						this.$log = $log;
						this.$http = $http;
						this.$filter = $filter;
						this.ENV = ENV;
						this.OFFER_MANAGEMENT_URLS = OFFER_MANAGEMENT_URLS;
						this.scope = $scope;
						this.$location=$location;
						this.myInterval = 6000;
						this.noWrapSlides = false;
						this.active = 0;

						this.getOffersIds();
				}

				getOffersIds() {
						this.$http.put(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.BEST_OFFERS,
								{
										dateFrom: this.$filter('date')(new Date().setMonth(new Date().getMonth() - 2), 'yyyy-MM-dd'),
										maxNumOfferRetuned: 5
								},
								{})
								.success(
										(data:number[], status) => {
												if (data.length) {
														this.getOffersData(data);
												} else {
														this.offers = [];
												}
										}
								)
								.error(
										(error) => {
												if (error.errorMessage === 'No offers found') {
														this.$log.debug('No offers found');
												}
										}
								);
				}

				getOffersData(ids:number[]) {
						angular.forEach(ids, (value) => {
								this.$http.post(this.ENV.apiBasePath + this.OFFER_MANAGEMENT_URLS.GET_DETAIL, {
												idOffer: value,
												idLoggedUser: null,
										}, {})
										.success(
												(data:IOffer, status) => {
														this.offers.push(data);
												}
										)
										.error(
												(error) => {
													console.log(error);
														// this.offerData = true;
												}
										);
						});
				}
		}

		angular.module('nedben.directives').directive('slider', SliderDirective.factory());
}
