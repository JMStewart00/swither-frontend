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

_app4.default.$inject = ['$rootScope', '$http', '$location', '$auth'];

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

var appCtrl = function appCtrl($rootScope, $http, $location, $auth) {
	_classCallCheck(this, appCtrl);

	var ctrl = this;
	ctrl.$rootScope = $rootScope;
	ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
} // end constructor
; // end appCtrl


exports.default = appCtrl;

},{}],3:[function(require,module,exports){
module.exports = "<div class=\"container\">\n\t<navbar></navbar>\n\t<div ui-view></div>\n</div>";

},{}],4:[function(require,module,exports){
'use strict';

var _app = require('./app.component');

var _app2 = _interopRequireDefault(_app);

var _login = require('./login/login.component');

var _login2 = _interopRequireDefault(_login);

var _navbar = require('./navbar/navbar.component');

var _navbar2 = _interopRequireDefault(_navbar);

var _dashboard = require('./dashboard/dashboard.component');

var _dashboard2 = _interopRequireDefault(_dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import principal from './app.services.js';


angular.module('app', ['ui.router', 'satellizer']).component('app', _app2.default).component('login', _login2.default).component('navbar', _navbar2.default).component('dashboard', _dashboard2.default).config(function ($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) {
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
  }).state('auth.dashboard', {
    url: '/dashboard',
    templateUrl: './app/dashboard/dashboard.html',
    controller: _dashboard2.default.controller,
    controllerAs: '$ctrl'
  }).state('auth', {
    resolve: {
      loginRequired: loginRequired
    }
  });

  function skipIfLoggedIn($q, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  function loginRequired($q, $state, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.resolve();
    } else {
      $state.go('login');
    }
    return deferred.promise;
  }
}).directive('goClick', function ($state) {
  return function (scope, element, attrs) {
    var path = void 0;

    attrs.$observe('goClick', function (val) {
      path = val;
    });

    element.bind('click', function () {
      scope.$apply(function () {
        $state.go(path);
      });
    });
  };
});

},{"./app.component":1,"./dashboard/dashboard.component":5,"./login/login.component":8,"./navbar/navbar.component":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dashboard = require('./dashboard.html');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _dashboard3 = require('./dashboard.controller');

var _dashboard4 = _interopRequireDefault(_dashboard3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dashboardComponent = {
	bindings: {},
	template: _dashboard2.default,
	controller: ['$rootScope', '$auth', '$http', '$state', _dashboard4.default],
	controllerAs: '$ctrl'
};

exports.default = dashboardComponent;

},{"./dashboard.controller":6,"./dashboard.html":7}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dashboardController = function dashboardController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, dashboardController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;

    ctrl.$rootScope.logout = function () {
        $auth.logout();
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        $state.go('login');
    };
};

exports.default = dashboardController;

},{}],7:[function(require,module,exports){
module.exports = "<h1>hello world</h1>\n";

},{}],8:[function(require,module,exports){
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

},{"./login.controller":9,"./login.html":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loginController = function loginController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, loginController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;

    // define login function for use in the front end
    ctrl.$rootScope.login = function () {

        // grab credentials from the front end form and send off to login
        var credentials = {
            grant_type: 'password',
            client_id: 1,
            client_secret: 'DKlsxJbWHCctqF99zBDCwFWON7Yb8m73oXXfavLY',
            username: ctrl.email,
            password: ctrl.password

            // Use Satellizer's $auth service to login
        };$auth.login(credentials).then(function (data) {
            $auth.setToken(data.data.access_token);
            $state.go('auth.dashboard');
            ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
            ctrl.$rootScope.loginError = '';
        }).catch(function (error) {
            ctrl.$rootScope.loginError = error.data.message;
        });
    }; // end login


    // define function called signup
    ctrl.$rootScope.signup = function () {

        // grab data from the form to send to the backend for registering new user
        var user = {
            name: ctrl.name,
            email: ctrl.email,
            password: ctrl.password,
            password_confirmation: ctrl.password_confirmation,
            grant_type: 'password',
            client_id: 1,
            client_secret: 'DKlsxJbWHCctqF99zBDCwFWON7Yb8m73oXXfavLY'
        };

        // satellizer's signup function to send data via http request to server.
        $auth.signup(user).then(function (response) {
            $state.go('login');
        }).catch(function (error) {});
    };
};

exports.default = loginController;

},{}],10:[function(require,module,exports){
module.exports = "<div class=\"col-sm-4 col-sm-offset-4\">\n    <div class=\"well\">\n        <h3>Login</h3>\n        <form>\n            <div ng-if=\"$ctrl.$rootScope.loginError\" class=\"alert-danger\">{{$ctrl.$rootScope.loginError}}</div>\n            <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control\" placeholder=\"Email\" ng-model=\"$ctrl.email\">\n            </div>\n            <div class=\"form-group\">\n                <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"$ctrl.password\">\n            </div>\n            <button class=\"btn btn-primary\" ng-click=\"$ctrl.$rootScope.login()\">Submit</button>\n        </form>\n    </div>\n</div>";

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _navbar = require('./navbar.html');

var _navbar2 = _interopRequireDefault(_navbar);

var _navbar3 = require('./navbar.controller');

var _navbar4 = _interopRequireDefault(_navbar3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var navbarComponent = {
	bindings: {},
	template: _navbar2.default,
	controller: ['$rootScope', '$auth', '$http', '$state', _navbar4.default],
	controllerAs: '$ctrl'
};

exports.default = navbarComponent;

},{"./navbar.controller":12,"./navbar.html":13}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var navbarController = function navbarController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, navbarController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
};

exports.default = navbarController;

},{}],13:[function(require,module,exports){
module.exports = "<div class=\"row mt-5\">\n\t<div class=\"col-2 offset-2\">\n\t\t<p>logo</p>\n\t</div>\n\t<div class=\"col-6 offset-2\">\n<div class=\"row\">\n\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"btn col m-0 text-right\" go-click=\"register\">Register</a>\n\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"btn col m-0\" go-click=\"login\">Login</a>\n\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" ng-click=\"$ctrl.$rootScope.logout()\" class=\"btn col text-right m-0\">Logout</a>\n</div>\n\t</div>\n</div>";

},{}]},{},[4]);
