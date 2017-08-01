import template from './dashboard.html';
import controller from './dashboard.controller';

let dashboardComponent = {
	bindings : {},
	template,
	controller: ['$rootScope', '$auth', '$http', '$state', controller],
	controllerAs : '$ctrl'
};


export default dashboardComponent;