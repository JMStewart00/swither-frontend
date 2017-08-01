class swipeScreenController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;
        console.log('hey')
        console.log(ctrl.$rootScope.searchResults);

    };
}

export default swipeScreenController;