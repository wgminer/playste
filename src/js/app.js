var app = angular.module('playste', ['firebase', 'ui.router', 'angularMoment']);

app.run(function () {

    SC.initialize({
        client_id: 'e732213f2ca2d1ca96c10924da125f83',
        redirect_uri: 'http://localhost:3000/#/connect'
    });
    
});