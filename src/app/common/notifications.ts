


// export class Notifications {
//     static $inject = ['$log'];

//     private $log:ng.ILogService;
//     private notifyToastr:any;

//     public static Factory($log:ng.ILogService) {
//       return new Notifications($log);
//     }

//     constructor($log:ng.ILogService) {
//       this.$log = $log;

//       this.notifyToastr = angular.copy(toastr);
//       this.notifyToastr.options.containerId = 'notify-toast-container';
//       // this.notifyToastr.options.positionClass = 'toast-top-full-width';
//       this.notifyToastr.clear();
//     }

//     badgeNotify(objectData) {
//       this.notifyToastr.info('<div class="outer-container"><div class="inner-container">'+
//         '<div class="media"><div class="media-left"><a href=""><img class="media-object"'+
//         ' src="'+objectData['urlImg']+'" alt="...">'+
//         ' </a></div><div class="media-body"><h4 class="badge-title">'+objectData['badgeName']+'</h4><h4 class="badge-subtitle">'+objectData['badgeType']+'</h4>'+
//         '<div class="badge-description">'+objectData['badgeDescription']+'</div>'+'</div></div></div></div>', {
//         closeButton: true,
//         progressBar: true,
//         timeOut: 3000000,
//         tapToDismiss: false,
//         extendedTimeOut: 3000000,
//         allowHtml: true,
//         iconClass: ''
//       });
//     }
//   }

//   angular.module('nedben.commons').service('notifications', ['$log', Notifications.Factory]);
// }
