

function apiService($resource) {
	let ctrl = this;
	// All of the site api functions
	// let getYelp = () => $resource('http://localhost:7000/api/index');
	// let	searchYelp = () => $resource('http://localhost:7000/api/index/');
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
 //            'update': {method: 'PUT'}
 //        	});
		
		return {
	// 			getYelp : getYelp,
	// 			searchYelp : searchYelp,
				}

	// 	};
// function subnetsService($resource) {

// 	 return $resource('http://localhost:7000/api/subnets/:subnet', 
// 		 {
// 		 	subnet: "@subnet"
// 		 }
// 	 	);
}


export default apiService;
