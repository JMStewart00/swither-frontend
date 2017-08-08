

function apiService($resource) {
	let ctrl = this;
	// All of the site api functions
	let addGroup = () => $resource('https://swither.herokuapp.com/api/groups/');
	let	addLike = () => $resource('https://swither.herokuapp.com/api/likes/');
	let	getUserGroups = () => $resource('https://swither.herokuapp.com/api/findgroups/:id', {id: "@id"});
	let	seeLikesinGroup = () => $resource('https://swither.herokuapp.com/api/likes/:id', {id: "@id"});
	let addUserToGroup = () => $resource('https://swither.herokuapp.com/api/usergroups');
	let joinGroup = () => $resource('https://swither.herokuapp.com/api/joingroup');
	let refreshMatches = () => $resource('https://swither.herokuapp.com/api/matches/:id', {id:"@id"});
	let getMatches = () => $resource('https://swither.herokuapp.com/api/matches/:id', {id:"@id"});
	// let updateSite = () => $resource('http://localhost:7000/api/sites/:site', {site: "@site"}, {
 //            'update': {method: 'PUT'}
 //        	});
		
		return {
				addLike : addLike,
				addGroup : addGroup,
				getUserGroups: getUserGroups,
				seeLikesinGroup: seeLikesinGroup,
				addUserToGroup: addUserToGroup,
				joinGroup: joinGroup,
				refreshMatches: refreshMatches,
				getMatches: getMatches,

				}


}


export default apiService;
