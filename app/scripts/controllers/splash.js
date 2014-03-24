'use strict';

angular.module('musicApp')
  	.controller('SplashCtrl', function ($routeParams, $scope, $rootScope, $interval, $timeout, SongService) {


  		var autoPaste = function() {

  			$scope.demo = [];
			var i = 0;

  			SongService.getSongs()
				.then(function(songs) {

		  			var action = $interval(function(){

		  				if (songs.length > i && !$('#call-to-action input').is(':focus')) {

		  					$scope.placeholder = songs[i].url;

		  					$timeout(function(){

		  						$scope.buttonClick = true;
		  						$scope.placeholder = '';
		  						$scope.demo.unshift(songs[i]);

		  						if ($scope.demo.length > 5) {
		  							$scope.demo.pop();
		  						}

		  						console.log($scope.demo);

			  					$timeout(function(){

				  					i++;
				  					$scope.buttonClick = false;

			  					}, 100);

		  					}, 1000);

			  			} else if (songs.length <= i && !$('#call-to-action input').is(':focus')) {

			  				$scope.demo = [];
							i = 0;
							console.log('reset!');
			  				
			  			} else {

			  				// focued

			  			}

		  			}, 3333);

		  		});


  		}



    	// Private Methods

		var init = function() {

			autoPaste();

		}

  		init();

  	});
