'use strict';

angular.module('musicApp')
    .directive('modal', function (UserService) {
        return {
            restrict: 'E',
            scope: {
                show: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            link: function(scope, element, attrs) {
                
                scope.dialogStyle = {};
                
                if (attrs.width) {
                    scope.dialogStyle.width = attrs.width;
                }
                
                if (attrs.height) {
                    scope.dialogStyle.height = attrs.height;
                }
                
                scope.hideModal = function() {
                    scope.show = false;
                };

                scope.loginUser = function(credentials) {

                    UserService.authUser(credentials)
                        .then(function(callback){
                            alert('success: ' + callback);
                        }, function(callback){
                            alert('error: ' + callback);
                        });

                }

                scope.createAccount = function(newUserData) {

                    UserService.createUser(newUserData)
                        .then(function(callback){
                            alert('success: ' + callback);
                        }, function(callback){
                            alert('error: ' + callback);
                        });

                }

            },
            templateUrl: 'views/templates/modal.html' // See below
        };
    });