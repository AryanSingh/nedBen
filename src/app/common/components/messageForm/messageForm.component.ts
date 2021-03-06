import { Component, Input, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { MESSAGE_MANAGEMENT, ENV}  from '../../../app.constant';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../../sessionService';

@Component({
  selector: 'messageForm',
  templateUrl: './mesageForm.html',
  styleUrls: ['./mesageForm.scss']
})
export class FooterComponent implements OnInit {
    private ENV:any;
    private MESSAGE_MANAGEMENT:any;
    private idOffer:any;
    private threadType:any;
    private threadData:any;
    private isReply:boolean;
    private reciverUser:any ={};
    private comment:any ={} ;
    private user:any;

    constructor(
        private http: Http,
        private session: SessionService 
    ){};

    ngOnInit(): void {
      this.ENV = ENV;
      this.MESSAGE_MANAGEMENT = MESSAGE_MANAGEMENT;
      this.user=this.session.getUserData();
      // this.$scope.$on('updateprofileimage',()=>{
      //     this.$rootScope.$broadcast('updateMessageTrail','true',this.reciverUser.id );
      // });
    }
    abortComment() {
      this.comment.text=null;
    }
    newComment() {
      if (this.session.getUserData()) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let apiPath=this.ENV.apiBasePath + this.MESSAGE_MANAGEMENT.INSERT;
        this.http.post(apiPath,
          {
            userSender: this.session.getUserData(),
            userReceiver:this.reciverUser,
            message: this.comment.text
          },headers)
          .subscribe(
            (data:any) => {
              // toastr.success('Commento inserito con successo!');
              // this.$rootScope.$broadcast('updateMessageTrail','true',this.reciverUser.id );
              this.comment.text=null;
            },
          
            (err)=>{
                  // toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
             })
      } else {
        // this.$rootScope.$broadcast('Auth-openModal');
      }
    }
}
// module nedben.directives.MessageFormDirective {
//   'use strict';

  

//   class MessageFormDirectiveController {
//     static $inject = ['ENV', 'MESSAGE_MANAGEMENT', '$http', '$log', '$scope', '$rootScope', 'session', '$sce'];

//     private ENV:any;
//     private MESSAGE_MANAGEMENT:any;
//     private $http:ng.IHttpService;
//     private $log:ng.ILogService;
//     private $scope:ng.IScope;
//     private $rootScope:ng.IRootScopeService;
//     private session:any;
//     private $sce:ng.ISCEService;
//     private idOffer:any;
//     private threadType:any;
//     private threadData:any;
//     private isReply:boolean;
//     private reciverUser:any ={};
//     private comment:any ={} ;
//     private user:any;

//     constructor(ENV:any, MESSAGE_MANAGEMENT:any, $http:ng.IHttpService, $log:ng.ILogService, $scope:ng.IScope,
//                 $rootScope:ng.IRootScopeService, session:any, $sce:ng.ISCEService) {
//       this.ENV = ENV;
//       this.MESSAGE_MANAGEMENT = MESSAGE_MANAGEMENT;
//       this.$http = $http;
//       this.$log = $log;
//       this.$scope = $scope;
//       this.$rootScope = $rootScope;
//       this.session = session;
//       this.user=this.session.getUserData();
//             this.$scope.$on('updateprofileimage',()=>{
//                 this.$rootScope.$broadcast('updateMessageTrail','true',this.reciverUser.id );
//             });
//     }

//     abortComment() {
//       this.comment.text=null;
//     }
//     newComment() {
//       if (this.session.getUserData()) {
//         let apiPath=this.ENV.apiBasePath + this.MESSAGE_MANAGEMENT.INSERT;
//         this.$http.post(apiPath,
//           {
//             userSender: this.session.getUserData(),
//             userReceiver:this.reciverUser,
//             message: this.comment.text
//           },
//           {headers:{'Content-Type':'application/json'}})
//           .success(
//             (data:any, status) => {
//               toastr.success('Commento inserito con successo!');
//               this.$rootScope.$broadcast('updateMessageTrail','true',this.reciverUser.id );
//               this.comment.text=null;
//             }
//           )
//           .error((err)=>{
//                   toastr.error('<p><strong>'+err.errorMessage+'</strong></p>');
//                 });
//       } else {
//         this.$rootScope.$broadcast('Auth-openModal');
//       }
//     }    
    
//   }

//   angular.module('nedben.directives').directive('messageForm', MessageFormDirective.factory());
// }
