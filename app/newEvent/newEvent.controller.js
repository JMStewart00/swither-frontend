class newEventController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;
        ctrl.$rootScope.getGroups();

        ctrl.$rootScope.$watch('groups', () => {
        	console.log('groups changed');
            ctrl.$rootScope.getGroups();
        });

}

}

export default newEventController;