'use strict';

angular.module('musicApp')
	.factory('PlaylistService', function ($http, $q) {

		var url = 'http://localhost/ng-music/api/index.php/'

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


		// Public API

		return {
			createPlaylist: createPlaylist,
			getPlaylist: getPlaylist
		};

	});

	