class dashboardController {
    constructor($rootScope, $auth, $http, $state ) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;

        ctrl.$rootScope.nextScreenInTutorial = () => {
            if (ctrl.$rootScope.screens.length > 1) {
                ctrl.$rootScope.screens.splice(0, 1);
            } else {
                $state.go('auth.firstlogin');
            }

        }

        ctrl.$rootScope.endTutorial = () => {
            $state.go('auth.firstlogin')
            console.log('skipped it!');
        }
    };
}

export default dashboardController;