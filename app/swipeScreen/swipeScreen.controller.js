class swipeScreenController {
    constructor($rootScope, $auth, $http, $state, apiService) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;
        console.log(ctrl.$rootScope.searchResults);


    }; //end constructor

}

export default swipeScreenController;