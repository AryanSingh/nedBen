/**
 * Created by Invetech Solutions LLP on 04-oct-2016.
 */
   angular.module('nedben.directives').directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };
            return {
                link: fn_link
            }
        } ])

 
