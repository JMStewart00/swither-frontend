class appCtrl {

	constructor($rootScope, $http, $location, $auth) {

		let ctrl = this;
		ctrl.$rootScope = $rootScope;
		ctrl.$rootScope.loginStatus = $auth.isAuthenticated();

	} // end constructor
} // end appCtrl
export default appCtrl;