/**
 * Created by Hyperlink on 04/04/16.
 */
module nedben.directives.registration {
  'use strict';
  import IUser = nedben.interfaces.IUser;

  class RegistrationDirective implements ng.IDirective {
    restrict = 'A';
    controller = RegistrationDirectiveController;
    controllerAs = 'registration';
    bindToController = true;
    scope = true;

    static factory():ng.IDirectiveFactory {
      const directive = () => new RegistrationDirective();

      return directive;
    }
  }

  class RegistrationModalController {
    static $inject = ['$log', '$uibModalInstance', '$http', 'AUTHURLS', 'ENV', 'session'];
    private $log:ng.ILogService;
    private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance;
    private $http:ng.IHttpService;
    private AUTHURLS:any;
    private ENV:any;
    private session:any;
    private user:IUser;
    private error:boolean = false;
    private errorMessage:string;
    private registrationConfirm:boolean;

    constructor($log:ng.ILogService, $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance, $http:ng.IHttpService,
                AUTHURLS:any, ENV:any, session) {
      this.$log = $log;
      this.$uibModalInstance = $uibModalInstance;
      this.$http = $http;
      this.AUTHURLS = AUTHURLS;
      this.ENV = ENV;
      this.session = session;
    }

    ok() {
      this.$http.post(this.ENV.apiBasePath + this.AUTHURLS.REGISTRATION, this.user)
        .success(
          (data, status) => {
            this.registrationConfirm = true;
          }
        )
        .error(
          (error) => {
            this.error = true;
            this.errorMessage = error.errorMessage;
          }
        );
    }

    close() {
      this.$uibModalInstance.dismiss('close modal');
    }
  }

  class RegistrationDirectiveController {
    static $inject = ['$log', '$uibModal'];
    private $log:ng.ILogService;
    private $uibModal:ng.ui.bootstrap.IModalService;
    private scope:any;

    constructor($log:ng.ILogService, $uibModal:ng.ui.bootstrap.IModalService) {
      this.$log = $log;
      this.$uibModal = $uibModal;
    }

    openModal() {
      let options:ng.ui.bootstrap.IModalSettings = {
        animation: true,
        templateUrl: 'scripts/directives/auth/partials/registrationModal.html',
        controller: RegistrationModalController,
        controllerAs: 'registrationModal',
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

  angular.module('nedben.directives').directive('registrationDirective', RegistrationDirective.factory());
}
