module nedben.directives.MessageTrailDirective {
  'use strict';

  class MessageTrailDirective implements ng.IDirective {
    restrict = 'E';
    controller = MessageTrailDirectiveController;
    controllerAs = 'messageTrail';
    bindToController = true;
    templateUrl = 'scripts/directives/message-trail/partials/message-trail.html';
    scope = {
      messageData: '='
    };

    static factory():ng.IDirectiveFactory {
      const directive = () => new MessageTrailDirective();
      return directive;
    }
  }

  class MessageTrailDirectiveController {
    static $inject = ['ENV','AUTHURLS', 'MESSAGE_MANAGEMENT', 'IMAGES_URLS', '$http', '$log', '$scope', '$rootScope', 'session'];
    private ENV:any;
    private MESSAGE_MANAGEMENT:any;
    private IMAGES_URLS:any;
    private $http:ng.IHttpService;
    private $log:ng.ILogService;
    private $scope:ng.IScope;
    private AUTHURLS:any;
    private $rootScope:ng.IRootScopeService;
    private session:any;
    private $sce:ng.ISCEService;
    private user:any;
    private messageData:any;

    constructor(ENV:any,AUTHURLS:any, MESSAGE_MANAGEMENT:any, IMAGES_URLS:any, $http:ng.IHttpService, $log:ng.ILogService, $scope:ng.IScope,
                $rootScope:ng.IRootScopeService, session:any) {
      this.ENV = ENV;
      this.MESSAGE_MANAGEMENT = MESSAGE_MANAGEMENT;
      this.IMAGES_URLS = IMAGES_URLS;
      this.$http = $http;
      this.$log = $log;
      this.AUTHURLS=AUTHURLS;
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.session = session;
      this.user=this.session.getUserData();
    }


  }

  angular.module('nedben.directives').directive('messageTrail', MessageTrailDirective.factory());
}
