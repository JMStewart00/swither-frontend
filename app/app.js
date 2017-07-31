import appComponent from './app.component';
import loginComponent from './login/login.component';


angular.module('app', ['ui.router', 'satellizer'])
.component('app', appComponent)
.component('login', loginComponent)
.config(function ($stateProvider, $urlRouterProvider, $authProvider) {
	    $authProvider.loginUrl = 'http://localhost:7000/oauth/token';
	    $urlRouterProvider.otherwise('/');
        $stateProvider
        	.state('login', {
        		url: '/login',
        		templateUrl: './app/login/login.html',
        		controller: loginComponent.controller,
        		controllerAs: '$ctrl'
        	})
})