class dashboardController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;


        ctrl.$rootScope.logout = () => {
            $auth.logout();
            ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
            $state.go('login');

        }

    };
}

export default dashboardController;