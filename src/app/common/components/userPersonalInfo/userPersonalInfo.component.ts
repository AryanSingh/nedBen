/**
 * Created by Hyperlink on 15/04/16.
 */
 module nedben.directives.UserPersonalinfoDirective {
   'use strict';
   import IUser = nedben.interfaces.IUser;
   class UserPersonalinfoDirective implements ng.IDirective {
     restrict = 'E';
     controller = UserPersonalinfoDirectiveController;
     controllerAs = 'personalInfoCtrl';
     bindToController = true;
     scope ={
       infoType: "="
     }
     templateUrl = 'scripts/directives/user-personalinfo/partials/user-personalinfo.html';
     static factory():ng.IDirectiveFactory {
       const directive = () => new UserPersonalinfoDirective();
       return directive;
     }
   }
   class UserPersonalinfoDirectiveController {
     static $inject = ['$log', 'session', '$http', 'ENV','$location', '$rootScope','$stateParams','SETTING_MANAGEMENT_URLS'];
     private $log:ng.ILogService;
     private session:any;
     private $http:ng.IHttpService;
     private ENV:any;
     private infoType:any;
     private $location:ng.ILocationService;
     private $rootScope:ng.IRootScopeService;
     private SETTING_MANAGEMENT_URLS:any
     private user:any = {};
     private loginStatus:boolean;
     private userPersonalData:any = {};
     constructor($log:ng.ILogService, session:any, $http:ng.IHttpService, ENV:any,$location:ng.ILocationService,
       $rootScope:ng.IRootScopeService,$stateParams:any,SETTING_MANAGEMENT_URLS:any) {
       this.$log = $log;
       this.$http = $http;
       this.ENV = ENV;
       this.session=session;
       this.$location = $location;
       this.$rootScope = $rootScope;
       this.SETTING_MANAGEMENT_URLS=SETTING_MANAGEMENT_URLS;
       this.loginStatus = this.session.getUserId() > 0 ? true : false;
       this.user = this.session.getUserData() ? this.session.getUserData() : {};
       if(this.loginStatus){
         this.getUserPersonalInfo(); 
       }else{
         this.$rootScope.$broadcast('Auth-openModal');
       }
       
     }

     getUserPersonalInfo(){
         this.$http.post(this.ENV.apiBasePath+this.SETTING_MANAGEMENT_URLS.GET_USER_PERSONALINFO,
           {idUser:this.user.id,idPersonalInfoType:this.infoType},{headers:{'Content-Type': 'application/json'}})
         .success((data,status)=>{
           this.userPersonalData=data['personalInfos'];
         })
         .error((err)=>{
           console.log(err);
         });
     }

     updatePersonalInfo(data){
       if(this.infoType===1 ){
         angular.forEach(this.userPersonalData,function(val,key){
           if(val['idPersonalInfo']===data['idPersonalInfo']){
              data['enabled']=true;
           }else{
             val['enabled']=false;
           }
         });

       }else if(this.infoType===2){
         angular.forEach(this.userPersonalData,function(val,key){
             if(val['idPersonalInfo']===data['idPersonalInfo']){
              data['enabled']=true;
              }else{
             val['enabled']=false;
             }
         });
       } else{
         if(data['enabled']===true){
         data['enabled']=false;
       }else{
         data['enabled']=true;
       }
       }
       
       if(this.loginStatus) {
         this.$http.post(this.ENV.apiBasePath+this.SETTING_MANAGEMENT_URLS.UPDATE_USER_PERSONALINFO,
           {idUser:this.user.id,idPersonalInfo:data['idPersonalInfo'],enabled:data['enabled']},
           {headers:{'Content-Type': 'application/json'}})
         .success((data,status)=>{
           toastr.success('Personal aggiornamento informazioni con successo..!');          
         })
         .error((err)=>{
           console.log(err);
         });
       }else{
         this.$rootScope.$broadcast('Auth-openModal');
       }

     }

   };
   angular.module('nedben.directives').directive('userPersonalinfo', UserPersonalinfoDirective.factory());
 }