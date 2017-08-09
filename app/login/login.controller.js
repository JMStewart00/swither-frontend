class loginController {
    constructor($rootScope, $auth, $http, $state, $timeout) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;


        // define login function for use in the front end
        ctrl.$rootScope.login = () => {

            // grab credentials from the front end form and send off to login
            let credentials = {
                grant_type: 'password',
                client_id: 1,
                client_secret: 'ZmBkz0htbNnejtjZZGplCwu6gYknRGctKBGUG0Xh',
                username: ctrl.email,
                password: ctrl.password
            }

            // Use Satellizer's $auth service to login
            $auth.login(credentials)
                .then((data) => {
                    $auth.setToken(data.data.access_token);
                    ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
                    console.log($auth.isAuthenticated());
                    ctrl.$rootScope.userId = $auth.getPayload().sub;
                    window.localStorage.setItem('currentUser', ctrl.$rootScope.userId);
                    $state.go('auth.dashboard');
                    ctrl.$rootScope.loginError = '';

                }).then(()=>{
                    ctrl.$rootScope.loadScreen = true;
                    ctrl.$rootScope.getGroups();
                    $timeout(() => {
                        if (ctrl.$rootScope.groups[0].length === 0) {
                            ctrl.$rootScope.loadScreen = false;
                            $state.go('auth.firstlogin');

                        } else {
                            ctrl.$rootScope.loadScreen = false;
                            $state.go('auth.dashboard');

                        }
                    }, 1000);
                });

        } // end login


        // define function called signup
        ctrl.$rootScope.signup = () => {

            // grab data from the form to send to the backend for registering new user
            let user = {
                name: ctrl.name,
                email: ctrl.email,
                password: ctrl.password,
                password_confirmation: ctrl.password_confirmation,
            };

            

            // satellizer's signup function to send data via http request to server.
            $auth.signup(user)
              .then( (response) => {
                ctrl.$rootScope.userName = user.name;
                ctrl.$rootScope.login();
              })
              .catch( (error) => {
                 console.log(error);
              });
            }





    }; // end constructor
}

export default loginController;