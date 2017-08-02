'use strict';

import swipeScreenComponent from './swipeScreen.component';

let swipeScreenModule = angular.module('swipeScreen',['ui.router'])
.component('swipeScreen', swipeScreenComponent)


export default swipeScreenModule;