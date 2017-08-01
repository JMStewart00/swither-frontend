'use strict';

import dashboardComponent from './dashboard.component';

let dashboardModule = angular.module('dashboard',['ui.router'])
.component('dashboard', dashboardComponent)


export default dashboardModule;