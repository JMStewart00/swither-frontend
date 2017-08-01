class appCtrl {

	constructor($rootScope, $http, $location, $auth, $state, apiService) {

		let ctrl = this;
		ctrl.$rootScope = $rootScope;
		ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
		ctrl.$http = $http;
		ctrl.$rootScope.searchResults = [];



        // global logout function to be able to be called from anywhere.
        ctrl.$rootScope.logout = () => {
            $auth.logout();
            ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
            $state.go('login');
        }



		// // Setting a global function for getting ALL sites from API
		// ctrl.$rootScope.getYelp = () => {

		// 	// grabs api data for all the sites with the ngresource query()
		// 	ctrl.query = apiService.getYelp().query();

		// 	// pushes data to sites object
		// 	ctrl.query.$promise.then( (data) => {
		// 		ctrl.$rootScope.yelpReturn = data;
		// 	})	

		// } // end getYelp()


		// add a site from form
		ctrl.$rootScope.searchYelp = () => {

		// instantiate new site JSON
			ctrl.searchParameters = {
				// grab values with JQuery from form
			  "term": $('#term').val(),
			  "location": $('#location').val()
			};

			$http.post('http://localhost:7000/api/index', ctrl.searchParameters)
				.then( (response) => {
					console.log(response.data);
					ctrl.$rootScope.searchResults.push(response.data);
					console.log(ctrl.$rootScope.searchResults);
					$state.go('auth.dashboard');
			})
			// };
 			
		} //end searchYelp



	} // end constructor


} // end appCtrl



export default appCtrl;