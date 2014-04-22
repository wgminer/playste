'use strict';

angular.module('musicApp')
  	.controller('SplashCtrl', function ($routeParams, $scope, $rootScope, $location, $interval, $timeout, SongService, YoutubeAPI, SoundCloudAPI) {

  		/**
  		 * Sets up new playlist
  		 * @param  {string} url
  		 * @return {undefined}
  		 */
  		$scope.startPlaylist = function(url) {
  			
  			$rootScope.sentSongUrl = url;

  			$location.path('/new');

  		}

  		/**
  		 * Runs the animation on the splash page
  		 * @return {undefined}
  		 */
  		var autoPaste = function() {

  			$scope.demo = [];
			var i = 0;

  			SongService.getSongs()
				.then(function(songs) {

		  			// var action = $interval(function(){

		  			// 	if (songs.length > i && !$('#call-to-action input').is(':focus')) {

		  			// 		$scope.placeholder = songs[i].url;

		  			// 		$timeout(function(){

		  			// 			$scope.buttonClick = true;
		  			// 			$scope.placeholder = '';
		  			// 			$scope.demo.unshift(songs[i]);

		  			// 			if ($scope.demo.length > 5) {
		  			// 				$scope.demo.pop();
		  			// 			}

		  			// 			console.log($scope.demo);

			  		// 			$timeout(function(){

				  	// 				i++;
				  	// 				$scope.buttonClick = false;

			  		// 			}, 100);

		  			// 		}, 1000);

			  		// 	} else if (songs.length <= i && !$('#call-to-action input').is(':focus')) {

			  		// 		$scope.demo = [];
							// i = 0;
							// console.log('reset!');
			  				
			  		// 	} else {

			  		// 		clearInterval(action);

			  		// 	}

		  			// }, 3333);

		  		});


  		}



    	// Private Methods

    	/**
    	 * Run it!
    	 * @return {undefined}
    	 */
		var init = function() {

			autoPaste();

		}

  		init();

  	});
