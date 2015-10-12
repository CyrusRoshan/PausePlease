angular.module('angApp', [])
	.controller('ctrl', ['$scope', function($scope, $watch) {
		this.state = "disabled";
		this.infos = [
			{
				title:'Time Sitting:',
				content: function(){
					ms = (new Date().getTime() - $scope.lastTime);
					return (parseInt(ms/1000/60/60 % 24) + " hrs, " + parseInt(ms/1000/60 % 60) + " min, " + parseInt(ms/1000 % 60) + " sec");

				},
				content2: function(){},
				warning: function(){return false},
			},
			{
				title:'Raw Values',
				content: function(){ return $scope.leftSensorVal},
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
		$scope.lastChecked = 0;
		$scope.beenChecked = false;
		$scope.lastTime = new Date().getTime();
		$scope.getCal = function(){
			if($scope.lastChecked < new Date().getTime() - 60000){
				$scope.lastChecked = new Date().getTime();
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
			}

			return $scope.events;
		}

		$scope.state = 'enabled';
		$scope.triggerValue = 0;
		$scope.stateSwitch = function(){
			console.log($scope.state);
			if($scope.state == 'enabled'){
				$scope.state = 'disabled';
			}
			else{
				$scope.state = 'enabled';
			}
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

		$scope.checkValues = function(){
			jQuery.ajax({
				url: "https://api.particle.io/v1/devices/1e003b000c47343233323032/rightSensor?access_token=80e4e952b6d84e64327c67f1985844d3e19d5f17",
				type: "GET",
				dataType: "json",
				async: true,
				success: function (data) {
					$scope.leftSensorVal = data.result;
					console.log(data.result);
					if(data.result < $scope.triggerValue + 10){
						$scope.lastTime = new Date().getTime();
						$.post("http://localhost:8080/page2", {name: i++}, function(data, status){
							alert("Data: " + data + "\nStatus: " + status);
						});
					}
				}
			});
		}


		$scope.calibrate = function(){
			jQuery.ajax({
				url: "https://api.particle.io/v1/devices/1e003b000c47343233323032/rightSensor?access_token=80e4e952b6d84e64327c67f1985844d3e19d5f17",
				type: "GET",
				dataType: "json",
				async: true,
				success: function (data) {
					$scope.triggerValue = data.result;
					console.log("-------------" + $scope.triggerValue);
				}
			})};

		setInterval(function(){$scope.nextEventTime(); $scope.$digest(); $scope.checkValues()}, 1000);
	}]);
