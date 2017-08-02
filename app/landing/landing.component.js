import template from './landing.html';
import controller from './landing.controller';

let landingComponent = {
	bindings : {},
	template,
	controller: ['$rootScope', '$auth', '$http', '$state', controller],
	controllerAs : '$ctrl'
};


export default landingComponent;