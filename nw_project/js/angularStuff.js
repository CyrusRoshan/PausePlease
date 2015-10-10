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

		//'https://www.google.com/calendar/feeds/i2jntos0susho4i1kf0jl988ls%40group.calendar.google.com/public/basic'

		this.getCal = $.getJSON('http://whateverorigin.org/get?url=' + this.urlValue + '&callback=?', function(data){
			for(i = 1; i <= data.contents.split("<title type='html'>").length; i++){
				this.events[i-1].name = data.contents.split("<title type='html'>")[i].split("</title>")[0];
				this.events[i-1].time = Date.parse(window.stuff.split("<title type='html'>")[i].split("</title>")[1].split("When: ")[1].split("&amp;")[0].split(" to")[0].slice(0, - 2))
				if(window.stuff.split("<title type='html'>")[5].split("</title>")[1].split("When: ")[1].split("&amp;")[0].split(" to")[0].slice(-2) == 'pm'){
					this.events[i-1] += 43200000;
				}
			}
		});
	}]);
