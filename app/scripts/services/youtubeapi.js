'use strict';

angular.module('musicApp')
	.factory('YoutubeAPI', function ($http, $q) {

		var ytAPIKey = 'AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc';

		/**
		 * Grab song data fron YT api
		 * @param  {string} url
		 * @return {object}
		 */
		var getYTSongData = function(url) {

			console.log('calling');

			// Check if it's a full youtube URL
			if (url.lastIndexOf('?v=') > -1) {
				var start = url.lastIndexOf('?v=') + 3;

			// Else check if it's a shared URL
			} else if (url.lastIndexOf('.be/') > -1) {
				var start = url.lastIndexOf('.be/') + 4;
			} else {
				return 'error!';
			}

			var ytID = url.substring(start, start+11);
			var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ytID+'&key='+ytAPIKey;
			var deferred = $q.defer();

			$http.get(url)
				.success(function(data){
					console.log('done');
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		return {
			getYTSongData: getYTSongData
		}

	});


