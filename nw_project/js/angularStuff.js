angular.module('angApp', [])
	.controller('ctrl', [function() {
		this.state = "disabled";
		this.infos = [
			{
				title:'Time Sitting:',
				content: '0 hrs, 0 min, 0 sec',
				warning: false,
			},
			{
				title:'Time Focused:',
				content: '0 hrs, 0 min, 0 sec',
				warning: false,
			},
			{
				title:'Next Event In:',
				content: '0 hrs, 0 min, 0 sec',
				warning: false,
			},
		]
	}]);
