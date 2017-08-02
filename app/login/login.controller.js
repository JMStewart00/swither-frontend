class loginController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;


        // define login function for use in the front end
        ctrl.$rootScope.login = () => {

            // grab credentials from the front end form and send off to login
            let credentials = {
                grant_type: 'password',
                client_id: 1,
                client_secret: 'Zlp39UHfaR8Zcoeh3UcXfZnwt1ZEWcchaIjKFObl',
                username: ctrl.email,
                password: ctrl.password
            }

            // Use Satellizer's $auth service to login
            $auth.login(credentials)
                .then((data) => {
                    $auth.setToken(data.data.access_token);
                    $state.go('auth.dashboard');
                    ctrl.$rootScope.loginStatus = $auth.isAuthenticated();
                    ctrl.$rootScope.userId = $auth.getPayload().sub;
                    window.localStorage.setItem('currentUser', ctrl.$rootScope.userId);
                    ctrl.$rootScope.loginError = '';

                }).catch((error) => {
                    ctrl.$rootScope.loginError = error.data.message;
                })

        } // end login


        // define function called signup
        ctrl.$rootScope.signup = () => {

            // grab data from the form to send to the backend for registering new user
            let user = {
                name: ctrl.name,
                email: ctrl.email,
                password: ctrl.password,
                password_confirmation: ctrl.password_confirmation,
                // grant_type: 'password',
                // client_id: 1,
                // client_secret: 'Zlp39UHfaR8Zcoeh3UcXfZnwt1ZEWcchaIjKFObl'
            };

            // satellizer's signup function to send data via http request to server.
            $auth.signup(user)
              .then( (response) => {
                $state.go('login');
              })
              .catch( (error) => {
                 
              });
            }





    }; // end constructor
}

export default loginController;