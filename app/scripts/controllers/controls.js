'use strict';

angular.module('musicApp')
  	.controller('ControlsCtrl', function ($scope, $rootScope, $route, $routeParams, $location, PlayerService, PlaylistService, YoutubeAPI, SoundCloudAPI) {

  		$rootScope.$watch('playlist', function() {
  			console.log('checking');
  			if ($routeParams.hash) {
	  			$scope.savePlaylist();
	  		}
  		});

  		$scope.savePlaylist = function() {

  			// If playlist is NOT saved
  			if (!$scope.isSaved()) {

	  			// If playlist exists just update it
	  			if ($routeParams.hash) {

	  				var updatedPlaylist = $rootScope.playlist.songs;

		  			if (updatedPlaylist.length > 1) {

			  			PlaylistService.updatePlaylist($routeParams.hash, updatedPlaylist)
			  				.then(function(callback){
			  					console.log('updated: ' + callback);
			  					$route.reload();
			  				}, function(error) {
			  					console.log(error);
			  				});

			  		}

	  			// Else create a new playlist	
	  			} else {

		  			var newPlaylist = $rootScope.playlist.songs;

		  			if (newPlaylist.length > 1) {

			  			PlaylistService.createPlaylist(newPlaylist)
			  				.then(function(callback){
			  					console.log('new: ' + callback);
			  					$location.path(callback);
			  				}, function(error) {
			  					console.log(error);
			  				});

			  		} else {
			  			alert('You can\'t have a playlist with only one song!');
			  		}
		  		}

		  	}

  		}

  		$scope.toggleShare = function() {

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

		$scope.previous = function() {
			alert('This does nothing at the moment...');
		}

		$scope.next = function() {
			PlayerService.setPlayerStatus(0);
		}

		$scope.addSong = function(url) {

			if (!$rootScope.addingSong) {

				$rootScope.origPlaylist = angular.copy($rootScope.origPlaylist);

	  			$rootScope.addingSong = true;

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

		  					$rootScope.playlist.songs.unshift(newSong);
		  					
		  					$rootScope.addingSong = false;
		  					$scope.newSongUrl = '';
		  				}, function(error){
		  					console.log(error);
		  					alert('Something went wrong');
		  				});

		  		} else if (url.indexOf('soundcloud') > -1) {

		  			SoundCloudAPI.getSCSongData(url)
		  				.then(function(data){

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

		  					$rootScope.playlist.songs.unshift(newSong);

		  					$rootScope.addingSong = false;
		  					$scope.newSongUrl = '';
		  				}, function(error){
		  					console.log(error);
		  					alert('Something went wrong');
		  				});

		  		} else {

		  			alert('Not a valid source');
		  			$rootScope.addingSong = false;

		  		}

		  	}

  		}

  		$scope.isSaved = function() {

  			var status = false;

  			if ($rootScope.origPlaylist) {

	  			if ($rootScope.origPlaylist.songs == $rootScope.playlist.songs) {
	  				status = true;
	  			}

	  		}

  			return status;
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
