class appCtrl {

    constructor($rootScope, $http, $location, $auth, $state, $timeout, apiService) {

        let ctrl = this;
        ctrl.$rootScope = $rootScope;
        ctrl.$http = $http;


        ctrl.$rootScope.screens =  [
            {image: 'dist/css/screens/0.png', instructions: "Upon registration, you'll be greeted with this screen. You'll need to either join a group with credentials that you've received from a friend or you can create your own group! You pick!"},
            {image: 'dist/css/screens/1.png', instructions: "On the 'Add Group' page you'll be asked to fill in a group name that will be case sensitive with a 4-digit PIN number! Hang on to those and send them to other potential group members!"},
            {image: 'dist/css/screens/2.png', instructions: "If you wanted to join a group, simply input the group name (case sensitive) into the input field and enter the PIN to join in."},
            {image: 'dist/css/screens/3.png', instructions: "The dashboard is the most prominent screen you'll see during your use of SWiTHER. It will allow you to add a new group, join a group, set up a new group outing, see your group matches, see your personal matches and finally learn more about the app"},
            {image: 'dist/css/screens/8.png', instructions: "The first thing you'll want to do is select the 'New Group Outing' button to set up a set up potential matches."},
            {image: 'dist/css/screens/4.png', instructions: "From the next screen you can select which group you're going to want to match with, select a search parameter for the night out, and enter a location or hit the location button. Then you'll click 'Go!' to get your matches."},
            {image: 'dist/css/screens/5.png', instructions: "The next screen you'll see is the 'Swipe Screen'. Don't be fooled by the name because it doesn't swipe yet but it will in the future. Here you'll see a business that you may choose to like with the heart or get rid of with the thumbs down. The search will return 10 results at the most. It's easy as that."},
            {image: 'dist/css/screens/6.png', instructions: "After returning to the dashboard, you may go to the 'Get Group Matches' page to see any matches that you have with your group up to this point. Select from the dropdown and hit retrieve to see them all."},
            {image: 'dist/css/screens/7.png', instructions: "That's it! You may look at your likes in the 'Your Personal Likes' section or learn more about the app in the 'More About SWiTHER' section. Enjoy!"}
        ]

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
        ctrl.$rootScope.gotLocation = false;
        ctrl.$rootScope.showLikesTable = false;


        // sets variables on page load of location for l
        navigator.geolocation.getCurrentPosition((position) => {
            ctrl.$rootScope.gotLocation = true;
            ctrl.$rootScope.latitude = position.coords.latitude;
            ctrl.$rootScope.longitude = position.coords.longitude;
            $timeout(() => {
                ctrl.$rootScope.alert = false;
            }, 10);
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
            ctrl.getLikesbyGroup = {
                "group_id": $('#seeLikes option:selected').val(),
                "user_id": window.localStorage.getItem('currentUser')
                };

            ctrl.$rootScope.likes = [];
            $http.post('https://swither.herokuapp.com/api/likesbygroup', ctrl.getLikesbyGroup)
                .then( (response) => {
                    ctrl.$rootScope.showLikesTable = true;
                    console.log(response.data);
                    if (response.data.length >= 1) {
                        for (var i = 0; i < response.data.length; i++) {
                            ctrl.$rootScope.likes.push(JSON.parse(response.data[i].business_info));
                        }
                    } else {
                        ctrl.$rootScope.likes.push(ctrl.incompatible);
                    }
            })
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