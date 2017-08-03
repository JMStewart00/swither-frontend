import appComponent from './app.component';
import loginComponent from './login/login.component';
import navbarComponent from './navbar/navbar.component';
import dashboardComponent from './dashboard/dashboard.component';
import landingComponent from './landing/landing.component';
import newEventComponent from './newEvent/newEvent.component';
import swipeScreenComponent from './swipeScreen/swipeScreen.component';
import apiService from './resource.services.js';


// instantiation of the module of app, where injections will go.
angular.module('app', ['ui.router', 'satellizer', 'ngResource'])
.component('app', appComponent)
.component('login', loginComponent)
.component('navbar', navbarComponent)
.component('dashboard', dashboardComponent)
.component('landing', landingComponent)
.component('newEvent', newEventComponent)
.component('swipeScreen', swipeScreenComponent)
.factory('apiService', apiService)

//configuration add-on
.config(($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) => {

        // authentication routes definitions
        $authProvider.loginUrl = 'http://localhost:7000/oauth/token';
        $authProvider.signupUrl = 'http://localhost:7000/register';

        // says to route to / on unknown or undefined routes.
        $urlRouterProvider.otherwise('/');

        // states
        $stateProvider
                .state('landing', {
                        url: '/',
                        templateUrl: './app/landing/landing.html',
                        controller: landingComponent.controller,
                        controllerAs: '$ctrl'
                })               
                .state('login', {
                        url: '/login',
                        templateUrl: './app/login/login.html',
                        controller: loginComponent.controller,
                        controllerAs: '$ctrl'
                })
                .state('register', {
                        url: '/register',
                        templateUrl: './app/login/register.html',
                        controller: loginComponent.controller,
                        controllerAs: '$ctrl'
                })
                .state('auth.dashboard', {
                        url: '/dashboard',
                        templateUrl: './app/dashboard/dashboard.html',
                        controller: dashboardComponent.controller,
                        controllerAs: '$ctrl'
                })
                .state('auth.new', {
                        url: '/newevent',
                        templateUrl: './app/newEvent/newEvent.html',
                        controller: newEventComponent.controller,
                        controllerAs: '$ctrl'
                })
                .state('auth.swipes', {
                        url: '/swipes',
                        templateUrl: './app/swipeScreen/swipeScreen.html',
                        controller: swipeScreenComponent.controller,
                        controllerAs: '$ctrl'
                })
                .state('auth', {
                        resolve: {
                              loginRequired: loginRequired
                        }
                })



        function skipIfLoggedIn($q, $auth) {
                  let deferred = $q.defer();
                  if ($auth.isAuthenticated()) {
                    deferred.reject();
                  } else {
                    deferred.resolve();
                  }
                  return deferred.promise;
                }

        function loginRequired($q, $state, $auth) {
                    let deferred = $q.defer();
                    if ($auth.isAuthenticated()) {
                      deferred.resolve();
                    } else {
                      $state.go('login');
                    }
                    return deferred.promise;
                  }
})

// custom angular directive for going to different routes and clicking on any element with ng-click
.directive( 'goClick',  ( $state ) => {
  return  ( scope, element, attrs ) => {
    let path;

    attrs.$observe( 'goClick',  (val) => {
      path = val;
    });

    element.bind( 'click',  () => {
      scope.$apply(  () => {
        $state.go( path );
      });
    });
  };
})


// custom angular directive for limiting the enterable values into certain fields.
.directive("limitTo", [ () => {
    return {
        restrict: "A",
        link: (scope, elem, attrs) => {
            let limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);









