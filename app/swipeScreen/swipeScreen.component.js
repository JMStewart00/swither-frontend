import template from './swipeScreen.html';
import controller from './swipeScreen.controller';

let swipeScreenComponent = {
	bindings : {},
	template,
	controller: ['$rootScope', '$auth', '$http', '$state', controller],
	controllerAs : '$ctrl'
};


export default swipeScreenComponent;