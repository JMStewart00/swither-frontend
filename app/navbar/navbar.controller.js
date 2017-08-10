class navbarController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;

        ctrl.collapse = () => {
        	$('#navbarNav').toggleClass('collapse');
        	$('#navbarNav1').toggleClass('collapse');

        }

    };
}

export default navbarController;