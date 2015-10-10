angular.module('angApp', [])
	.controller('ctrl', ['$scope', function($scope) {
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

		$scope.urlValue = 'https://www.google.com/calendar/feeds/i2jntos0susho4i1kf0jl988ls%40group.calendar.google.com/public/basic'

		$scope.events = [];

		$scope.getCal = function(){
			$.ajax({
				type: 'GET',
				url: 'http://whateverorigin.org/get?url=' + $scope.urlValue + '&callback=?',
				dataType: 'json',
				success: function(data) {
					for(i = 1, j = 0; i < data.contents.split("<title type='html'>").length; i++){
						$scope.events[i-1] = {
							name: data.contents.split("<title type='html'>")[i].split("</title>")[0],
							time: Date.parse(data.contents.split("<title type='html'>")[i].split("</title>")[1].split("When: ")[1].split("&amp;")[0].split(" to")[0].slice(0, - 2))
						};
						if(data.contents.split("<title type='html'>")[i].split("</title>")[1].split("When: ")[1].split("&amp;")[0].split(" to")[0].slice(-2) == 'pm'){
							$scope.events[i-1].time += 43200000;
						}
					}
				},
				data: {},
				async: false
			});
			$scope.events.sort(function(a,b) { return a.name - b.name; });

			for(i = 0; i<$scope.events.length; i++){
				console.log(i);
			console.log(new Date($scope.events[i].time).toLocaleString());
			}
			console.log($scope.events);
			return $scope.events;
		}
	}]);
