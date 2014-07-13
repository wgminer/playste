'use strict';

angular.module('musicApp')
  	.controller('ModalCtrl', function ($scope, $rootScope, $route, $routeParams, $timeout, $location, UserService, PlaylistService) {

        $rootScope.toggleModal = function(name, data1, data2) {

            $scope.hideModals();
            console.log(name);

            if ( name == 'login') {
                $scope.isLoginModalVisible = !$scope.isLoginModalVisible;
            } else if ( name == 'createAccount') {
                $scope.isCreateAccountModalVisible = !$scope.isCreateAccountModalVisible;
            } else if ( name == 'share') {
                $scope.isShareModalVisible = !$scope.isShareModalVisible;
            } else if ( name == 'delete') {
                $scope.isDeleteModalVisible = !$scope.isDeleteModalVisible;
                $scope.deletedPlaylist = data1;
                $scope.deletedPlaylistIndex = data2;
            }

        }

  		$scope.hideModals = function() {
            $scope.isCreateAccountModalVisible = false;
            $scope.isLoginModalVisible = false;
            $scope.isDeleteModalVisible = false;
            $scope.isShareModalVisible = false;
        };

        $scope.loginUser = function(credentials) {

            UserService.authUser(credentials)
                .then(function(callback){
                    
                    $scope.hideModals();

                    UserService.getAuthedUser()
                        .then(function(callback){
                            $rootScope.User = callback;
                            $rootScope.isAuthed = true;
                            $scope.login = '';
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
                    $scope.newUser = '';
                }, function(callback){
                    console.log('error: ' + callback);
                });

        }

        $scope.deletePlaylist = function() {
            PlaylistService.deletePlaylist($scope.deletedPlaylist.id)
                .then(function(){
                    $rootScope.playlists.splice($scope.deletedPlaylistIndex, 1);
                    console.log('deleted: ' + $scope.deletedPlaylist);
                    $scope.hideModals();
                }, function(callback){
                    console.log('error!');
                    $scope.hideModals();
                })
        }

		var init = function() {

            $scope.hideModals();

		}

  		init();

  	});
