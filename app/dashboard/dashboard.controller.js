class dashboardController {
    constructor($rootScope, $auth, $http, $state ) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;
        ctrl.$rootScope.getGroups();


    };
}

export default dashboardController;