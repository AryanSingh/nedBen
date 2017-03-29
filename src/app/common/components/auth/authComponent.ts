/**
	* Created by Hyperlink on 04/04/16.
	*/
module authDirectives {
		'use strict';

		class LoginDirective implements ng.IDirective {
				restrict = 'A';
				controller = LoginDirectiveController;
				controllerAs = 'login';
				bindToController = true;
				scope = true;

				static factory():ng.IDirectiveFactory {
						const directive = () => new LoginDirective();

						return directive;
				}
		}

				class LoginModalController {
								static $inject = ['$log', '$uibModalInstance', '$http', 'AUTHURLS', 'ENV', 'session', '$rootScope', '$state', '$location'];

								private $log:ng.ILogService;
								private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance;
								private $http:ng.IHttpService;
								private AUTHURLS:any;
								private ENV:any;
								private session:any;
								private rootSscope:ng.IRootScopeService;
								private $state:ng.ui.IStateService;
								private $location:ng.ILocationService;

								private user:string;
								private password:string;
								private email:string;

								private states: any;
								private state: any;

								private error:boolean = false;
								private errorMessage:string;

								constructor($log:ng.ILogService, $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance, $http:ng.IHttpService,
								AUTHURLS:any, ENV:any, session, $rootScope:ng.IRootScopeService, $state:ng.ui.IStateService,
								$location:ng.ILocationService) {
												this.$log = $log;
												this.$uibModalInstance = $uibModalInstance;
												this.$http = $http;
												this.AUTHURLS = AUTHURLS;
												this.ENV = ENV;
												this.session = session;
												this.rootSscope = $rootScope;
												this.$state = $state;
												this.$location = $location;
												this.rootSscope.$broadcast('checkSession');
												this.states = {
																STATE_LOGIN: 'LOGIN',
																STATE_PASSWORD_RECOVERY: 'PASSWORD-RECOVERY',
																STATE_RECOVERY_OK: 'RECOVERY-OK'
												};
												this.state = this.states.STATE_LOGIN;
								}

								ok() {
												if ( this.state === this.states.STATE_LOGIN ) {
																this.$http.post(this.ENV.authBasePath + this.AUTHURLS.LOGIN, 'user=' + this.user + '&password=' + this.password,
																				{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
																				.success(
																								(data, status) => {
																												this.session.setUserData(data);
																												this.rootSscope.$broadcast('checkSession');
																													this.rootSscope.$broadcast('websocketopen');
																												this.$uibModalInstance.close();
																												this.$state.reload();

																								}
																				)
																				.error(
																								(error) => {
																												this.error = true;
																												this.errorMessage = error.errorMessage;
																								}
																				);
												}
								}
								recovery() {
												if ( this.state === this.states.STATE_PASSWORD_RECOVERY ) {
																this.$http.post(
																				this.ENV.apiBasePath + this.AUTHURLS.RECOVERY,
																				JSON.stringify({ email: this.email}),
																				{
																								headers: {'Content-Type': 'application/json'}
																				}
																)
																.success(
																				(data, status) => {
																								// avvisa utente per invio email
																								this.toState(this.states.STATE_RECOVERY_OK);
																				}
																)
																.error(
																				(error) => {
																								// l'utente non e' registrato 
																								this.toState(this.states.STATE_RECOVERY_OK);
																				}
																);
												}
								}

								close() {
												this.$uibModalInstance.dismiss('close modal');
								}
								home() {
												this.$location.path('/home');
												this.close();
								}

								toState(newState) {
												this.state = newState;
								}
								isInState(checkState) {
												return this.state === checkState;
								}

				}

		class LoginDirectiveController {
				static $inject = ['$log', '$uibModal', '$scope'];

				private $log:ng.ILogService;
				private $uibModal:ng.ui.bootstrap.IModalService;
				private $scope:ng.IScope;
				private scope:any;

				constructor($log:ng.ILogService, $uibModal:ng.ui.bootstrap.IModalService, $scope:ng.IScope) {
						this.$log = $log;
						this.$uibModal = $uibModal;
						this.$scope = $scope;

						this.$scope.$on('Auth-openModal', () => {
								this.openModal();
						});
				}

				openModal() {
						let options:ng.ui.bootstrap.IModalSettings = {
								animation: true,
								templateUrl: 'scripts/directives/auth/partials/loginModal.html',
								controller: LoginModalController,
								controllerAs: 'loginModal',
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

		angular.module('nedben.directives').directive('loginDirective', LoginDirective.factory());
}
