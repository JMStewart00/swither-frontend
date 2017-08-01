import appComponent from './app.component';
import loginComponent from './login/login.component';
import navbarComponent from './navbar/navbar.component';
// import principal from './app.services.js';



angular.module('app', ['ui.router', 'satellizer'])
.component('app', appComponent)
.component('login', loginComponent)
.component('navbar', navbarComponent)
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
                .state('dash', {
                        url: '/dashboard',
                        templateUrl: './app/dashboard/dashboard.html',
                        controller: loginComponent.controller,
                        controllerAs: '$ctrl'
                })

})