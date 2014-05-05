'use strict';

angular.module('musicApp')
  	.controller('ModalCtrl', function ($scope, $rootScope, $route, $routeParams, $timeout, $location, UserService) {

        $rootScope.toggleModal = function(name) {

            if ( name == 'login') {
                console.log(name);
                $scope.isCreateAccountModalVisible = false;
                $scope.isLoginModalVisible = !$scope.isLoginModalVisible;
            } else if ( name == 'createAccount') {
                $scope.isLoginModalVisible = false;
                $scope.isCreateAccountModalVisible = !$scope.isCreateAccountModalVisible;
            }

        }

  		$scope.hideModals = function() {
            $scope.isCreateAccountModalVisible,
            $scope.isLoginModalVisible = false;
        };

        $scope.loginUser = function(credentials) {

            UserService.authUser(credentials)
                .then(function(callback){
                    $scope.hideModals();

                    UserService.getUser()
                        .then(function(callback){
                            $rootScope.User = callback;
                            $rootScope.isAuthed = true;
                            console.log(callback);
                        },function(error){
                            $rootScope.isAuthed = false;
                        });
                    
                }, function(callback){
                    console.log('error: ' + callback);
                });

        }

        $scope.createUser = function(newUserData) {

            UserService.createUser(newUserData)
                .then(function(callback){
                    console.log('success: ' + callback);
                    $scope.hideModals();
                    $scope.$apply();
                }, function(callback){
                    console.log('error: ' + callback);
                });

        }

		var init = function() {

            $scope.hideModals();

		}

  		init();

  	});
