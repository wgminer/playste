'use strict';

angular.module('musicApp')
  	.controller('ProfileCtrl', function ($scope, $rootScope, $location, UserService, PlaylistUsersService) {

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

			if (!$rootScope.Users) {

				UserService.getUser()
					.then(function(user){

						PlaylistUsersService.getPlaylistUsers(user.id)
							.then(function(playlists){
								$scope.playlists = playlists;
							}, function(){

							});

					},function(error){
						$location.url('/new');
					});

			} else {
				PlaylistUsersService.getPlaylistUsers($rootScope.User.id)
					.then(function(playlists){
						$scope.playlists = playlists;
					}, function(){

					});
			}

				

		}

		init();

  	});
