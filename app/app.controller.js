class appCtrl {

    constructor($rootScope, $http, $location, $auth, $state, apiService) {

        let ctrl = this;
        ctrl.$rootScope = $rootScope;
        ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
        ctrl.$http = $http;
        ctrl.$rootScope.searchResults = [{
        "id": "velvet-taco-chicago",
        "name": "Velvet Taco",
        "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/MHRSqUs9jW5Rpo_ysfiLxg/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/velvet-taco-chicago?adjust_creative=_D0fpoWGQt3_-FGYLWuntg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=_D0fpoWGQt3_-FGYLWuntg",
        "review_count": 803,
        "categories": [
            {
                "alias": "newamerican",
                "title": "American (New)"
            },
            {
                "alias": "mexican",
                "title": "Mexican"
            }
        ],
        "rating": 4,
        "coordinates": {
            "latitude": 41.9021988,
            "longitude": -87.6285782
        },
        "transactions": [
            "delivery",
            "pickup"
        ],
        "price": "$$",
        "location": {
            "address1": "1110 N State St",
            "address2": "",
            "address3": "",
            "city": "Chicago",
            "zip_code": "60610",
            "country": "US",
            "state": "IL",
            "display_address": [
                "1110 N State St",
                "Chicago, IL 60610"
            ]
        },
        "phone": "+13127632654",
        "display_phone": "(312) 763-2654",
        "distance": 4083.25607216
    }];


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
            console.log('save');
            ctrl.$rootScope.userId = $auth.getPayload().sub;
            ctrl.like = {
              "user_id": ctrl.$rootScope.userId,
              "group_id": 1,
              "business_info": JSON.stringify(ctrl.$rootScope.searchResults[0])
            };

            apiService.addLike().save({}, ctrl.like)
                .$promise
                .then((data) => {
                    console.log(data);
                })
        } //end saveLike()



    } // end constructor


} // end appCtrl



export default appCtrl;