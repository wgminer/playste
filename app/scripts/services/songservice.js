'use strict';

angular.module('musicApp')
	.factory('SongService', function ($http, $q, UrlService) {

		var url = UrlService.apiUrl();

		/**
		 * Get individual songs from the server
		 * @return {object}
		 */
		var getSongs = function() {

			var deferred = $q.defer();

			$http.get(url+'songs')
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
			getSongs: getSongs
		};

	});

	