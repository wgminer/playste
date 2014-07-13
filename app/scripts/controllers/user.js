'use strict';

angular.module('musicApp')
  	.controller('UserCtrl', function ($scope, $rootScope, $routeParams, $location, UserService, PlaylistUsersService, PlaylistService) {

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

								if (playlists != 'false') {							
									if (Array.isArray(playlists)) {
										$rootScope.playlists = playlists;
									} else {
										$rootScope.playlists = [playlists];
									}
								} else {
									$rootScope.playlists = false;
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
