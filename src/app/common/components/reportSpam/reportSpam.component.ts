/**
 * Created by Hyperlink on 04/04/16.
 */
 module nedben.directives.ReportSpamDirective {
	 'use strict';
	 class ReportSpamDirective implements ng.IDirective {
		 restrict = 'A';
		 controller = ReportSpamDirectiveController;
		 controllerAs = 'report';
		 bindToController = true;
		 scope = true;

		 static factory():ng.IDirectiveFactory {
			 const directive = () => new ReportSpamDirective();
			 return directive;
		 }
	 }

	 class ReportSpamModalController {
		 static $inject = ['$log', '$uibModalInstance', '$http', 'AUTHURLS', 'ENV','GENERICS','REPORT_ABUSE_URLS', 'session', '$rootScope', '$state', '$location'];

		 private $log:ng.ILogService;
		 private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance;
		 private $http:ng.IHttpService;
		 private AUTHURLS:any;
		 private ENV:any;
		 private GENERICS:any;
		 private REPORT_ABUSE_URLS:any;
		 private session:any;
		 private rootScope:ng.IRootScopeService;
		 private $state:ng.ui.IStateService;
		 private $location:ng.ILocationService;
		 private error:boolean = false;
		 private reportType:any;
		 private reportObject:any;
		 private scope:any;
		 private user:any;
		 private report:any;
		 private reportTypeList:any;
		 private errorMessage:string;

		 constructor($log:ng.ILogService, $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance, $http:ng.IHttpService,
			 AUTHURLS:any, ENV:any,GENERICS:any,REPORT_ABUSE_URLS:any, session:any, $rootScope:ng.IRootScopeService, $state:ng.ui.IStateService,
			 $location:ng.ILocationService) {
			 this.$log = $log;
			 this.$uibModalInstance = $uibModalInstance;
			 this.$http = $http;
			 this.AUTHURLS = AUTHURLS;
			 this.ENV = ENV;
			 this.GENERICS=GENERICS;
			 this.REPORT_ABUSE_URLS=REPORT_ABUSE_URLS;
			 this.session = session;
			 this.user=this.session.getUserData();
			 this.rootScope = $rootScope;
			 this.$state = $state;
			 this.$location = $location;
			 this.reportType=window.localStorage.getItem('reportType');
			 this.reportObject=JSON.parse(window.localStorage.getItem('reportObj'));
			 console.log(this.reportObject,'report object');
			 this.getReportType();
		 }

		 reportAbuse(){
			 if(this.session.getUserData()){
				 let postData={
					 idUserReporter:this.user.id,
					 reportType:this.reportTypeList[this.report.reportType],
					 message:this.report.comment
				 };
				 if(this.reportType==='THREAD'){
					 postData['idThread']=this.reportObject.idThread;
					 this.$http.put(this.ENV.apiBasePath+this.REPORT_ABUSE_URLS.REPORT_THREAD,postData
						 ,{headers: {'Content-Type': 'application/json'}})
					 .success((data,status)=>{
						 toastr.success('Il tuo commento verrà inviata ..');
						 this.close();
					 })
					 .error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
				 } else if(this.reportType==='USER'){
					 postData['idUser']=this.reportObject.user.id;
					 this.$http.post(this.ENV.apiBasePath+this.REPORT_ABUSE_URLS.REPORT_USER,postData
						 ,{headers: {'Content-Type': 'application/json'}})
					 .success((data,status)=>{
							toastr.success('Il tuo commento verrà inviata ..');
							this.close();
					 })
					 .error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

				 } else if(this.reportType==='OFFER'){
					 postData['idOffer']=this.reportObject.id;
					 this.$http.put(this.ENV.apiBasePath+this.REPORT_ABUSE_URLS.REPORT_OFFER,postData
						 ,{headers: {'Content-Type': 'application/json'}})
					 .success((data,status)=>{
							toastr.success('Il tuo commento verrà inviata ..');
							this.close();
					 })
					 .error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

				 } else if(this.reportType==='FORUM'){
					 postData['idForum']=this.reportObject.id;
					 this.$http.put(this.ENV.apiBasePath+this.REPORT_ABUSE_URLS.REPORT_FORUM,postData
						 ,{headers: {'Content-Type': 'application/json'}})
					 .success((data,status)=>{
							toastr.success('Il tuo commento verrà inviata ..');
							this.close();
					 })
					 .error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

				 }else{
					 toastr.warning('Selezione non valida per il rapporto.');
				 }

			 }else{
				 this.rootScope.$broadcast('Auth-openModal');
			 }

		 }

		 getReportType(){       
			 if(this.reportType==='THREAD'){
				 this.$http.get(this.ENV.apiBasePath+this.GENERICS.GET_REPORT_TYPE_THREAD,{})
				 .success((data,status)=>{
					 this.reportTypeList=data;
				 })
				 .error((err)=>{
					 console.log(err);
				 });
			 } else if(this.reportType==='USER'){
				 this.$http.get(this.ENV.apiBasePath+this.GENERICS.GET_REPORT_TYPE_USER,{})
				 .success((data,status)=>{
					 this.reportTypeList=data;
				 })
				 .error((err)=>{
					 console.log(err);
				 });

			 } else if(this.reportType==='OFFER'){
				 this.$http.get(this.ENV.apiBasePath+this.GENERICS.GET_REPORT_TYPE_OFFER,{})
				 .success((data,status)=>{
					 this.reportTypeList=data;
				 })
				 .error((err)=>{
					 console.log(err);
				 });

			 } else if(this.reportType==='FORUM'){
				 this.$http.get(this.ENV.apiBasePath+this.GENERICS.GET_REPORT_TYPE_FORUM,{})
				 .success((data,status)=>{
					 this.reportTypeList=data;
				 })
				 .error((err)=>{
					 console.log(err);
				 });

			 }else{
				 toastr.warning('Selezione non valida per il rapporto.');
			 }

		 }
		 close() {
			 this.$uibModalInstance.dismiss('close modal');
		 }

	 }

	 class ReportSpamDirectiveController {
		 static $inject = ['$log', '$uibModal', '$scope','session','$rootScope'];
		 private $log:ng.ILogService;
		 private $uibModal:ng.ui.bootstrap.IModalService;
		 private $scope:ng.IScope;
		 private $rootScope:ng.IRootScopeService;
		 private session:any;
		 private scope:any;
		 private reportType:any;
		 constructor($log:ng.ILogService, $uibModal:ng.ui.bootstrap.IModalService, $scope:ng.IScope,session:any, $rootScope:ng.IRootScopeService) {
			 this.$log = $log;
			 this.$uibModal = $uibModal;
			 this.$scope = $scope;
			 this.session=session;
			 this.$rootScope=$rootScope;
			 this.$scope.$on('Report-openModal', () => {
					 this.openModal();  
			 });
		 }

		 openModal() {
				if(!this.session.getUserData()){
					this.$rootScope.$broadcast('Auth-openModal');
				}else{
					 let options:ng.ui.bootstrap.IModalSettings = {
				 animation: true,
				 templateUrl: 'scripts/directives/report-spam/partials/report-spam.html',
				 controller: ReportSpamModalController,
				 controllerAs: 'reportModal',
				 bindToController: true,
				 backdrop: 'static',
				 scope: this.reportType,
			 };
			 let modalInstance = this.$uibModal.open(options);

			 modalInstance.result.then(() => {
				 this.$log.debug('modalInstance.result');
			 })
			 .catch((reason:any) => {
				 this.$log.debug(reason);
			 });
				}
			
		 }
	 }

	 angular.module('nedben.directives').directive('reportSpam', ReportSpamDirective.factory());
 }
