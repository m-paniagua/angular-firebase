var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'firebase']);

myApp.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
        if(error == 'AUTH_REQUIRED') {
            $rootScope.message = 'Sorry, you must log in to access that page';
            $location.path('/login');
        }    
    });
}]);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'RegistrationController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegistrationController'
        })
        .when('/meetings', {
            templateUrl: 'views/meetings.html',
            controller: 'MeetingsController',
            resolve: {
                currentAuth: function(Authentication) {
                    return Authentication.requireAuth();
                }
            }
        })
        .when('/checkins/:uid/:mid', {
            templateUrl: 'views/checkins.html',
            controller: 'CheckInsController'
        })
        .when('/checkins/:uid/:mid/checkinslist', {
            templateUrl: 'views/checkinslist.html',
            controller: 'CheckInsController'
        })
        .otherwise({
            redirectTo: '/meetings'
        });
}]);