'use strict';

angular.module('musicApp')
  	.factory('YoutubeAPI', function ($http, $q) {

  		var ytAPIKey = 'AIzaSyCkoszshUaUgV-2CrviQI0I4pTkd8j61gc';

  		var getYTSongData = function(url) {

  			var start = url.lastIndexOf('?v=') + 3;
  			var ytID = url.substring(start, start+11);

  			var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+ytID+'&key='+ytAPIKey;
  			var deferred = $q.defer();

			$http.get(url)
				.success(function(data){
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


