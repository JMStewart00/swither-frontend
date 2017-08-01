import appComponent from './app.component';
import loginComponent from './login/login.component';
import navbarComponent from './navbar/navbar.component';
import dashboardComponent from './dashboard/dashboard.component';
// import principal from './app.services.js';



angular.module('app', ['ui.router', 'satellizer'])
.component('app', appComponent)
.component('login', loginComponent)
.component('navbar', navbarComponent)
.component('dashboard', dashboardComponent)
.config(($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) => {
        $authProvider.loginUrl = 'http://localhost:7000/oauth/token';
        $authProvider.signupUrl = 'http://localhost:7000/register';

        $urlRouterProvider.otherwise('/');

        $stateProvider
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
});









