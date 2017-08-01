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
"use strict";

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
    ctrl.$rootScope.searchResults = [{
        "id": "velvet-taco-chicago",
        "name": "Velvet Taco",
        "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/MHRSqUs9jW5Rpo_ysfiLxg/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/velvet-taco-chicago?adjust_creative=_D0fpoWGQt3_-FGYLWuntg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=_D0fpoWGQt3_-FGYLWuntg",
        "review_count": 803,
        "categories": [{
            "alias": "newamerican",
            "title": "American (New)"
        }, {
            "alias": "mexican",
            "title": "Mexican"
        }],
        "rating": 4,
        "coordinates": {
            "latitude": 41.9021988,
            "longitude": -87.6285782
        },
        "transactions": ["delivery", "pickup"],
        "price": "$$",
        "location": {
            "address1": "1110 N State St",
            "address2": "",
            "address3": "",
            "city": "Chicago",
            "zip_code": "60610",
            "country": "US",
            "state": "IL",
            "display_address": ["1110 N State St", "Chicago, IL 60610"]
        },
        "phone": "+13127632654",
        "display_phone": "(312) 763-2654",
        "distance": 4083.25607216
    }];

    // global logout function to be able to be called from anywhere.
    ctrl.$rootScope.logout = function () {
        $auth.logout();
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
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
        // };
    }; //end searchYelp

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
module.exports = "\n";

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
module.exports = "<h1>heyo!</h1>";

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
module.exports = "<div class=\"row mt-5\">\n\t<div class=\"col-2 offset-2\">\n\t\t<p>logo</p>\n\t</div>\n\t<div class=\"col-6 offset-2\">\n<div class=\"row\">\n\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"btn col m-0 text-right\" go-click=\"register\">Register</a>\n\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"btn col m-0\" go-click=\"login\">Login</a>\n\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" ng-click=\"$ctrl.$rootScope.logout()\" class=\"btn col text-right m-0\">Logout</a>\n</div>\n\t</div>\n</div>";

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
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});


function apiService($resource) {
	var ctrl = this;
	// All of the site api functions
	// let getYelp = () => $resource('http://localhost:7000/api/index');
	// let	searchYelp = () => $resource('http://localhost:7000/api/index/');
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
	//            'update': {method: 'PUT'}
	//        	});

	return {}
	// 			getYelp : getYelp,
	// 			searchYelp : searchYelp,


	// 	};
	// function subnetsService($resource) {

	// 	 return $resource('http://localhost:7000/api/subnets/:subnet', 
	// 		 {
	// 		 	subnet: "@subnet"
	// 		 }
	// 	 	);
	;
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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var swipeScreenController = function swipeScreenController($rootScope, $auth, $http, $state) {
    _classCallCheck(this, swipeScreenController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;
    console.log('hey');
    console.log(ctrl.$rootScope.searchResults);
};

exports.default = swipeScreenController;

},{}],23:[function(require,module,exports){
module.exports = "<li> {{$ctrl.$rootScope.searchResults[0].name}} | {{business.location.city}}, {{business.location.state}}  |  {{business.price}}</li>\n<div class=\"card card-default\">\n    <div class=\"container-fluid\">\n        <div class=\"row bg-inverse py-5\">\n            <div class=\"col-6 mx-auto\">\n                <img class=\"img-fluid\" src=\"{{$ctrl.$rootScope.searchResults[0].image_url}}\">\n            </div>\n            <div class=\"col-12 text-center text-white mt-3\">\n                <h3>{{$ctrl.$rootScope.searchResults[0].name}}</h3>\n                <sub>{{$ctrl.$rootScope.searchResults[0].phone}}</sub>\n            </div>\n        </div>\n        <div class=\"row mb-2\">\n            <div class=\"col-12 py-3\">\n                <p>Horton started at ACME 4 years ago and, is a pooch pooch with clever lyrics. This is a card.</p>\n            </div>\n        </div>\n        <div class=\"row mb-2 justify-content-center\">\n            <div class=\"col-2 text-center\">\n                <i class=\"fa fa-money\"></i>\n                <br> Money Signs\n                <h4>{{$ctrl.$rootScope.searchResults[0].price}}</h4>\n            </div>\n            <div class=\"col-2 text-center\">\n                <i class=\"fa fa-star\"></i>\n                <br> Rating\n                <h4>{{$ctrl.$rootScope.searchResults[0].rating}}</h4>\n            </div>\n            <div class=\"col-2 text-center\">\n                <i class=\"fa fa-cutlery\"></i>\n                <br> Cuisine\n                <h5>{{$ctrl.$rootScope.searchResults[0].categories[0].title}}</h5>\n            </div>\n            <div class=\"col-2 text-center\">\n                <i class=\"fa fa-laptop\"></i>\n                <br><a href=\"{{$ctrl.$rootScope.searchResults[0].url}}\" target=\"_blank\">Website</a>\n            </div>\n        </div>\n    </div>\n</div>";

},{}]},{},[4]);
