'use strict';

angular.module('musicApp')
	.factory('PlaylistService', function ($http, $q, UrlService) {

		var url = UrlService.apiUrl();

		console.log(url);

		var createPlaylist = function(newPlaylist) {

			var deferred = $q.defer();

			$http.post(url+'playlists', newPlaylist)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		var getPlaylist = function(hash) {

			var deferred = $q.defer();

			$http.get(url+'playlists/'+hash)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		var updatePlaylist = function(hash, updatedPlaylist) {

			var deferred = $q.defer();

			$http.post(url+'playlists/'+hash, updatedPlaylist)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		// Public API

		return {
			createPlaylist: createPlaylist,
			getPlaylist: getPlaylist,
			updatePlaylist: updatePlaylist
		};

	});

	