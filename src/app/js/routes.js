'use strict';

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
        .otherwise('/');
    $stateProvider
        .state('splash', {
            url: '/',
            templateUrl: 'views/splash.html',
            controller: 'SplashCtrl'
        })
        .state('playlist', {
            url: '/:id',
            templateUrl: 'views/playlist.html',
            controller: 'PlaylistCtrl'
        })

        
});