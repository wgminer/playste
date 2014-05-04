'use strict';

angular.module('musicApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
])
.run(function($rootScope, $http, $location, userService){

	// WHEN THE APP FIRST RUNS
	userService.getUser()
		.then(function(callback){
			$rootScope.User = callback;
			$rootScope.isAuthed = true;
			console.log(callback);
		},function(error){
			$rootScope.isAuthed = false;
		});

	// WHEN EVER YOU GO TO A PAGE THAT IS RESTRICTED...
	$rootScope.$on('$routeChangeStart', function(current, next) {
		if (next.requireLogin) {
			userService.getUser()
				.then(function(callback){
					console.log(callback);
					$rootScope.isAuthed = true;
				},function(error){
					console.log(error);
					$rootScope.isAuthed = false;
					$location.path('/sign-in');
				});
		}
	});

})
.config(function ($routeProvider) {
	$routeProvider
		.when('/new', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.when('/:hash', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.otherwise({
			redirectTo: '/new'
		});
});
