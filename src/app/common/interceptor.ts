
// export class XhrInterceptor {
//     static $inject = ['$q', 'notifications'];

//     private $q:ng.IQService;
//     private notifications:any;

//     public static Factory($q:ng.IQService, notifications:any) {
//       return new XhrInterceptor($q, notifications);
//     }

//     constructor($q:ng.IQService, notifications:any) {
//       this.$q = $q;
//       this.notifications = notifications;
//     }

//     public response = (response) => {
//       return response || this.$q.when(response);
//     };

//     public responseError = (rejection) => {
//       if (rejection.status === 500) {
//         toastr.error('<p><strong>'+rejection.data.errorMessage+'</strong></p>');
//         // toastr.error('<p><strong>Si è verificato un errore, riprovare più tardi</strong></p>' +
//         //   '[<small><em>' + rejection.data.errorUri + '</em>: ' + rejection.data.errorMessage + '</small>]', 'Errore Xhr');
//       }
//       return this.$q.reject(rejection);
//     };
//   }

//   angular.module('nedben.commons')
//     .factory('XhrInterceptor', ['$q', 'notifications', XhrInterceptor.Factory]);
// }
