import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ENV, USER_MANAGEMENT, AUTHURLS }  from '../../../app.constant';
import { SessionService } from '../../sessionService';

@Component({
  selector: 'profileAvatar',
  templateUrl: './profileAvatar.html',
  styleUrls: ['./profileAvatar.scss']
})
export class ProfileAvatarComponent implements OnInit {
    
	private FileUploader:any;
	private ENV:any;
	private USER_MANAGEMENT:any;
	private AUTHURLS:any;
	private user:any;
	private savedAvatar:any;
	private currentUser:any;
	private formdata:any;
	private imageSource:any;
	private uploadImageURL:any;
	private myCroppedImage:any;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
        
		this.AUTHURLS=AUTHURLS;
		this.ENV = ENV;      
		this.USER_MANAGEMENT=USER_MANAGEMENT;
		this.user=this.session.getUserFullDeatil();
		this.currentUser=this.session.getUserData() ? this.session.getUserData() : {};
}
	module nedben.directives.ProfileAvatarDirective {
			'use strict';
			class ProfileAvatarDirective implements ng.IDirective {
					restrict = 'A';
					controller = ProfileAvatarDirectiveController;
					controllerAs = 'avatar';
					bindToController = true;
					scope = true;

					static factory():ng.IDirectiveFactory {
							const directive = () => new ProfileAvatarDirective();
							return directive;
					}
			}

			class ProfileAvatarModalController {
					static $inject = ['$log','$scope', '$uibModalInstance', '$http','ENV','USER_MANAGEMENT','session', '$rootScope','AUTHURLS'];

					private $log:ng.ILogService;
					private FileUploader:any;
					private $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance;
					private $http:ng.IHttpService;
					private ENV:any;
					private USER_MANAGEMENT:any;
					private AUTHURLS:any;
					private $scope:ng.IScope;
					private session:any;
					private $rootScope:ng.IRootScopeService;
					private scope:any;
					private user:any;
					private savedAvatar:any;
					private currentUser:any;
					private formdata:any;
					private imageSource:any;
					private uploadImageURL:any;
					private myCroppedImage:any;




					
					constructor($log:ng.ILogService,$scope:ng.IScope, $uibModalInstance:ng.ui.bootstrap.IModalServiceInstance, $http:ng.IHttpService,
							ENV:any,USER_MANAGEMENT:any,session:any, $rootScope:ng.IRootScopeService,AUTHURLS:any) {
							this.$log = $log;
							this.$uibModalInstance = $uibModalInstance;
							this.$http = $http;
							this.$scope = $scope;
							this.AUTHURLS=AUTHURLS;
							this.ENV = ENV;      
							this.USER_MANAGEMENT=USER_MANAGEMENT;
							this.session = session;
							this.user=this.session.getUserFullDeatil();
							this.currentUser=this.session.getUserData() ? this.session.getUserData() : {};
							this.$rootScope = $rootScope; 
					}

					getTheFiles($files) {
							this.formdata = new FormData();         
							this.formdata.append('file',$files[0]);
							this.formdata.append('idUser',this.currentUser.id);
							this.uploadFile();
					};
					uploadFile(){        
							if(this.session.getUserData()){ 
									if(this.imageSource==='WEB'){
											this.updateUserProfile({idUser:this.user.user.id,urlAvatar:this.uploadImageURL});
									}else if(this.imageSource==='NEDBEN'){
											this.updateUserProfile({idUser:this.user.user.id,urlAvatar:this.uploadImageURL});
									}else if(this.imageSource==='LOCAL'){
												this.$http({
													url: this.ENV.apiBasePath+this.USER_MANAGEMENT.UPLOAD_AVATAR,
													method: "POST",
													headers: {'Content-Type': undefined },
													data: this.formdata
											})
											.success((data,status)=>{             
													this.uploadImageURL= data['imageUrl'];
													this.updateUserProfile({idUser:this.user.user.id,urlAvatar:this.uploadImageURL});
											})
											.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

									}else{
											toastr.error('Inavalid selection.');
									}
									
							}else{
									this.$rootScope.$broadcast('Auth-openModal');
							}
					}

					removeAvatar(avatarIndex){
								if(this.session.getUserData()){ 
											this.$http({
													method:'DELETE',
													url:this.ENV.apiBasePath+this.USER_MANAGEMENT.REMOVE_AVATAR,
													data:{ idAvatar: this.savedAvatar[avatarIndex]['idAvatar'] },
													headers: {'Content-Type': 'application/json'}
													}).success((data,status)=>{
															toastr.success('Avatar remove successfully.');
															this.savedAvatar.splice(avatarIndex,1);
													})
													.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
										}else {
												this.$rootScope.$broadcast('Auth-openModal');
										}

					}


					updateUserProfile(userdata){
							this.$http.post(this.ENV.apiBasePath+this.USER_MANAGEMENT.UPDATE_USER,userdata,{headers: {'Content-Type': 'application/json'}})
									.success((data,status)=>{
											if(data){
												this.currentUser.urlAvatar= this.user.user.urlAvatar=userdata.urlAvatar;
													this.session.setUserFullDeatil(this.user);
													this.session.setUserData(this.currentUser);
													this.$rootScope.$broadcast('updateprofileimage');
													this.updateSessionUserAvtar();
													this.close();
											}
									})
								.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});
					}


					updateSessionUserAvtar(){
								this.$http.get(this.ENV.authBasePath + this.AUTHURLS.UPDATE_AVTAR,
								{})
								.success((data) => {

									})
								.error((err)=>{

								});
					}

					getSavedAvatar(){

							this.$http.post(this.ENV.apiBasePath+this.USER_MANAGEMENT.GET_AVATAR,
											{ idUser: this.user.user.id }
									,{headers: {'Content-Type': 'application/json'}})
									.success((data,status)=>{
											if(data){
													this.savedAvatar=data;
											}
									})
									.error((err)=>{
									toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
								});

					}

					selectImage(selectedAvatar){
							this.uploadImageURL=selectedAvatar.urlAvatar;
							this.uploadFile();
					}

					close() {
							this.$uibModalInstance.dismiss('close modal');
					}

			}

			class ProfileAvatarDirectiveController {
					static $inject = ['$log', '$uibModal', '$scope'];
					private $log:ng.ILogService;
					private $uibModal:ng.ui.bootstrap.IModalService;
					private $scope:ng.IScope;
					private scope:any;
					constructor($log:ng.ILogService, $uibModal:ng.ui.bootstrap.IModalService, $scope:ng.IScope) {
							this.$log = $log;
							this.$uibModal = $uibModal;
							this.$scope = $scope;
							this.$scope.$on('Avatar-openModal', () => {
									this.openModal();
							});
					}

					openModal() {
							let options:ng.ui.bootstrap.IModalSettings = {
									animation: true,
									templateUrl: 'scripts/directives/profile-avatar/partials/profile-avatar.html',
									controller: ProfileAvatarModalController,
									controllerAs: 'avatarModal',
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

			angular.module('nedben.directives').directive('profileAvatar', ProfileAvatarDirective.factory());
	}



