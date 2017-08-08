class newEventController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;
         navigator.geolocation.getCurrentPosition((position) => {
        	ctrl.$rootScope.latitude = position.coords.latitude;
        });
        navigator.geolocation.getCurrentPosition((position) => {
        	ctrl.$rootScope.longitude = position.coords.longitude;
        });

}

}

export default newEventController;