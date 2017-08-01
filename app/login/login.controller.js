class loginController {
    constructor($rootScope, $auth, $http, $state) {
        let ctrl=this;
        ctrl.$rootScope = $rootScope;


        ctrl.login = () => {

            let credentials = {
                grant_type: 'password',
                client_id: 1,
                client_secret: 'DKlsxJbWHCctqF99zBDCwFWON7Yb8m73oXXfavLY',
                username: ctrl.email,
                password: ctrl.password
            }

            // Use Satellizer's $auth service to login
            $auth.login(credentials)
                .then((data) => {
                    $auth.setToken(data.data.access_token);
                    console.log($auth.isAuthenticated());
                    $state.go('dash');

                }).catch((error) => {
                    ctrl.$rootScope.loginError = error.data.message;
                    console.log($auth.isAuthenticated());
                })

        } // end login


        ctrl.signup = () => {

            let user = {
                name: ctrl.name,
                email: ctrl.email,
                password: ctrl.password,
                password_confirmation: ctrl.password_confirmation,
                grant_type: 'password',
                client_id: 1,
                client_secret: 'DKlsxJbWHCctqF99zBDCwFWON7Yb8m73oXXfavLY'
            };

            $auth.signup(user)
              .then( (response) => {
                windnow.location.href = '/login';
              })
              .catch( (error) => {
                 
              });
            }
    };
}

export default loginController;