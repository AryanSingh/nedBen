/**
 * Created by Hyperlink on 04/04/16.
 */
 module nedben.directives.SearchFriendDirective {
   'use strict';
   class SearchFriendDirective implements ng.IDirective {
     restrict = 'A';
     controller = SearchFriendDirectiveController;
     controllerAs = 'searchCtrl';
     bindToController = true;
     scope = true;

     static factory():ng.IDirectiveFactory {
       const directive = () => new SearchFriendDirective();
       return directive;
     }
   }

   class SearchFriendModalController {
     static $inject = ['$log', '$uibModalInstance', '$http','ENV','session', '$rootScope','$location'];

     private $log:ng.ILogService;
     private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance;
     private $http:ng.IHttpService;
     private ENV:any;
     private session:any;
     private $rootScope:ng.IRootScopeService;
     private $location:ng.ILocationService;
     private scope:any;
     private user:any;
     private searchStr:any;
     constructor($log:ng.ILogService, $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance, $http:ng.IHttpService,
       ENV:any,session:any, $rootScope:ng.IRootScopeService,$location:ng.ILocationService) {
       this.$log = $log;
       this.$uibModalInstance = $uibModalInstance;
       this.$http = $http;
       this.$location=$location;
       this.ENV = ENV; 
       this.session = session;
       this.user=this.session.getUserData() ? this.session.getUserData() : {};
       this.$rootScope = $rootScope; 
       
     }

     searchMe(){
       this.close();
       this.$location.path('searchfriend/'+this.searchStr);
     }


     close() {
       this.$uibModalInstance.dismiss('close modal');
     }

   }

   class SearchFriendDirectiveController {
     static $inject = ['$log', '$uibModal', '$scope'];
     private $log:ng.ILogService;
     private $uibModal:ng.ui.bootstrap.IModalService;
     private $scope:ng.IScope;
     private scope:any;
     constructor($log:ng.ILogService, $uibModal:ng.ui.bootstrap.IModalService, $scope:ng.IScope) {
       this.$log = $log;
       this.$uibModal = $uibModal;
       this.$scope = $scope;
       this.$scope.$on('Search-openModal', () => {
         this.openModal();
       });
     }

     openModal() {
       let options:ng.ui.bootstrap.IModalSettings = {
         animation: true,
         templateUrl: 'scripts/directives/search-friend/partials/view.html',
         controller: SearchFriendModalController,
         controllerAs: 'searchFriendModal',
         bindToController: true,
         backdrop: 'static',
         scope: this.scope,
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

   angular.module('nedben.directives').directive('searchFriend', SearchFriendDirective.factory());
 }



