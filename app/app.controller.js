class appCtrl {

    constructor($rootScope, $http, $location, $auth, $state, apiService) {

        let ctrl = this;
        ctrl.$rootScope = $rootScope;
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        ctrl.$http = $http;
        ctrl.$rootScope.searchResults = [];
        ctrl.$rootScope.alert = false;
        ctrl.$rootScope.groups = [];


        // global logout function to be able to be called from anywhere.
        ctrl.$rootScope.logout = () => {
            $auth.logout();
            ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
            ctrl.$rootScope.userId = '';
            window.localStorage.clear();
            ctrl.$rootScope.alert = false;
            ctrl.$rootScope.groups = [];
            ctrl.$rootScope.message = '';
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

            // simple post request to the backend to send search parameters.
            // creating an array of searchResults with the data for use in Swipes
            $http.post('http://localhost:7000/api/index', ctrl.searchParameters)
                .then( (response) => {
                    ctrl.$rootScope.searchResults.push(response.data);
                    $state.go('auth.swipes');
            })
            
        } //end searchYelp




        // Adding swipes to the database if it is liked
        ctrl.$rootScope.saveLike = () => {
            // grabbing userid for current logged in user
            ctrl.$rootScope.userId = $auth.getPayload().sub;

            // grabbing variables for the like
            ctrl.like = {
              "user_id": ctrl.$rootScope.userId,
              "group_id": 16,
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
        } // end saveLike()



        // skips a Place in results and discards it
        ctrl.$rootScope.skipPlace = () => {
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
        }


        // Adding swipes to the database if it is liked
        ctrl.$rootScope.newGroup = () => {
            // grabbing userid for current logged in user
            ctrl.$rootScope.userId = $auth.getPayload().sub;

            // grabbing variables for the like
            ctrl.newGroup = {
              "group_name": $('#group_name').val(),
              "pin": $('#pin').val(),
              "user_id": ctrl.$rootScope.userId,
            };

            // calling on the service to do a post request to backend
            apiService.addGroup().save({}, ctrl.newGroup)
            .$promise
            .then( (data) => {
                apiService.addUserToGroup().save({}, ctrl.newGroup);

                // change page
                $state.go('auth.dashboard');
                // set message to confirm add
                ctrl.$rootScope.message = "Added new group!";

                // set alert to true to show on page
                ctrl.$rootScope.alert = true;
            }, (error) => {
                ctrl.errorMessage();
            });

        } // end addGroup()

        ctrl.$rootScope.getGroups = () => {
            ctrl.groups = apiService.getUserGroups().query({id:window.localStorage.getItem('currentUser')});
            ctrl.groups.$promise.then( (data) => {
                ctrl.$rootScope.groups.push(data);
            })
        }


        // function for joining groups that requires the PIN and group name
        ctrl.$rootScope.joinGroups = () => {
            ctrl.joinGroupInputs = {
              "group_name": $('#join_group_name').val(),
              "pin": $('#join_pin').val(),
              "user_id": window.localStorage.getItem('currentUser'),
            };

            // calling the joinGroup() from resource.services.js - post to API
            apiService.joinGroup().save({}, ctrl.joinGroupInputs)
            .$promise
            .then((data) => {
                ctrl.$rootScope.message = "You've joined the " + $('#join_group_name').val() + " group!";
                ctrl.$rootScope.alert = true;
                $state.go('auth.dashboard');
            }, (error) => {
                ctrl.errorMessage();
            });
        }

        ctrl.errorMessage = () => {
                // set message to confirm add
                ctrl.$rootScope.message = "Looks like that didn't work!";

                // set alert to true to show on page
                ctrl.$rootScope.alert = true;
        }




    } // end constructor


} // end appCtrl



export default appCtrl;