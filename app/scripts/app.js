'use strict';

angular.module('musicApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
])
.run(function($rootScope, $http, $location, UserService){

	// WHEN THE APP FIRST RUNS
	UserService.getUser()
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
			UserService.getUser()
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
		.when('/profile', {
		  templateUrl: 'views/profile.html',
		  controller: 'ProfileCtrl'
		})
		.when('/:hash', {
			templateUrl: 'views/playlist.html',
			controller: 'PlaylistCtrl'
		})
		.otherwise({
			redirectTo: '/new'
		});
});
