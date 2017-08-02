'use strict';

import newEventComponent from './newEvent.component';

let newEventModule = angular.module('newEvent',['ui.router'])
.component('newEvent', newEventComponent)


export default newEventModule;