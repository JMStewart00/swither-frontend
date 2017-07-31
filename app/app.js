import appComponent from './app.component';
import loginComponent from './login/login.component';
// import principal from './app.services.js';



angular.module('app', ['ui.router', 'satellizer'])
.component('app', appComponent)
.component('login', loginComponent)
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
})
.directive('equals', () => {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: (scope, elem, attrs, ngModel) => {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, () => {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals',  (val) => {
        validate();
      });

      let validate = () => {
        // values
        let val1 = ngModel.$viewValue,
        	val2 = attrs.equals;

        // check for values in the fiels and set validity
        if (val1 && val2) {
       		ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
        }
      };
    }
  }
})