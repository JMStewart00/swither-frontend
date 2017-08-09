class appCtrl {

    constructor($rootScope, $http, $location, $auth, $state, $timeout, apiService) {

        let ctrl = this;
        ctrl.$rootScope = $rootScope;
        ctrl.$http = $http;


        // variable declarations
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        ctrl.$rootScope.searchResults = [];
        ctrl.$rootScope.alert = false;
        ctrl.$rootScope.groups = [];
        ctrl.$rootScope.loadScreen = false;
        ctrl.$rootScope.likeAlert = false;
        ctrl.$rootScope.skipAlert = false;
        ctrl.$rootScope = $rootScope;
        ctrl.$rootScope.currentLocation = '';

        navigator.geolocation.getCurrentPosition((position) => {
            ctrl.$rootScope.latitude = position.coords.latitude;
        });
        navigator.geolocation.getCurrentPosition((position) => {
            ctrl.$rootScope.longitude = position.coords.longitude;
        });

        

        ctrl.$rootScope.setLocation = () => {
            $('#location').prop('readonly', true);
            ctrl.$rootScope.currentLocation = ctrl.$rootScope.latitude + ", " + ctrl.$rootScope.longitude;
            $('#location').val(ctrl.$rootScope.currentLocation);


        }

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

        ctrl.$rootScope.seeLikesinGroup = () => {
            console.log();
        }

        // search yelp with a form
        ctrl.$rootScope.searchYelp = () => {
            ctrl.$rootScope.alert = false;
            ctrl.$rootScope.loadScreen = true;

        
        // instantiate new search JSON
            ctrl.searchParameters = {
                // grab values with JQuery from form
              "term": $('#term').val(),
              "location": $('#location').val(),
              "sort_by": 'rating',
              "limit": 10
            };

            ctrl.$rootScope.selectedGroup = $('#groupSelect option:selected').val();

            // simple post request to the backend to send search parameters.
            // creating an array of searchResults with the data for use in Swipes
            $http.post('https://swither.herokuapp.com/api/index', ctrl.searchParameters)
                .then( (response) => {
                    ctrl.$rootScope.searchResults.push(response.data);
                    $state.go('auth.swipes');
                    ctrl.$rootScope.loadScreen = false;
            }, (error) => {
                ctrl.$rootScope.loadScreen = false;
                ctrl.errorMessage();
            })
            
        } //end searchYelp




        // Adding swipes to the database if it is liked
        ctrl.$rootScope.saveLike = () => {
            ctrl.$rootScope.likeAlert = true;
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


            // set message to confirm add
            ctrl.$rootScope.message = "LIKED!";

            // set alert to true to show on page
            $timeout(() => {
                    // taking the first result off the array to cycle through results
                    ctrl.$rootScope.searchResults[0].splice(0, 1);
                    ctrl.$rootScope.likeAlert = false;
                    ctrl.$rootScope.message = '';
            // checks the results length to decide whether or not to redirect
            if (ctrl.$rootScope.searchResults[0].length === 0) {

                // redirect statement
                $state.go('auth.dashboard');

                ctrl.$rootScope.likeAlert = false;
            } // end if
                }, 750);
        } // end saveLike()



        // skips a Place in results and discards it
        ctrl.$rootScope.skipPlace = () => {

            // sets message to skipped! 
            ctrl.$rootScope.skipAlert = true;
            ctrl.$rootScope.message = "NOPE!";

            $timeout(() => {
                // taking the first result off the array to cycle through results
                ctrl.$rootScope.searchResults[0].splice(0, 1);
                ctrl.$rootScope.skipAlert = false;
                ctrl.$rootScope.message = '';

            // checks the results length to decide whether or not to redirect
            if (ctrl.$rootScope.searchResults[0].length === 0) {

                // redirect statement 
                $state.go('auth.dashboard');
                ctrl.$rootScope.likeAlert = false;
            }
            }, 750);
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
                // ctrl.$rootScope.groups.push(ctrl.newGroup);
            });

        } // end addGroup()

        ctrl.$rootScope.getGroups = () => {
            apiService.getUserGroups().query({id:window.localStorage.getItem('currentUser')})
            .$promise.then( (data) => {
                $rootScope.groups.push(data);
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
            })
        }


        ctrl.$rootScope.viewMatches = () => {
            ctrl.matchQuery = {
                "group_id": $('#matchRetrieve option:selected').val()
                }
            ctrl.incompatible = {
              "image_url": "./dist/css/wrong.png",
              "name": "No matches!!",
              "display_phone": "You're apparently incompatible with your group!"
            };
            ctrl.$rootScope.matches = [];
            $http.post('https://swither.herokuapp.com/api/matches', ctrl.matchQuery)
                .then( (response) => {
                    if (response.data.length >= 1) {
                        for (var i = 0; i < response.data.length; i++) {
                            ctrl.$rootScope.matches.push(JSON.parse(response.data[i].business_info));
                        }
                    } else {
                        ctrl.$rootScope.matches.push(ctrl.incompatible);
                    }
            })
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