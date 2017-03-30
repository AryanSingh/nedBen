module nedben.directives.resetPwd {
  'use strict';
  class ResetPwdDirective implements ng.IDirective {
    restrict = 'E';
    controller = ResetPwdDirectiveController;
    controllerAs = 'reset_pwd';
    bindToController = true;
    scope = true;

    static factory():ng.IDirectiveFactory {
      const directive = () => new ResetPwdDirective();

      return directive;
    }
  }

  class ResetPwdModalController {
    static $inject = ['$log', '$uibModalInstance', '$http', 'AUTHURLS', 'ENV', 'session', '$location'];
    private $log:ng.ILogService;
    private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance;
    private $http:ng.IHttpService;
    private AUTHURLS:any;
    private ENV:any;
    private session:any;
    private $location:ng.ILocationService;

    private error:boolean = false;
    private errorMessage:string;
    private resetPwdConfirm:boolean;
    private password:string;

    constructor($log:ng.ILogService, $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance, $http:ng.IHttpService,
                AUTHURLS:any, ENV:any, session, $location:ng.ILocationService) {
      this.$log = $log;
      this.$uibModalInstance = $uibModalInstance;
      this.$http = $http;
      this.AUTHURLS = AUTHURLS;
      this.ENV = ENV;
      this.session = session;
      this.$location = $location;
      this.password = '';
    }

    ok() {
        this.$http.post(this.ENV.apiBasePath + this.AUTHURLS.RESETPWD, {
            idUser: this.$location.search().id,
            token: this.$location.search().token,
            newPsw: this.password
        })
        .success(
          (data, status) => {
            this.$log.debug(this.AUTHURLS.RESETPWD, data, status);
            this.resetPwdConfirm = true;
            this.$location.path('/');
          }
        )
        .error(
          (error) => {
            this.error = true;
            this.errorMessage = 'Errore durante il reset della password';
          }
        );
    }

    close() {
      this.$uibModalInstance.dismiss('close modal');
    }
  }

  class ResetPwdDirectiveController {
    static $inject = ['$log', '$uibModal'];
    private $log:ng.ILogService;
    private $uibModal:ng.ui.bootstrap.IModalService;
    private scope:any;

    constructor($log:ng.ILogService, $uibModal:ng.ui.bootstrap.IModalService) {
      this.$log = $log;
      this.$uibModal = $uibModal;
      this.openModal();
    }

    openModal() {
      let options:ng.ui.bootstrap.IModalSettings = {
        animation: true,
        templateUrl: 'scripts/directives/reset-pwd/partials/resetPwdModal.html',
        controller: ResetPwdModalController,
        controllerAs: 'resetPwdModal',
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

  angular.module('nedben.directives').directive('resetPwd', ResetPwdDirective.factory());
}
