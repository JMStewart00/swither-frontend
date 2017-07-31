class loginController {
    constructor($rootScope, $auth, $http) {
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
                    ctrl.$rootScope.token = data.data.access_token;
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + ctrl.$rootScope.token;
                    $http.defaults.headers.common['Accept'] = 'application/json';
                    // If login is successful, redirect to the users state
                    // window.location.href = "#!/home";
                    console.log();
                }).catch((error) => {
                    alert('wrong!');
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

              })
              .catch( (response) => {
                 alert('whoops');
                 console.log(user);
              });
            }
    };
}

export default loginController;