'use strict';

import landingComponent from './landing.component';

let landingModule = angular.module('landing',['ui.router'])
.component('landing', landingComponent)


export default landingModule;