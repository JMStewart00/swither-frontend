'use strict';

import navbarComponent from './navbar.component';

let navbarModule = angular.module('navbar',['ui.router'])
.component('navbar', navbarComponent)


export default navbarModule;