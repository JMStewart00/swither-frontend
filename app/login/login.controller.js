class loginController {
    constructor($rootScope, $auth, $http, $state, $timeout, apiService) {
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
                    ctrl.$rootScope.userId = $auth.getPayload().sub;
                    window.localStorage.setItem('currentUser', ctrl.$rootScope.userId);
                    ctrl.$rootScope.getUserName();
                    $state.go('auth.dashboard');
                    ctrl.$rootScope.loginError = '';
                    ctrl.$rootScope.loadScreen = true;
                    ctrl.$rootScope.getGroups();

                    $timeout(() => {
                        if (ctrl.$rootScope.groups[0].length === 0) {
                            ctrl.$rootScope.loadScreen = false;
                            $state.go('auth.tutorial');

                        } else {
                            ctrl.$rootScope.loadScreen = false;
                            $state.go('auth.dashboard');

                        }
                    }, 1000);

                }, (error) => {
                    if (error.status === 401) {
                        ctrl.$rootScope.loginError = "Your email/password combination does not match our records."
                    }
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
              }, (error) => {
                 if (error.status === 422) {
                     ctrl.$rootScope.loginError = "Your password must be 6 characters long."
                 }
              })
            

        }


        ctrl.$rootScope.getUserName = () => {
             apiService.getUserName().query({id:window.localStorage.getItem('currentUser')})
            .$promise.then( (data) => {
                let nameSplit = data[0].name.split(' ');
                ctrl.$rootScope.firstNameCurrentUser = nameSplit[0];
                window.localStorage.setItem('currentUserName', ctrl.$rootScope.firstNameCurrentUser);
            })
        }


    }; // end constructor

}

export default loginController;