(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _app = require('./app.html');

var _app2 = _interopRequireDefault(_app);

var _app3 = require('./app.controller');

var _app4 = _interopRequireDefault(_app3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_app4.default.$inject = ['$rootScope', '$http', '$location'];

var appComponent = {
	template: _app2.default,
	controller: _app4.default
};

exports.default = appComponent;

},{"./app.controller":2,"./app.html":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appCtrl = function appCtrl($rootScope, $http, $location) {
	_classCallCheck(this, appCtrl);

	var ctrl = this;
	ctrl.$rootScope = $rootScope;
} // end constructor
; // end appCtrl


exports.default = appCtrl;

},{}],3:[function(require,module,exports){
module.exports = "\n<div ui-view></div>";

},{}],4:[function(require,module,exports){
'use strict';

var _app = require('./app.component');

var _app2 = _interopRequireDefault(_app);

var _login = require('./login/login.component');

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import principal from './app.services.js';


angular.module('app', ['ui.router', 'satellizer']).component('app', _app2.default).component('login', _login2.default).config(function ($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) {
       $authProvider.loginUrl = 'http://localhost:7000/oauth/token';
       $authProvider.signupUrl = 'http://localhost:7000/register';

       $urlRouterProvider.otherwise('/');

       $stateProvider.state('login', {
              url: '/login',
              templateUrl: './app/login/login.html',
              controller: _login2.default.controller,
              controllerAs: '$ctrl'
       }).state('register', {
              url: '/register',
              templateUrl: './app/login/register.html',
              controller: _login2.default.controller,
              controllerAs: '$ctrl'
       }).state('dash', {
              url: '/dashboard',
              templateUrl: './app/dashboard/dashboard.html',
              controller: _login2.default.controller,
              controllerAs: '$ctrl'
       });
});

},{"./app.component":1,"./login/login.component":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _login = require('./login.html');

var _login2 = _interopRequireDefault(_login);

var _login3 = require('./login.controller');

var _login4 = _interopRequireDefault(_login3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loginComponent = {
	bindings: {},
	template: _login2.default,
	controller: ['$rootScope', '$auth', '$http', '$state', _login4.default],
	controllerAs: '$ctrl'
};

exports.default = loginComponent;

},{"./login.controller":6,"./login.html":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loginController = function loginController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, loginController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;

    ctrl.login = function () {

        var credentials = {
            grant_type: 'password',
            client_id: 1,
            client_secret: 'DKlsxJbWHCctqF99zBDCwFWON7Yb8m73oXXfavLY',
            username: ctrl.email,
            password: ctrl.password

            // Use Satellizer's $auth service to login
        };$auth.login(credentials).then(function (data) {
            $auth.setToken(data.data.access_token);
            console.log($auth.isAuthenticated());
            $state.go('dash');
        }).catch(function (error) {
            ctrl.$rootScope.loginError = error.data.message;
            console.log($auth.isAuthenticated());
        });
    }; // end login


    ctrl.signup = function () {

        var user = {
            name: ctrl.name,
            email: ctrl.email,
            password: ctrl.password,
            password_confirmation: ctrl.password_confirmation,
            grant_type: 'password',
            client_id: 1,
            client_secret: 'DKlsxJbWHCctqF99zBDCwFWON7Yb8m73oXXfavLY'
        };

        $auth.signup(user).then(function (response) {
            windnow.location.href = '/login';
        }).catch(function (error) {});
    };
};

exports.default = loginController;

},{}],7:[function(require,module,exports){
module.exports = "<div class=\"col-sm-4 col-sm-offset-4\">\n    <div class=\"well\">\n        <h3>Login</h3>\n        <form>\n            <div ng-if=\"$ctrl.$rootScope.loginError\" class=\"alert-danger\">{{$ctrl.$rootScope.loginError}}</div>\n            <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control\" placeholder=\"Email\" ng-model=\"$ctrl.email\">\n            </div>\n            <div class=\"form-group\">\n                <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"$ctrl.password\">\n            </div>\n            <button class=\"btn btn-primary\" ng-click=\"$ctrl.login()\">Submit</button>\n        </form>\n    </div>\n</div>";

},{}]},{},[4]);
