/**
 * Created by Hyperlink on 15/04/16.
 */
module nedben.directives.searchDirective {
  'use strict';
  import IUser = nedben.interfaces.IUser;
  import ICategory = nedben.interfaces.ICategory;

  class SearchDirective implements ng.IDirective {
    restrict = 'E';
    controller = SearchDirectiveController;
    controllerAs = 'search';
    bindToController = true;
    templateUrl = 'scripts/directives/search/partials/search-navbar.html';
    scope = {
      category: '=?'
    };

    static factory():ng.IDirectiveFactory {
      const directive = () => new SearchDirective();

      return directive;
    }
  }

  class SearchDirectiveController {
    static $inject = ['$log','$scope', 'session', '$http', 'ENV', 'SEARCH_URLS', '$location', '$timeout', '$rootScope', 'GENERICS'];

    private $log:ng.ILogService;
    private session:any;
    private $http:ng.IHttpService;
    private ENV:any;
    private SEARCH_URLS:any;
    private $scope:ng.IScope;
    private $location:ng.ILocationService;
    private $timeout:ng.ITimeoutService;
    private $rootScope:ng.IRootScopeService;
    private GENERICS:any;
    private userLogged:IUser;
    private category:ICategory;
    private search:string;
    private categories:ICategory[];
    private categorySelected:ICategory;
    private searchType:any;


    constructor($log:ng.ILogService,$scope:ng.IScope, session, $http:ng.IHttpService, ENV:any, SEARCH_URLS:any, $location:ng.ILocationService,
                $timeout:ng.ITimeoutService, $rootScope:ng.IRootScopeService, GENERICS:any) {
      this.$log = $log;
      this.session = session;
      this.$http = $http;
      this.ENV = ENV;
      this.SEARCH_URLS = SEARCH_URLS;
      this.$location = $location;
      this.$timeout = $timeout;
      this.$rootScope = $rootScope;
      this.GENERICS = GENERICS;
      this.$scope=$scope;      
      this.$scope.$on('search-type',(evt,searchType) => {
        window.localStorage.setItem('searchType',searchType);
      });
      this.getCategories();
    }
    getCategories() {
      let type=window.localStorage.getItem('searchType');
      let apiURL=type==='OFFER' ? this.GENERICS.GET_CATEGORY_LIST : this.GENERICS.GET_FORUM_CATEGORY_LIST;
        this.$http.get(this.ENV.apiBasePath + apiURL)
        .success(
            (data:ICategory[], status) => {
                this.categories = data;
            }
        );
    }

    filterCateogory(category) {
        this.categorySelected = category;
        this.$timeout(() => {
            this.$rootScope.$broadcast('offerList-updateList', this.categorySelected);
        }, 200);
    }

    checkSession() {
      if (this.session.getUserData() === undefined) {
        this.userLogged = this.session.getUserData();
      } else {
        angular.noop();
      }
    }

    userSearch(val):any {
      let apiURL=null;let psotData={};
      let type=window.localStorage.getItem('searchType');
      if(type==='OFFER'){
        apiURL=this.SEARCH_URLS.OFFER;
        psotData={
          query: val,
          idCategory: this.categorySelected ? this.categorySelected.idCategory : 0
          /* startPage: null,
           endPage: null,*/
        };
      }else{
        apiURL=this.SEARCH_URLS.FORUM;
        psotData={
          query: val,
          idCategoryForum: this.categorySelected ? this.categorySelected.idCategory : 0
          /* startPage: null,
           endPage: null,*/
        };
      }
      return this.$http.post(this.ENV.apiBasePath + apiURL,psotData,{})
        .then(
          (response:any) => {
            this.$log.debug('search result', response.data);
            let responseResult = [];
            if (response.data.offerResults.length > 0) {
              angular.forEach(response.data.offerResults, (val) => {
                responseResult.push(val.name);
              });
            }
            if (response.data.searchSuggestions.length > 0) {
              angular.forEach(response.data.searchSuggestions, (val) => {
                responseResult.push(val);
              });
            }
            if (response.data.wereYouSearchingFor) {
              angular.forEach(response.data.wereYouSearchingFor, (val) => {
                responseResult.push(val);
              });
            }

            return responseResult;
          },
          (error) => {
            this.$log.debug('userSearch error', error);
            return [];
          }
        );
    };

    shouldSelect($event) {
      if ($event.which === 13) {
        this.$location.path('search/' + this.search);
      }
    }

    openOffer($item, $model, $label, event) {
      this.$location.path('search/' + $model);
    };
  }

  angular.module('nedben.directives').directive('search', SearchDirective.factory());
}
