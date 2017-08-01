import template from './newEvent.html';
import controller from './newEvent.controller';

let newEventComponent = {
	bindings : {},
	template,
	controller: ['$rootScope', '$auth', '$http', '$state', controller],
	controllerAs : '$ctrl'
};


export default newEventComponent;