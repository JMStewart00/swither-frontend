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
    ctrl.$rootScope.groups = [];
    ctrl.$rootScope.loadScreen = false;

    // global logout function to be able to be called from anywhere.
    ctrl.$rootScope.logout = function () {
        $auth.logout();
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        ctrl.$rootScope.userId = '';
        window.localStorage.clear();
        ctrl.$rootScope.alert = false;
        ctrl.$rootScope.groups = [];
        ctrl.$rootScope.message = '';
        $state.go('login');
    };

    // search yelp with a form
    ctrl.$rootScope.searchYelp = function () {
        ctrl.$rootScope.alert = false;
        ctrl.$rootScope.loadScreen = true;
        // instantiate new search JSON
        ctrl.searchParameters = {
            // grab values with JQuery from form
            "term": $('#term').val(),
            "location": $('#location').val(),
            "sort_by": 'rating'
        };

        ctrl.$rootScope.selectedGroup = $('#groupSelect option:selected').val();

        // simple post request to the backend to send search parameters.
        // creating an array of searchResults with the data for use in Swipes
        $http.post('https://swither.herokuapp.com/api/index', ctrl.searchParameters).then(function (response) {
            ctrl.$rootScope.searchResults.push(response.data);
            $state.go('auth.swipes');
            ctrl.$rootScope.loadScreen = false;
        }, function (error) {
            ctrl.$rootScope.loadScreen = false;
            ctrl.errorMessage();
        });
    }; //end searchYelp


    // Adding swipes to the database if it is liked
    ctrl.$rootScope.saveLike = function () {
        // grabbing userid for current logged in user
        ctrl.$rootScope.userId = $auth.getPayload().sub;

        // grabbing variables for the like
        ctrl.like = {
            "user_id": ctrl.$rootScope.userId,
            "group_id": ctrl.$rootScope.selectedGroup,
            "business_info": JSON.stringify(ctrl.$rootScope.searchResults[0][0]),
            "business_id": ctrl.$rootScope.searchResults[0][0].id
        };

        // calling on the service to do a post request to backend
        apiService.addLike().save({}, ctrl.like);

        // taking the first result off the array to cycle through results
        ctrl.$rootScope.searchResults[0].splice(0, 1);

        // set message to confirm add
        ctrl.$rootScope.message = "Added to likes!";

        // set alert to true to show on page
        ctrl.$rootScope.alert = true;

        // checks the results length to decide whether or not to redirect
        if (ctrl.$rootScope.searchResults[0].length === 0) {

            // redirect statement
            $state.go('auth.dashboard');

            ctrl.$rootScope.alert = false;
        } // end if
    }; // end saveLike()


    // skips a Place in results and discards it
    ctrl.$rootScope.skipPlace = function () {
        // removes first element in the array
        ctrl.$rootScope.searchResults[0].splice(0, 1);

        // sets message to skipped! 
        ctrl.$rootScope.message = "Skipped!";

        // sets alert to true to show
        ctrl.$rootScope.alert = true;

        // checks the results length to decide whether or not to redirect
        if (ctrl.$rootScope.searchResults[0].length === 0) {

            // redirect statement 
            $state.go('auth.dashboard');
            ctrl.$rootScope.alert = false;
        }
    };

    // Adding swipes to the database if it is liked
    ctrl.$rootScope.newGroup = function () {
        // grabbing userid for current logged in user
        ctrl.$rootScope.userId = $auth.getPayload().sub;

        // grabbing variables for the like
        ctrl.newGroup = {
            "group_name": $('#group_name').val(),
            "pin": $('#pin').val(),
            "user_id": ctrl.$rootScope.userId
        };

        // calling on the service to do a post request to backend
        apiService.addGroup().save({}, ctrl.newGroup).$promise.then(function (data) {
            apiService.addUserToGroup().save({}, ctrl.newGroup);
            // change page
            $state.go('auth.dashboard');
            // set message to confirm add
            ctrl.$rootScope.message = "Added new group!";

            // set alert to true to show on page
            ctrl.$rootScope.alert = true;
            // ctrl.$rootScope.groups.push(ctrl.newGroup);
        });
    }; // end addGroup()

    ctrl.$rootScope.getGroups = function () {
        apiService.getUserGroups().query({ id: window.localStorage.getItem('currentUser') }).$promise.then(function (data) {
            $rootScope.groups.push(data);
        });
    };

    // function for joining groups that requires the PIN and group name
    ctrl.$rootScope.joinGroups = function () {
        ctrl.joinGroupInputs = {
            "group_name": $('#join_group_name').val(),
            "pin": $('#join_pin').val(),
            "user_id": window.localStorage.getItem('currentUser')
        };

        // calling the joinGroup() from resource.services.js - post to API
        apiService.joinGroup().save({}, ctrl.joinGroupInputs).$promise.then(function (data) {
            ctrl.$rootScope.message = "You've joined the " + $('#join_group_name').val() + " group!";
            ctrl.$rootScope.alert = true;
            $state.go('auth.dashboard');
        });
    };

    ctrl.$rootScope.viewMatches = function () {
        ctrl.matchQuery = {
            "group_id": $('#groupSelect option:selected').val()
        };
        ctrl.incompatible = {
            "image_url": "./dist/css/wrong.png",
            "name": "No matches!!",
            "display_phone": "You're apparently incompatible with your group!"
        };
        ctrl.$rootScope.matches = [];
        $http.post('https://swither.herokuapp.com/api/matches', ctrl.matchQuery).then(function (response) {
            if (response.data.length >= 1) {
                for (var i = 0; i < response.data.length; i++) {
                    ctrl.$rootScope.matches.push(JSON.parse(response.data[i].business_info));
                }
            } else {
                ctrl.$rootScope.matches.push(ctrl.incompatible);
            }
        });
    };

    ctrl.errorMessage = function () {
        // set message to confirm add
        ctrl.$rootScope.message = "Looks like that didn't work!";

        // set alert to true to show on page
        ctrl.$rootScope.alert = true;
    };
} // end constructor


; // end appCtrl


exports.default = appCtrl;

},{}],3:[function(require,module,exports){
module.exports = "<div class=\"color-overlay\">\n</div>\n\t<navbar></navbar>\n\t<div id=\"loadScreen\" ng-hide=\"!$ctrl.$rootScope.loadScreen\" class=\"text-center\">\n\t\t<div class=\"container\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col text-center\">\n\t\t\t\t\t<h1>Loading...</h1>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\n\t\t<i class=\"fa fa-refresh fa-5x fa-spin\"></i>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<main ui-view ng-hide=\"$ctrl.$rootScope.loadScreen\"></main>";

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
angular.module('app', ['ui.router', 'satellizer', 'ngResource', 'ngAnimate']).component('app', _app2.default).component('login', _login2.default).component('navbar', _navbar2.default).component('dashboard', _dashboard2.default).component('landing', _landing2.default).component('newEvent', _newEvent2.default).component('swipeScreen', _swipeScreen2.default).factory('apiService', _resourceServices2.default)

//configuration add-on
.config(function ($stateProvider, $locationProvider, $urlRouterProvider, $authProvider) {

        // authentication routes definitions
        $authProvider.loginUrl = 'https://swither.herokuapp.com/oauth/token';
        $authProvider.signupUrl = 'https://swither.herokuapp.com/register';

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
                controllerAs: '$ctrl',
                onExit: function onExit($rootScope) {
                        $rootScope.getGroups();
                }
        }).state('auth.new', {
                url: '/newevent',
                templateUrl: './app/newEvent/newEvent.html',
                controller: _newEvent2.default.controller,
                controllerAs: '$ctrl',
                onEnter: function onEnter($rootScope) {
                        $rootScope.searchResults = [];
                }
        }).state('auth.swipes', {
                url: '/swipes',
                templateUrl: './app/swipeScreen/swipeScreen.html',
                controller: _swipeScreen2.default.controller,
                controllerAs: '$ctrl',
                onExit: function onExit($rootScope) {
                        $rootScope.alert = false;
                        $rootScope.message = '';
                }
        }).state('auth.addgroup', {
                url: '/addgroup',
                templateUrl: './app/dashboard/creategroup.html',
                controller: _dashboard2.default.controller,
                controllerAs: '$ctrl'
        }).state('auth.joingroup', {
                url: '/joingroup',
                templateUrl: './app/dashboard/joingroup.html',
                controller: _dashboard2.default.controller,
                controllerAs: '$ctrl'

        }).state('auth.matches', {
                url: '/matches',
                templateUrl: './app/dashboard/matches.html',
                controller: _dashboard2.default.controller,
                controllerAs: '$ctrl',
                onExit: function onExit($rootScope) {
                        $rootScope.matches = [];
                }

        }).state('auth.load', {
                templateUrl: './app/loadscreen.html'
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
})

// custom angular directive for limiting the enterable values into certain fields.
.directive("limitTo", [function () {
        return {
                link: function link(scope, elem, attrs) {
                        var limit = parseInt(attrs.limitTo);
                        angular.element(elem).on("keypress", function (e) {
                                if (elem[0].value.length == limit) e.preventDefault();
                        });
                }
        };
}]);

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
    ctrl.$rootScope.getGroups();
};

exports.default = dashboardController;

},{}],7:[function(require,module,exports){
module.exports = "<div id=\"dashboard\">\n    <div class=\"container mt-3 py-4 w-75\">\n        <div class=\"row\">\n            <div class=\"col text-center\">\n                <h1 class=\"display-4\">Dashboard</h1>\n                <div ng-show=\"$ctrl.$rootScope.alert\" class=\"alert-danger py-2\">{{$ctrl.$rootScope.message}}</div>\n            </div>\n        </div>\n        <div class=\"row text-center\">\n            <div class=\"col-md-6 col-lg-3 px-0 pb-3 text-center animated fadeIn\">\n                <div class=\"col\">\n                    <i class=\"ion-plus display-4 hidden-md-up\" go-click=\"auth.new\"></i>\n                    <i class=\"ion-plus hidden-sm-down\" style=\"font-size: 200px\" go-click=\"auth.new\"></i>\n                    <h2 class=\"hidden-sm-down\">Find New Places!</h2>\n                    <h4 class=\"hidden-md-up\">Find New Places!</h4>\n                </div>\n            </div>\n            <div class=\"col-md-6 col-lg-3 px-0 pb-3 text-center animated fadeIn\">\n                <div class=\"col\">\n                    <i class=\"ion-android-star-outline display-4 hidden-md-up\" go-click=\"auth.matches\"></i>\n                    <i class=\"ion-android-star-outline hidden-sm-down\" style=\"font-size: 200px\" go-click=\"auth.matches\"></i>\n                    <h2 class=\"hidden-sm-down\">View Matches</h2>\n                    <h4 class=\"hidden-md-up\">View Matches</h4>\n                </div>\n            </div>\n            <div class=\"col-md-6 col-lg-3 px-0 pb-3 text-center animated fadeIn\">\n                <div class=\"col\">\n                    <i class=\"ion-ios-people display-4 hidden-md-up\" go-click=\"auth.addgroup\"></i>\n                    <i class=\"ion-ios-people hidden-sm-down\" style=\"font-size: 200px\" go-click=\"auth.addgroup\"></i>\n                    <h2 class=\"hidden-sm-down\">New Group</h2>\n                    <h4 class=\"hidden-md-up\">New Group</h4>\n                </div>\n            </div>\n            <div class=\"col-md-6 col-lg-3 px-0 pb-3 text-center animated fadeIn\">\n                <div class=\"col\">\n                    <i class=\"ion-ios-personadd display-4 hidden-md-up\" go-click=\"auth.joingroup\"></i>\n                    <i class=\"ion-ios-personadd hidden-sm-down\" style=\"font-size: 200px\" go-click=\"auth.joingroup\"></i>\n                    <h2 class=\"hidden-sm-down\">Join Group</h2>\n                    <h4 class=\"hidden-md-up\">Join Group</h4>\n                </div>\n            </div>\n        </div>\n        </div>  <!-- container -->\n        </div> <!--id wrapper-->\n";

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
module.exports = "<div id=\"landing\">\n\t <script type=\"text/javascript\">\n    let text = [\"Ladies\", \"Date\", \"Family\", \"Dudes\"];\n    let counter = 0;\n    let elem = document.getElementById(\"changeText\");\n    setInterval(change, 2000);\n    function change() {\n     elem.innerHTML = text[counter];\n        counter++;\n        if(counter >= text.length) { counter = 0; }\n    }\n    </script>\n\t\n\t<!------------------------------------------------------------------------\n\t\t\t\t\t\t\t\tHeader Content\n\t------------------------------------------------------------------------>\n\t\t\t<div class=\"container-fluid\" id=\"maincontent\">\n\t\t\t\t<div class=\"row pt-5 ml-2\">\n\t\t\t\t\t<h1 id=\"changeText\" class=\"display-3\">Dudes</h1><h1 class=\"display-3\">&nbsp night just got a little easier!</h1>\n\t\t\t\t</div> <!-- row -->\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\n\t\t\t\t<img src=\"dist/css/whitetear.png\" class=\"pull-bottom img-fluid\">\n\t\t\t\t</div>\n\t\t\t</div> <!-- container -->\n\t\n\t<!------------------------------------------------------------------------\n\t                    Skills Breakdown\n\t------------------------------------------------------------------------>\n\t\n\t\t\t<div class=\"container-fluid px-5\">\n\t\t\t\t<div class=\"row mb-5\">\n\t\t\t\t\t<div class=\"col-md-6 col-sm-12 text-left\">\n\t\t\t\t\t\t<h1 class=\"text-left col my-2 pl-0\">WHAT IS SWiTHER?</h1>\n\t\t\t\t\t\t<p>SWiTHER is a web-based application that solves the hassle that follows the question \"Where do you want to go?\" \n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\tIt's a timeless, exhausting, and frustrating struggle. You're with a group of friends or your significant other and you're so hungry you start to wonder what the other person would taste like with a little ranch. Before resorting to cannibalism, try SWiTHER. We'll keep you from eating your friends, and find a happy place to dine or go out for drinks instead.</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"col-md-6 col-sm-12 pt-5 hidden-sm-down\">\n\t\t\t\t\t\t<img src=\"dist/css/SwitherRespDesign.png\" alt=\"\" class=\"img-fluid\">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"row w-100 overview p-4\">\n\t\t\t\t\t<div class=\"col-12 col-md-4 col-lg-4 text-center\">\n\t\t\t\t\t\t<figure class=\"figure\">\n\t\t\t\t\t\t\t<i class=\"ion-thumbsdown display-1\"></i>\n\t\t\t\t\t\t\t<h4 class=\"text-center pt-3\">What You Don't Want</h4>\n\t\t\t\t\t\t\t<hr class=\"w-50 mt-2\">\n\t\t\t\t\t\t\t<p class=\"p-2 text-left\">It sounds crazy, but lets bring some logic into the equation.  First, decide what you don't want. You know when something doesn't sound that great, so you can save yourself a whole lot of work by having all parties eliminate what they aren't \"in the mood for.\"</p>\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t</div> <!-- end first column -->\n\t\t\t\t\t<div class=\"col-12 col-md-4 col-lg-4 text-center\">\n\t\t\t\t\t\t<figure class=\"figure\">\n\t\t\t\t\t\t\t<i class=\"img-fluid ion-alert display-1\"></i>\n\t\t\t\t\t\t\t<h4 class=\"text-center pt-3\">Don't fight!</h4>\n\t\t\t\t\t\t\t<hr class=\"w-50 mt-2\">\n\t\t\t\t\t\t\t<p class=\"p-2 text-left\">You know the fight. How do you not know what you want?! You can tell me about hundreds of \"things\" that you want, but you have no idea what you want to eat at this moment?! You suggest pizza, but the other person just had that last night. They suggest Chinese, but you were planning on having Chinese with family later on in the day.</p>\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t</div> <!-- end second column -->\n\t\t\t\t\t<div class=\"col-12 col-md-4 col-lg-4 text-center\">\n\t\t\t\t\t\t<figure class=\"figure\">\n\t\t\t\t\t\t\t<i class=\"img-fluid ion-checkmark display-1\" ></i>\n\t\t\t\t\t\t\t<h4 class=\"text-center pt-3\">Match it!</h4>\n\t\t\t\t\t\t\t<hr class=\"w-50 mt-2\">\n\t\t\t\t\t\t\t<p class=\"p-2 text-left\">After going through SWiTHER you'll have a list of matches. Decisions made easier. No one became a cannibal and everyone is happy. Sometimes people just need a leader, and other times people just need to succomb to their destiny. SWiTHER is now your leader. You're welcome.</p>\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t</div> <!-- end third column -->\n\t\t\t\t</div> <!-- end row -->\n\t\t\t</div> <!-- end container -->\n\t\n\n</div>";

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
            client_secret: 'ZmBkz0htbNnejtjZZGplCwu6gYknRGctKBGUG0Xh',
            username: ctrl.email,
            password: ctrl.password

            // Use Satellizer's $auth service to login
        };$auth.login(credentials).then(function (data) {
            $auth.setToken(data.data.access_token);
            $state.go('auth.dashboard');
            ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
            ctrl.$rootScope.userId = $auth.getPayload().sub;
            window.localStorage.setItem('currentUser', ctrl.$rootScope.userId);
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
            password_confirmation: ctrl.password_confirmation
        };

        // satellizer's signup function to send data via http request to server.
        $auth.signup(user).then(function (response) {
            $state.go('login');
        }).catch(function (error) {});
    };
};

exports.default = loginController;

},{}],13:[function(require,module,exports){
module.exports = "<div id=\"login\">\n    <div class=\"container text-center mt-3 py-3 w-75\">\n\n        <div class=\"row\">\n            <div class=\"col\">\n                <h1>LOGiN</h1>\n            </div>\n        </div>\n        \n\n        <div class=\"row\">\n            <div class=\"col-6 offset-3 mb-3\">\n                <div ng-if=\"$ctrl.$rootScope.loginError\" class=\"alert-danger\">{{$ctrl.$rootScope.loginError}}</div>\n            </div>\n        </div>\n\n\n        <form>\n\n            <div class=\"row\">\n                <div class=\"col\">\n                    <div class=\"form-group row\">\n                        <label for=\"email-input\" class=\"col-2 col-form-label text-right pr-0\">Email</label>\n                        <div class=\"col-10\">\n                            <input class=\"form-control\" type=\"email\" placeholder=\"Email\" ng-model=\"$ctrl.email\" id=\"email-input\">\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n\n            <div class=\"row\">\n                <div class=\"col\">\n                    <div class=\"form-group row\">\n                        <label for=\"password-input\" class=\"col-2 col-form-label text-right pr-0 hidden-sm-down\">Password</label>\n                        <label for=\"password-input\" class=\"col-2 col-form-label text-right pr-0 hidden-md-up\">PW</label>\n                        <div class=\"col-10\">\n                            <input class=\"form-control\" type=\"password\" placeholder=\"Password\" ng-model=\"$ctrl.password\" id=\"password-input\">\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n\n            <div class=\"row\">      \n                <div class=\"col\">\n                    <button class=\"btn btn-primary\" ng-click=\"$ctrl.$rootScope.login()\">Submit</button>\n                </div>\n            </div>\n\n        </form>\n        \n    </div> <!-- end container -->\n</div> <!-- end id wrapper -->";

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
module.exports = "<div id=\"navbar\" class=\"hidden-sm-down\">\n\t<div class=\"container w-100 py-auto text-white\">\n\t\t<div class=\"row\">\n\t\t\t<a class=\"col-2 text-right my-auto pt-2 pr-0\" go-click=\"landing\"><h3>SWiTHER</h3></a>\n\t\t\t<div class=\"col text-left my-auto pl-1 pt-2\"><i class=\"fa fa-cutlery\"></i></div>\n\t\t\t<a class=\"col-5 text-left\"></a>\n\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"col-2 my-auto text-right\" go-click=\"register\">Register</a>\n\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"col-2 my-auto text-left\" go-click=\"login\">Login</a>\n\t\t\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" class=\"col-2 my-auto text-right\" go-click=\"auth.dashboard\">Home</a>\n\t\t\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" ng-click=\"$ctrl.$rootScope.logout()\" class=\"col-2 text-left my-auto\">Logout</a>\n\t\t</div>\n\t</div>\n</div>\n\n<div id=\"navbar\" class=\"hidden-md-up\">\n\t<div class=\"container py-2\">\n\t\t<div class=\"row\">\n\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"col-6 text-left m-0\" go-click=\"auth.dashboard\"><h3>SWiTHER</h3></a>\n\t\t\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" class=\"col-8 text-left m-0\" go-click=\"auth.dashboard\"><h3>SWiTHER</h3></a>\n\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"col-3 m-0 text-right\" go-click=\"register\">Register</a>\n\t\t\t<a ng-show=\"!$ctrl.$rootScope.loginStatus\" class=\"col-3 m-0 text-right\" go-click=\"login\">Login</a>\n\t\t\t<a ng-show=\"$ctrl.$rootScope.loginStatus\" ng-click=\"$ctrl.$rootScope.logout()\" class=\"col-4 text-right m-0\">Logout</a>\n\t\t</div>\n\t</div>\n</div>\n";

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
module.exports = "<div id=\"newEvent\">\n    <div class=\"container text-center mt-3 py-3 w-75 px-2\">\n        <div class=\"row\">\n            <div class=\"col text-left pl-3\">\n                <p go-click=\"auth.dashboard\"><i class=\"ion-android-arrow-back\"></i> BACK</p>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <div ng-show=\"$ctrl.$rootScope.alert\" class=\"alert-danger py-2\">{{$ctrl.$rootScope.message}}</div>\n                <h1>Headed out tonight?</h1>\n                <p>Choose your group below, enter a search term like \"Tacos\" and a general location and hit Get Results!</p>\n            </div>\n        </div>\n<form name=\"newEventForm\" novalidate>\n    <div class=\"row\">\n        <div class=\"col\">\n            <div class=\"form-group row\">\n                <label for=\"groupSelect\" class=\"col-2 col-form-label text-right pr-0 hidden-sm-down\">Select Group</label>\n                <div class=\"col-sm-12 col-md-10\">              \n                    <select class=\"form-control custom-select\" id=\"groupSelect\" name=\"groupSelect\" ng-model=\"groupSelect\" required\n    ng-options=\"group.id as group.group_name for group in $ctrl.$rootScope.groups[$ctrl.$rootScope.groups.length-1] track by group.id\" >\n                        <option value=\"\">-- Select Group --</option>\n                    </select>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col\">\n            <div class=\"form-group row\">\n                <label for=\"\" class=\"col-2 col-form-label text-right pr-0 hidden-sm-down\">Search</label>\n                <div class=\"col-sm-12 col-md-10\">\n                    <input class=\"form-control\" placeholder=\"Enter a search term (i.e. Restaurants)\" name=\"term\" id=\"term\" ng-model=\"term\" required ng-required=\"true\">\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col\">\n            <div class=\"form-group row\">\n                <label for=\"location\" class=\"col-2 col-form-label text-right pr-0 hidden-sm-down\">Location</label>\n                <div class=\"col-sm-12 col-md-10\">\n                    <input type=\"text\" class=\"form-control\" placeholder=\"Enter a City, ST or Zip Code\" name=\"location\" id=\"location\" ng-model=\"location\" required ng-required=\"true\">\n                </div>\n            </div>\n        </div>\n    </div>\n    \n    <div class=\"row\">      \n        <div class=\"col\">\n            <button class=\"btn btn-outline-primary btn-lg\" ng-click=\"$ctrl.$rootScope.searchYelp()\" ng-disabled=\"newEventForm.$invalid\">Go!</button>\n        </div>\n    </div>\n</form>\n\n\n    </div>\n</div>";

},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});


function apiService($resource) {
	var ctrl = this;
	// All of the site api functions
	var addGroup = function addGroup() {
		return $resource('https://swither.herokuapp.com/api/groups/');
	};
	var addLike = function addLike() {
		return $resource('https://swither.herokuapp.com/api/likes/');
	};
	var getUserGroups = function getUserGroups() {
		return $resource('https://swither.herokuapp.com/api/findgroups/:id', { id: "@id" });
	};
	var addUserToGroup = function addUserToGroup() {
		return $resource('https://swither.herokuapp.com/api/usergroups');
	};
	var joinGroup = function joinGroup() {
		return $resource('https://swither.herokuapp.com/api/joingroup');
	};
	var refreshMatches = function refreshMatches() {
		return $resource('https://swither.herokuapp.com/api/matches/:id', { id: "@id" });
	};
	var getMatches = function getMatches() {
		return $resource('https://swither.herokuapp.com/api/matches/:id', { id: "@id" });
	};
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
	//            'update': {method: 'PUT'}
	//        	});

	return {
		addLike: addLike,
		addGroup: addGroup,
		getUserGroups: getUserGroups,
		addUserToGroup: addUserToGroup,
		joinGroup: joinGroup,
		refreshMatches: refreshMatches,
		getMatches: getMatches

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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var swipeScreenController = function swipeScreenController($rootScope, $auth, $http, $state, apiService) {
    _classCallCheck(this, swipeScreenController);

    var ctrl = this;
    ctrl.$rootScope = $rootScope;

    // don't allow the swipes screen to be seen if there are no search results.
    ctrl.$rootScope.$watch('searchResults', function () {
        if (ctrl.$rootScope.searchResults[0] === undefined || ctrl.$rootScope.searchResults.length === 0) {
            $state.go('auth.new');
        }
    });
};

exports.default = swipeScreenController;

},{}],23:[function(require,module,exports){
module.exports = "<div id=\"swipeScreen\">\n    <div class=\"container\" id=\"swipeContainer\">\n    <div class=\"card card-default mt-2 mx-auto\">\n        <div class=\"container-fluid m-0\">\n            <div class=\"row bg-inverse pt-5 pb-2\">\n                <div class=\"col-6 mx-auto\">\n                    <img class=\"img-fluid\" src=\"{{$ctrl.$rootScope.searchResults[0][0].image_url}}\">\n                </div>\n                <div class=\"col-12 text-center text-white mt-3 mb-0\">\n                    <h3>{{$ctrl.$rootScope.searchResults[0][0].name}}</h3>\n                    <p>{{$ctrl.$rootScope.searchResults[0][0].location.display_address[0]}}<br />{{$ctrl.$rootScope.searchResults[0][0].location.display_address[1]}}</p>\n                    <sub class=\"align-text-top\">{{$ctrl.$rootScope.searchResults[0][0].phone}}</sub>\n                </div>\n            </div>\n            <div class=\"row my-2 justify-content-center\">\n                <div class=\"col hidden-sm-down\"></div>\n                <div class=\"col text-center\">\n                    <i class=\"fa fa-money\"></i>\n                    <br> Price\n                    <h4>{{$ctrl.$rootScope.searchResults[0][0].price}}</h4>\n                </div>\n                <div class=\"col text-center\">\n                    <i class=\"fa fa-star\"></i>\n                    <br> Rating\n                    <h4>{{$ctrl.$rootScope.searchResults[0][0].rating}}</h4>\n                </div>\n                <div class=\"col text-center\">\n                    <i class=\"fa fa-cutlery\"></i>\n                    <br>Cuisine\n                    <h5>{{$ctrl.$rootScope.searchResults[0][0].categories[0].title}}</h5>\n                </div>\n                <div class=\"col text-center hidden-sm-down\">\n                    <i class=\"fa fa-laptop\"></i>\n                    <br><a href=\"{{$ctrl.$rootScope.searchResults[0][0].url}}\" target=\"_blank\">Website</a>\n                </div>\n                <div class=\"col hidden-sm-down\"></div>\n            </div>\n        </div>\n    </div>\n\n    <!-- like/pass buttons -->\n\n    <div class=\"row justify-content-center mt-2\">\n        <div class=\"col\"></div>\n        <div class=\"col text-center\">\n                <i id=\"dislike\" class=\"fa fa-times-circle-o fa-5x\" style=\"font-size: 8em;\"  ng-click=\"$ctrl.$rootScope.skipPlace()\"></i>\n        </div>\n        <div class=\"col text-center\">\n                <i id=\"like\" class=\"fa fa-plus-circle fa-5x\" style=\"font-size: 8em;\" ng-click=\"$ctrl.$rootScope.saveLike()\"></i>\n        </div>\n        <div class=\"col\"></div>\n    </div>\n    <div class=\"row\">\n        <div class=\"col text-center\">\n            <div class=\"alert-dismissible\" ng-if=\"$ctrl.$rootScope.alert\">{{$ctrl.$rootScope.message}}</div>\n        </div>\n    </div>\n\n    </div> <!-- end container -->\n</div> <!-- end id wrapper -->\n\n\n\n\n\n";

},{}]},{},[4]);
