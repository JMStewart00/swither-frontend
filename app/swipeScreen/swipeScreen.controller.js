class swipeScreenController {
    constructor($rootScope, $auth, $http, $state, apiService) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;

        // don't allow the swipes screen to be seen if there are no search results.
        ctrl.$rootScope.$watch('searchResults', () => {
            if (ctrl.$rootScope.searchResults[0] === undefined || ctrl.$rootScope.searchResults.length === 0) {
                $state.go('auth.new');

            }
        }

        )


    }; //end constructor

}

export default swipeScreenController;