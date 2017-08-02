class appCtrl {

    constructor($rootScope, $http, $location, $auth, $state, apiService) {

        let ctrl = this;
        ctrl.$rootScope = $rootScope;
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        ctrl.$http = $http;
        ctrl.$rootScope.searchResults = [];
        ctrl.$rootScope.alert = false;


        // global logout function to be able to be called from anywhere.
        ctrl.$rootScope.logout = () => {
            $auth.logout();
            ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
            ctrl.$rootScope.userId = '';
            $state.go('login');
        }

        // search yelp with a form
        ctrl.$rootScope.searchYelp = () => {

        // instantiate new search JSON
            ctrl.searchParameters = {
                // grab values with JQuery from form
              "term": $('#term').val(),
              "location": $('#location').val(),
              "sort_by": 'rating'
            };

            $http.post('http://localhost:7000/api/index', ctrl.searchParameters)
                .then( (response) => {
                    ctrl.$rootScope.searchResults.push(response.data);
                    $state.go('auth.swipes');
            })
            
        } //end searchYelp


        ctrl.$rootScope.saveLike = () => {
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
        } //end saveLike()

        ctrl.$rootScope.skipPlace = () => {
            ctrl.$rootScope.searchResults[0].splice(0, 1);
            ctrl.$rootScope.message = "Skipped!";
            ctrl.$rootScope.alert = true;

            if (ctrl.$rootScope.searchResults[0].length === 0) {
                $state.go('auth.dashboard');
                ctrl.$rootScope.alert = false;
            }
        }



    } // end constructor


} // end appCtrl



export default appCtrl;