'use strict';

angular.module('musicApp')
  	.factory('UserService', function ($http, $q, $location, UrlService) {

  		var url = UrlService.apiUrl() + 'users';
  		
		var createUser = function(userData) {
			
			var deferred = $q.defer();

			$http.post(url, userData)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;

		}

		var getAuthedUser = function(){

			var deferred = $q.defer();

			$http.get(url+'/getAuthed')
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;
		
		};

		var getUser = function(name){

			var deferred = $q.defer();

			$http.get(url + '/' + name)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;
		
		};

		var authUser = function(credentials) {

			var deferred = $q.defer();
			
			$http.post(url+'/auth', credentials)
				.success(function(data){
					deferred.resolve(data);
				})
				.error(function(){
					deferred.reject();
				});

			return deferred.promise;
		}

		var unauthUser = function() {

			var deferred = $q.defer();

			$http.post(url+'/unauth')
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
			createUser: createUser,
			getUser: getUser,
			getAuthedUser: getAuthedUser,
			authUser: authUser,
			unauthUser: unauthUser
		};

	});
