import { Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ADVICE_MANAGEMENT_URLS, ENV}  from '../../../app.constant';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { SessionService } from '../../sessionService';
import { TimeService } from '../../timeService';


@Component({
  selector: 'advice',
  templateUrl: './advice.html',
  styleUrls: ['./advice.scss']
})
export class AdviceComponent implements OnInit {
    
  
  private session:any;
  private timeFactory:any;
  private adviceData:any;
  private adviceId:number;

  constructor(
      private http: Http,
      private sessionService: SessionService,
      private timeService: TimeService
      
  ){};

  ngOnInit(): void {
     this.getAdvice();
  }

  getAdvice() {
    this.http.post(ENV.apiBasePath + ADVICE_MANAGEMENT_URLS.GET_DETAIL,
      {
        idForum: this.adviceId,
        idLoggedUser: this.session.getUserData() ? this.session.getUserData().id : null
      }
    )
    .map(res => res.json())
    .subscribe(
      (data:any) => {
        this.adviceData = data.data;
        let convertDate= new Date(this.adviceData['dateIns']).getTime();
        if(this.timeService.getTimeSince(convertDate)!=='false'){
          this.adviceData['dateIns']=this.timeService.getTimeSince(convertDate);
        }
      },
      (err) => {
        console.log('GETA ADVICE ERROR: ');
      }
    );
  }
  // loadCategoryOffer(selectedObject){
    
  //   this.$rootScope.$broadcast('adviceList-updateList',selectedObject);
  // }

    
}

 



// module nedben.directives.adviceDirective {
//   'use strict';

//   class AdviceDirective implements ng.IDirective {
//     restrict = 'E';
//     controller = AdviceDirectiveController;
//     controllerAs = 'advice';
//     bindToController = true;
//     templateUrl = 'scripts/directives/advice/partials/advice.html';
//     scope = {
//       adviceId: '=',
//     };

//     static factory():ng.IDirectiveFactory {
//       const directive = () => new AdviceDirective();

//       return directive;
//     }
//   }

//   class AdviceDirectiveController {
//     static $inject = ['$log', '$http', 'ENV', 'ADVICE_MANAGEMENT_URLS', 'session','timeFactory','$rootScope'];

//     private $log:ng.ILogService;
//     private $http:ng.IHttpService;
//     private $rootScope:ng.IRootScopeService;
//     private ENV:any;
//     private ADVICE_MANAGEMENT_URLS:any;
//     private session:any;
//     private timeFactory:any;
//     private adviceData:any;
//     private adviceId:number;

//     constructor($log:ng.ILogService, $http:ng.IHttpService, ENV:any, ADVICE_MANAGEMENT_URLS:any, session:any,timeFactory:any,$rootScope:ng.IRootScopeService) {
//       this.$log = $log;
//       this.$http = $http;
//       this.ENV = ENV;
//       this.$rootScope = $rootScope;
//       this.ADVICE_MANAGEMENT_URLS = ADVICE_MANAGEMENT_URLS;
//       this.session = session;
//       this.timeFactory=timeFactory;
//       this.getAdvice();
//     }

//     getAdvice() {
//       this.http.post(this.ENV.apiBasePath + this.ADVICE_MANAGEMENT_URLS.GET_DETAIL,
//         {
//           idForum: this.adviceId,
//           idLoggedUser: this.session.getUserData() ? this.session.getUserData().id : null
//         }
//       ).then(
//         (data) => {
//           this.adviceData = data.data;
//           let convertDate= new Date(this.adviceData['dateIns']).getTime();
//           if(this.timeFactory.getTimeSince(convertDate)!=='false'){
//             this.adviceData['dateIns']=this.timeFactory.getTimeSince(convertDate);
//           }
//         },
//         (reason) => {
//           this.$log.debug('GETA ADVICE ERROR: ', reason);
//         }
//       );
//     }
//     loadCategoryOffer(selectedObject){
      
//       this.$rootScope.$broadcast('adviceList-updateList',selectedObject);
//     }

//   }

//   angular.module('nedben.directives').directive('advice', AdviceDirective.factory());
// }
