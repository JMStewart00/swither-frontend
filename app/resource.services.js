

function apiService($resource) {
	let ctrl = this;
	// All of the site api functions
	// let getYelp = () => $resource('http://localhost:7000/api/index');
	let	addLike = () => $resource('http://localhost:7000/api/likes/');
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
 //            'update': {method: 'PUT'}
 //        	});
		
		return {
				addLike : addLike,
	// 			searchYelp : searchYelp,
				}


}


export default apiService;
