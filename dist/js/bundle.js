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

_app4.default.$inject = ['$rootScope', '$http', '$location', '$auth', '$state', 'apiService'];

var appComponent = {
	template: _app2.default,
	controller: _app4.default
};

exports.default = appComponent;

},{"./app.controller":2,"./app.html":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appCtrl = function appCtrl($rootScope, $http, $location, $auth, $state, apiService) {
    _classCallCheck(this, appCtrl);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
    ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
    ctrl.$http = $http;
    ctrl.$rootScope.searchResults = [];
    ctrl.$rootScope.alert = false;

    // global logout function to be able to be called from anywhere.
    ctrl.$rootScope.logout = function () {
        $auth.logout();
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        ctrl.$rootScope.userId = '';
        $state.go('login');
    };

    // search yelp with a form
    ctrl.$rootScope.searchYelp = function () {

        // instantiate new search JSON
        ctrl.searchParameters = {
            // grab values with JQuery from form
            "term": $('#term').val(),
            "location": $('#location').val(),
            "sort_by": 'rating'
        };

        $http.post('http://localhost:7000/api/index', ctrl.searchParameters).then(function (response) {
            ctrl.$rootScope.searchResults.push(response.data);
            $state.go('auth.swipes');
        });
    }; //end searchYelp


    ctrl.$rootScope.saveLike = function () {
        ctrl.$rootScope.userId = $auth.getPayload().sub;
        ctrl.like = {
            "user_id": ctrl.$rootScope.userId,
            "group_id": 1,
            "business_info": JSON.stringify(ctrl.$rootScope.searchResults[0][0]),
            "business_id": ctrl.$rootScope.searchResults[0][0].id
        };

        apiService.addLike().save({}, ctrl.like);
        ctrl.$rootScope.searchResults[0].splice(0, 1);
        ctrl.$rootScope.message = "Added to likes!";
        ctrl.$rootScope.alert = true;

        if (ctrl.$rootScope.searchResults[0].length === 0) {
            $state.go('auth.dashboard');
            ctrl.$rootScope.alert = false;
        }
    }; //end saveLike()

    ctrl.$rootScope.skipPlace = function () {
        ctrl.$rootScope.searchResults[0].splice(0, 1);
        ctrl.$rootScope.message = "Skipped!";
        ctrl.$rootScope.alert = true;

        if (ctrl.$rootScope.searchResults[0].length === 0) {
            $state.go('auth.dashboard');
            ctrl.$rootScope.alert = false;
        }
    };
} // end constructor


; // end appCtrl


exports.default = appCtrl;

},{}],3:[function(require,module,exports){
module.exports = "\t<navbar></navbar>\n\t<div ui-view></div>";

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

var _landing = require('./landing/landing.component');

var _landing2 = _interopRequireDefault(_landing);

var _newEvent = require('./newEvent/newEvent.component');

var _newEvent2 = _interopRequireDefault(_newEvent);

var _swipeScreen = require('./swipeScreen/swipeScreen.component');

var _swipeScreen2 = _interopRequireDefault(_swipeScreen);

var _resourceServices = require('./resource.services.js');

var _resourceServices2 = _interopRequireDefault(_resourceServices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// instantiation of the module of app, where injections will go.
angular.module('app', ['ui.router', 'satellizer', 'ngResource']).component('app', _app2.default).component('login', _login2.default).component('navbar', _navbar2.default).component('dashboard', _dashboard2.default).component('landing', _landing2.default).component('newEvent', _newEvent2.default).component('swipeScreen', _swipeScreen2.default).factory('apiService', _resourceServices2.default)

//configuration add-on
.config(function ($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) {

  // authentication routes definitions
  $authProvider.loginUrl = 'http://localhost:7000/oauth/token';
  $authProvider.signupUrl = 'http://localhost:7000/register';

  // says to route to / on unknown or undefined routes.
  $urlRouterProvider.otherwise('/');

  // states
  $stateProvider.state('landing', {
    url: '/',
    templateUrl: './app/landing/landing.html',
    controller: _landing2.default.controller,
    controllerAs: '$ctrl'
  }).state('login', {
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
  }).state('auth.new', {
    url: '/newevent',
    templateUrl: './app/newEvent/newEvent.html',
    controller: _newEvent2.default.controller,
    controllerAs: '$ctrl'
  }).state('auth.swipes', {
    url: '/swipes',
    templateUrl: './app/swipeScreen/swipeScreen.html',
    controller: _swipeScreen2.default.controller,
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
})

// custom angular directive for going to different routes and clicking on any element with ng-click
.directive('goClick', function ($state) {
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

},{"./app.component":1,"./dashboard/dashboard.component":5,"./landing/landing.component":8,"./login/login.component":11,"./navbar/navbar.component":14,"./newEvent/newEvent.component":17,"./resource.services.js":20,"./swipeScreen/swipeScreen.component":21}],5:[function(require,module,exports){
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dashboardController = function dashboardController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, dashboardController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
    // ctrl.$rootScope.searchYelp();

};

exports.default = dashboardController;

},{}],7:[function(require,module,exports){
module.exports = "<button go-click=\"auth.swipes\">Swipes</button>\n<button go-click=\"auth.new\">New Event</button>\n<button go-click=\"landing\">Landing</button>\n\n";

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _landing = require('./landing.html');

var _landing2 = _interopRequireDefault(_landing);

var _landing3 = require('./landing.controller');

var _landing4 = _interopRequireDefault(_landing3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var landingComponent = {
	bindings: {},
	template: _landing2.default,
	controller: ['$rootScope', '$auth', '$http', '$state', _landing4.default],
	controllerAs: '$ctrl'
};

exports.default = landingComponent;

},{"./landing.controller":9,"./landing.html":10}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var landingController = function landingController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, landingController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
};

exports.default = landingController;

},{}],10:[function(require,module,exports){
module.exports = "\n<!------------------------------------------------------------------------\n\t\t\t\t\t\t\tHeader Content\n------------------------------------------------------------------------>\n\t\t<div class=\"container-fluid px-0 mb-0 h-100\" id=\"maincontent\">\n\t\t\t<div class=\"row pt-5\">\n\t\t\t\t<!-- larger screen title -->\n\t\t\t\t<div class=\"hidden-sm-down col text-center\">\n\t\t\t\t\t<h1 class=\"text-center display-1 pb-0 d-inline-block\" id=\"title\">SWiTHER</h1>\n\t\t\t\t\t<hr class=\"w-50 p-0\" id=\"topRuler\">\n\t\t\t\t</div>\n\t\t\t\t<!-- Small screen title -->\n\t\t\t\t<div class=\"hidden-md-up col text-center mt-5\">\n\t\t\t\t\t<h1 class=\"text-center display-3 pb-0 d-inline-block\" id=\"title\">SWiTHER</h1>\n\t\t\t\t\t<hr class=\"w-50 p-0\" id=\"topRuler\">\n\t\t\t\t</div>\n\t\t\t</div> <!-- row -->\n\t\t</div> <!-- container -->\n\n<!------------------------------------------------------------------------\n                    Skills Breakdown\n------------------------------------------------------------------------>\n\n\t\t<div class=\"container-fluid px-5\">\n\t\t\t<h2 class=\"text-center col my-4 text-uppercase\">Development Tools</h2>\n\t\t\t<div class=\"row overview\">\n\t\t\t\t<div class=\"col-12 col-md-4 col-lg-4 text-center\">\n\t\t\t\t\t<figure class=\"figure\">\n\t\t\t\t\t\t<i class=\"img-fluid fa fa-cutlery fa-5x\"></i>\n\t\t\t\t\t\t<figcaption class=\"figure-caption text-center pt-3\">Coming Soon!</figcaption>\n\t\t\t\t\t\t<hr class=\"w-50 mt-2\">\n\t\t\t\t\t\t<p class=\"p-2\">Ut interdum sagittis sem nec suscipit. Integer lacus risus, mollis a lorem ut, tincidunt commodo dolor. Nulla libero est, lobortis at metus ac, commodo pulvinar velit. Donec quis bibendum ante.</p>\n\t\t\t\t\t</figure>\n\t\t\t\t</div> <!-- end first column -->\n\t\t\t\t<div class=\"col-12 col-md-4 col-lg-4 text-center\">\n\t\t\t\t\t<figure class=\"figure\">\n\t\t\t\t\t\t<i class=\"img-fluid fa fa-cutlery fa-5x\"></i>\n\t\t\t\t\t\t<figcaption class=\"figure-caption text-center pt-3\">Coming Soon!</figcaption>\n\t\t\t\t\t\t<hr class=\"w-50 mt-2\">\n\t\t\t\t\t\t<p class=\"p-2\">Ut interdum sagittis sem nec suscipit. Integer lacus risus, mollis a lorem ut, tincidunt commodo dolor. Nulla libero est, lobortis at metus ac, commodo pulvinar velit. Donec quis bibendum ante.</p>\n\t\t\t\t\t</figure>\n\t\t\t\t</div> <!-- end second column -->\n\t\t\t\t<div class=\"col-12 col-md-4 col-lg-4 text-center\">\n\t\t\t\t\t<figure class=\"figure\">\n\t\t\t\t\t\t<i class=\"img-fluid fa fa-cutlery fa-5x\" ></i>\n\t\t\t\t\t\t<figcaption class=\"figure-caption text-center pt-3\">Coming Soon!</figcaption>\n\t\t\t\t\t\t<hr class=\"w-50 mt-2\">\n\t\t\t\t\t\t<p class=\"p-2\">Ut interdum sagittis sem nec suscipit. Integer lacus risus, mollis a lorem ut, tincidunt commodo dolor. Nulla libero est, lobortis at metus ac, commodo pulvinar velit. Donec quis bibendum ante.</p>\n\t\t\t\t\t</figure>\n\t\t\t\t</div> <!-- end third column -->\n\t\t\t</div> <!-- end row -->\n\t\t</div> <!-- end container -->\n\n\n<!------------------------------------------------------------------------\n                  Contact Section\n------------------------------------------------------------------------>\n\n\t\t\t    <section id=\"1contact\">\n\t\t\t        <div class=\"container py-5\">\n\t\t\t            <div class=\"row\">\n\t\t\t                <div class=\"col-sm col-md-8 offset-md-2 text-center\">\n\t\t\t                    <h2 class=\"section-heading\">Let's Get In Touch!</h2>\n\t\t\t                    <hr class=\"primary\">\n\t\t\t                    <p>Please feel free to contact me via the email below or on any of my social media platforms!</p>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t         </div>\n\t\t\t    </section>";

},{}],11:[function(require,module,exports){
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

},{"./login.controller":12,"./login.html":13}],12:[function(require,module,exports){
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
            ctrl.$rootScope.userId = $auth.getPayload().sub;
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

},{}],13:[function(require,module,exports){
module.exports = "<div class=\"col-sm-4 col-sm-offset-4\">\n    <div class=\"well\">\n        <h3>Login</h3>\n        <form>\n            <div ng-if=\"$ctrl.$rootScope.loginError\" class=\"alert-danger\">{{$ctrl.$rootScope.loginError}}</div>\n            <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control\" placeholder=\"Email\" ng-model=\"$ctrl.email\">\n            </div>\n            <div class=\"form-group\">\n                <input type=\"password\" class=\"form-control\" placeholder=\"Password\" ng-model=\"$ctrl.password\">\n            </div>\n            <button class=\"btn btn-primary\" ng-click=\"$ctrl.$rootScope.login()\">Submit</button>\n        </form>\n    </div>\n</div>";

},{}],14:[function(require,module,exports){
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

},{"./navbar.controller":15,"./navbar.html":16}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
module.exports = "<div id=\"navbar\">\n<div class=\"container\">\n\t<div class=\"row mt-5\">\n\t\t<div class=\"col-2 text-center align-middle\">\n\t\t\t<p>logo</p>\n\t\t\t</div>\n\t\t\t\t<div class=\"col-6\"></div>\n\t\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"btn col-2 m-0 text-right border-right\" go-click=\"register\">Register</a>\n\t\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"btn col-2 m-0 text-left\" go-click=\"login\">Login</a>\n\t\t\t\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" class=\"btn col-2 m-0 text-right border-right\" go-click=\"register\"></a>\n\t\t\t\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" ng-click=\"$ctrl.$rootScope.logout()\" class=\"btn col text-left m-0\">Logout</a>\n\t\t\t</div>\n</div>\n</div>\n\n<!-- \t\t<div class=\"nav-wrapper mb-0\">\n\t\t\t<nav class=\"navbar navbar-toggleable\" style=\"height: 55px\">\n\t\t\t\t\t<div class=\"row w-100 mx-auto\">\n\t\t\t\t\t\t<div class=\"col text-center hidden-md-down\"></div>\n\t\t\t\t\t\t<a class=\"col text-center py-1 borderYtoX\" href=\"#1about\">ABOUT</a>\n\t\t\t\t\t\t<a class=\"col text-center py-1 borderYtoX\" href=\"#1work\">WORK</a>\n\t\t\t\t\t\t<a class=\"col text-center py-1 borderYtoX\" href=\"#1contact\">CONNECT</a>\n\t\t\t\t\t\t<a class=\"col hidden-sm-down text-center py-1 borderYtoX\" href=\"https://jmstewart00.github.io/stewartblog/\" target=\"_blank\">BLOG</a>\n\t\t\t\t\t\t<div class=\"col text-center hidden-md-down\"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</nav>\n\t\t</div>  -->";

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _newEvent = require('./newEvent.html');

var _newEvent2 = _interopRequireDefault(_newEvent);

var _newEvent3 = require('./newEvent.controller');

var _newEvent4 = _interopRequireDefault(_newEvent3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newEventComponent = {
	bindings: {},
	template: _newEvent2.default,
	controller: ['$rootScope', '$auth', '$http', '$state', _newEvent4.default],
	controllerAs: '$ctrl'
};

exports.default = newEventComponent;

},{"./newEvent.controller":18,"./newEvent.html":19}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var newEventController = function newEventController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, newEventController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
};

exports.default = newEventController;

},{}],19:[function(require,module,exports){
module.exports = "<div class=\"row\">\n    <div class=\"col\">\n        <form name=\"search\">\n            <div class=\"form-group\">\n                <input type=\"text\" class=\"form-control\" placeholder=\"Type of place\" name=\"term\" id=\"term\">\n            </div>\n            <div class=\"form-group\">\n                <input type=\"text\" class=\"form-control\" placeholder=\"City, State or ZipCode\" name=\"location\" id=\"location\">\n            </div>\n            <button class=\"btn btn-outline-primary\" ng-click=\"$ctrl.$rootScope.searchYelp()\">Submit</button>\n        </form>\n    </div>\n</div>";

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


function apiService($resource) {
	var ctrl = this;
	// All of the site api functions
	// let getYelp = () => $resource('http://localhost:7000/api/index');
	var addLike = function addLike() {
		return $resource('http://localhost:7000/api/likes/');
	};
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
	//            'update': {method: 'PUT'}
	//        	});

	return {
		addLike: addLike
		// 			searchYelp : searchYelp,


		// 	};
		// function subnetsService($resource) {

		// 	 return $resource('http://localhost:7000/api/subnets/:subnet', 
		// 		 {
		// 		 	subnet: "@subnet"
		// 		 }
		// 	 	);
	};
}

exports.default = apiService;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _swipeScreen = require('./swipeScreen.html');

var _swipeScreen2 = _interopRequireDefault(_swipeScreen);

var _swipeScreen3 = require('./swipeScreen.controller');

var _swipeScreen4 = _interopRequireDefault(_swipeScreen3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var swipeScreenComponent = {
	bindings: {},
	template: _swipeScreen2.default,
	controller: ['$rootScope', '$auth', '$http', '$state', _swipeScreen4.default],
	controllerAs: '$ctrl'
};

exports.default = swipeScreenComponent;

},{"./swipeScreen.controller":22,"./swipeScreen.html":23}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var swipeScreenController = function swipeScreenController($rootScope, $auth, $http, $state, apiService) {
    _classCallCheck(this, swipeScreenController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
    console.log(ctrl.$rootScope.searchResults);
};

exports.default = swipeScreenController;

},{}],23:[function(require,module,exports){
module.exports = "<div id=\"swipeScreen\">\n    <div class=\"container\">\n\n    <div class=\"row\">\n        <div class=\"col\">\n            <div class=\"alert\" ng-if=\"$ctrl.$rootScope.alert\">{{$ctrl.$rootScope.message}}</div>\n        </div>\n    </div>\n    <div class=\"card card-default mt-2\">\n        <div class=\"container-fluid m-0\">\n            <div class=\"row bg-inverse pt-5 pb-2\">\n                <div class=\"col-6 mx-auto\">\n                    <img class=\"img-fluid\" src=\"{{$ctrl.$rootScope.searchResults[0][0].image_url}}\">\n                </div>\n                <div class=\"col-12 text-center text-white mt-3 mb-0\">\n                    <h3>{{$ctrl.$rootScope.searchResults[0][0].name}}</h3>\n                    <p>{{$ctrl.$rootScope.searchResults[0][0].location.display_address[0]}}<br />{{$ctrl.$rootScope.searchResults[0][0].location.display_address[1]}}</p>\n                    <sub class=\"align-text-top\">{{$ctrl.$rootScope.searchResults[0][0].phone}}</sub>\n                </div>\n            </div>\n            <div class=\"row my-2 justify-content-center\">\n                <div class=\"col hidden-sm-down\"></div>\n                <div class=\"col text-center\">\n                    <i class=\"fa fa-money\"></i>\n                    <br> Price\n                    <h4>{{$ctrl.$rootScope.searchResults[0][0].price}}</h4>\n                </div>\n                <div class=\"col text-center\">\n                    <i class=\"fa fa-star\"></i>\n                    <br> Rating\n                    <h4>{{$ctrl.$rootScope.searchResults[0][0].rating}}</h4>\n                </div>\n                <div class=\"col text-center\">\n                    <i class=\"fa fa-cutlery\"></i>\n                    <br>Cuisine\n                    <h5>{{$ctrl.$rootScope.searchResults[0][0].categories[0].title}}</h5>\n                </div>\n                <div class=\"col text-center hidden-sm-down\">\n                    <i class=\"fa fa-laptop\"></i>\n                    <br><a href=\"{{$ctrl.$rootScope.searchResults[0][0].url}}\" target=\"_blank\">Website</a>\n                </div>\n                <div class=\"col hidden-sm-down\"></div>\n            </div>\n        </div>\n    </div>\n\n    <!-- like/pass buttons -->\n\n    <div class=\"row justify-content-center mt-2\">\n        <div class=\"col\"></div>\n        <div class=\"col text-center\">\n                <i id=\"dislike\" class=\"fa fa-times-circle-o fa-5x\" style=\"font-size: 8em;\"  ng-click=\"$ctrl.$rootScope.skipPlace()\"></i>\n        </div>\n        <div class=\"col text-center\">\n                <i id=\"like\" class=\"fa fa-plus-circle fa-5x\" style=\"font-size: 8em;\" ng-click=\"$ctrl.$rootScope.saveLike()\"></i>\n        </div>\n        <div class=\"col\"></div>\n    </div>\n\n\n    </div> <!-- end container -->\n</div> <!-- end id wrapper -->\n\n\n\n\n\n";

},{}]},{},[4]);
