'use strict';

angular.module('musicApp')
  	.controller('UserCtrl', function ($scope, $rootScope, $routeParams, $location, UserService, PlaylistUsersService) {

		$scope.toggleLoginModal = function() {
		    $scope.modalShown = !$scope.modalShown;
		};

		$scope.toggleDropdown = function() {
		    $scope.isDropdownVisible = !$scope.isDropdownVisible;
		};

		$scope.signOut = function() {
			UserService.unauthUser()
				.then(function(){
					$location.url('/new');
					$scope.isDropdownVisible = false;
					$rootScope.isAuthed = false;
				});
		}

		var init = function() {

			if ($routeParams.name) {

				UserService.getUser($routeParams.name)
					.then(function(user){

						PlaylistUsersService.getPlaylistUsers(user.id)
							.then(function(playlists){								
								if (Array.isArray(playlists)) {
									$scope.playlists = playlists;
								} else {
									$scope.playlists = [playlists];
								}
							}, function(){

							});

					},function(error){
						$location.url('/new');
					});

			}				

		}

		init();

  	});
