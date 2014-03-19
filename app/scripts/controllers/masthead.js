'use strict';

angular.module('musicApp')
  	.controller('MastheadCtrl', function ($scope, $rootScope, $routeParams, $location, PlayerService, PlaylistService, YoutubeAPI, SoundCloudAPI) {

  		$scope.savePlaylist = function() {

  			// If playlist exists just update it
  			if ($routeParams.hash) {


  			// Else create a new playlist	
  			} else {

	  			var newPlaylist = PlaylistService.getPlaylist();

	  			if (newPlaylist.length > 1) {

		  			PlaylistService.createPlaylist(newPlaylist)
		  				.then(function(callback){
		  					alert(callback);
		  					$location.path(callback);
		  				});
		  		} else {
		  			alert('You can\'t have a playlist with only one song!');
		  		}
	  		}

  		}
	
  		$scope.togglePlay = function() {

  			if (PlayerService.getPlayerStatus() == 2) {

				if (PlayerService.getPlayerData().source == 'youtube'){
					PlayerService.getPlayer().playVideo();
				} else if(PlayerService.getPlayerData().source == 'soundcloud'){ 
					PlayerService.getPlayer().play();
				}

			} else if (PlayerService.getPlayerStatus() == 1) {

				if (PlayerService.getPlayerData().source == 'youtube'){
					PlayerService.getPlayer().pauseVideo();
				} else if(PlayerService.getPlayerData().source == 'soundcloud'){ 
					PlayerService.getPlayer().pause();
				}
			
			} else {

				$rootScope.playFirst();

			}
		}

		$scope.next = function() {
			PlayerService.setPlayerStatus(0);
		}

		$scope.addSong = function(url) {

  			$scope.addingSong = true;

  			if (url.indexOf('youtu') > -1) {

	  			YoutubeAPI.getYTSongData(url)
	  				.then(function(data){

	  					if (data.items[0].snippet.thumbnails.maxres) {
	  						var imageUrl = data.items[0].snippet.thumbnails.maxres.url;
	  					} else {
	  						var imageUrl = data.items[0].snippet.thumbnails.high.url;
	  					}

	  					var newSong = {
	  						title: data.items[0].snippet.title,
	  						image: imageUrl,
	  						url: 'https://www.youtube.com/watch?v='+data.items[0].id,
	  						source: 'youtube',
	  						sourceId: data.items[0].id,
	  					}

	  					PlaylistService.addToPlaylist(newSong);
	  					
	  					$scope.addingSong = false;
	  					$scope.newSongUrl = '';
	  				});

	  		} else if (url.indexOf('soundcloud') > -1) {

	  			SoundCloudAPI.getSCSongData(url)
	  				.then(function(data){

	  					console.log(data);

	  					if (data.artwork_url) {
	  						var image = data.artwork_url;
	  					} else {
	  						var image = data.user.avatar_url;
	  					}

	  					var newSong = {
	  						title: data.title,
	  						image: image.replace('large', 't500x500'),
	  						url: data.permalink_url,
	  						source: 'soundcloud',
	  						sourceId: data.id,
	  					}

	  					PlaylistService.addToPlaylist(newSong);

	  					$scope.addingSong = false;
	  					$scope.newSongUrl = '';
	  				});

	  		} else {

	  			alert('Not a valid source');

	  		}

  		}


		var init = function() {

			$scope.$watch(PlayerService.getPlayerData, function(data) {

				$scope.playing = data;

			}, true);

			$scope.$watch(PlayerService.getPlayerStatus, function(status) {

				$scope.playerStatus = status;

			}, true);
		}

		init();

  });
