

function apiService($resource) {
	let ctrl = this;
	// All of the site api functions
	let addGroup = () => $resource('http://localhost:7000/api/groups/');
	let	addLike = () => $resource('http://localhost:7000/api/likes/');
	let	getUserGroups = () => $resource('http://localhost:7000/api/findgroups/:id', {id: "@id"});
	let addUserToGroup = () => $resource('http://localhost:7000/api/usergroups');
	let joinGroup = () => $resource('http://localhost:7000/api/joingroup');
	let refreshMatches = () => $resource('http://localhost:7000/api/matches/:id', {id:"@id"});
	let getMatches = () => $resource('http://localhost:7000/api/matches/:id', {id:"@id"});
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
 //            'update': {method: 'PUT'}
 //        	});
		
		return {
				addLike : addLike,
				addGroup : addGroup,
				getUserGroups: getUserGroups,
				addUserToGroup: addUserToGroup,
				joinGroup: joinGroup,
				refreshMatches: refreshMatches,
				getMatches: getMatches,

				}


}


export default apiService;
