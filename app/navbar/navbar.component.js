import template from './navbar.html';
import controller from './navbar.controller';

let navbarComponent = {
	bindings : {},
	template,
	controller: ['$rootScope', '$auth', '$http', '$state', controller],
	controllerAs : '$ctrl'
};


export default navbarComponent;