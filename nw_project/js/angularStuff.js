angular.module('angApp', [])
	.controller('ctrl', ['$scope', function($scope, $watch) {
		this.state = "disabled";
		this.infos = [
			{
				title:'Time Sitting:',
				content: function(){ return '0 hrs, 0 min, 0 sec'},
				content2: function(){},
				warning: function(){return false},
			},
			{
				title:'Time Focused:',
				content: function(){ return '0 hrs, 0 min, 0 sec'},
				content2: function(){},
				warning: function(){return false},
			},
			{
				title:'Next Event:',
				content: function(){return $scope.nextEventTime().name + ", in"},
				content2: function(){return $scope.nextEventTime().time},
				warning: function(){return ($scope.nextEventTime().timeLeft < 600000)}
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
							time: Date.parse(data.contents.split("<title type='html'>")[i].split("</title>")[1].split("When: ")[1].split("&amp;")[0].split(" to")[0].slice(0, - 2)+":00")
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

			return $scope.events;
		}

		$scope.nextEventTime = function(){
			nextTime = $scope.getCal()[0].time;
			eventName = $scope.getCal()[0].name;
			for(i = 1; i < $scope.getCal().length; i++){
				if($scope.getCal()[i].time < nextTime && new Date().getTime() < $scope.getCal()[i].time){
					nextTime = $scope.getCal()[i].time;
					eventName = $scope.getCal()[i].name;
				}
			}
			ms = (nextTime - new Date().getTime());
			eventTime = parseInt(ms/1000/60/60 % 24) + " hrs, " + parseInt(ms/1000/60 % 60) + " min, " + parseInt(ms/1000 % 60) + " sec";
			eventObject = {
				time: eventTime,
				name: eventName,
				timeLeft: (nextTime - new Date().getTime())
			}
			return eventObject;
		}

		setInterval(function(){$scope.nextEventTime(); $scope.$digest()}, 1000);
	}]);
