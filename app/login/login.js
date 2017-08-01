'use strict';

import loginComponent from './login.component';

let loginModule = angular.module('login',['ui.router'])
.component('login', loginComponent)


export default loginModule;