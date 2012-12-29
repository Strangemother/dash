WIDGET = {
    name: 'Weather',
    closedIcon: '/static/img/icons/weather.svg',
    closedText: 'Weather Widget',
    closedIconColor: '#CCCCCC',
    highlightColor: 'rgba(77, 170, 255, 0.41)',
    openHeight: 1,
    openWidth: 3,
    config: {
        // list of woeid for yahoo api
        locations: [21125],
        conditionMap: [
            { id: 0, detail: "tornado", icon: ASSET_IMG_URL + "hurricane.svg" },
            { id: 1, detail: "tropical storm", icon: ASSET_IMG_URL + "hurricane-1.svg" },
            { id: 2, detail: "hurricane", icon: ASSET_IMG_URL + "hurricane (3).svg" },
            { id: 3, detail: "severe thunderstorms", icon: ASSET_IMG_URL + "rain-and-thumderstorm.svg" },
            { id: 4, detail: "thunderstorms", icon: ASSET_IMG_URL + "thunderstorm.svg" },
            { id: 5, detail: "mixed rain and snow", icon: [ASSET_IMG_URL + "rain.svg", 
                                                         ASSET_IMG_URL + "snow.svg"]},
            { id: 6, detail: "mixed rain and sleet", icon: [ASSET_IMG_URL + "rain.svg", 
                                                         ASSET_IMG_URL + "sleet.svg"]},
            { id: 7, detail: "mixed snow and sleet", icon:  [ASSET_IMG_URL + "snow.svg", 
                                                         ASSET_IMG_URL + "sleet.svg"]},
            { id: 8, detail: "freezing drizzle", icon: [ASSET_IMG_URL + "cold-2.svg", 
                                                         ASSET_IMG_URL + "drizzle.svg"] },
            { id: 9, detail: "drizzle", icon: ASSET_IMG_URL + "drizzle.svg" },
            { id: 10, detail: "freezing rain", icon:  [ASSET_IMG_URL + "cold.svg", 
                                                         ASSET_IMG_URL + "rain.svg"] },
            { id: 11, detail: "showers", icon: ASSET_IMG_URL + "shower.svg" },
            { id: 12, detail: "showers", icon: ASSET_IMG_URL + "shower.svg" },
            { id: 13, detail: "snow flurries", icon: ASSET_IMG_URL + "snow 2.svg" },
            { id: 14, detail: "light snow showers", icon:  [ASSET_IMG_URL + "light show.svg", 
                                                         ASSET_IMG_URL + "shower.svg"] },
            { id: 15, detail: "blowing snow", icon:  [ASSET_IMG_URL + "windy.svg", 
                                                         ASSET_IMG_URL + "snow.svg"]},
            { id: 16, detail: "snow", icon: ASSET_IMG_URL + "snow.svg" },
            { id: 17, detail: "hail", icon: ASSET_IMG_URL + "hail.svg" },
            { id: 18, detail: "sleet", icon: ASSET_IMG_URL + "hail-2.svg" },
            { id: 19, detail: "dust", icon: ASSET_IMG_URL + "dusty.svg" },
            { id: 20, detail: "foggy", icon: ASSET_IMG_URL + "fog.svg" },
            { id: 21, detail: "haze", icon: ASSET_IMG_URL + "fog 2.svg" },
            { id: 22, detail: "smoky", icon: ASSET_IMG_URL + "windy.svg" },
            { id: 23, detail: "blustery", icon: ASSET_IMG_URL + "windy-2.svg" },
            { id: 24, detail: "windy", icon: ASSET_IMG_URL + "windy.svg" },
            { id: 25, detail: "cold", icon: ASSET_IMG_URL + "cold.svg" },
            { id: 26, detail: "cloudy", icon: ASSET_IMG_URL + "day-cloud.svg" },

            { id: 27, detail: "mostly cloudy (night)", icon: ASSET_IMG_URL + "day-cloud.svg" },
            { id: 28, detail: "mostly cloudy (day)", icon: ASSET_IMG_URL + "day-cloud-2.svg" },
            { id: 29, detail: "partly cloudy (night)", icon: ASSET_IMG_URL + "day-cloud.svg" },
            { id: 30, detail: "partly cloudy (day)", icon: ASSET_IMG_URL + "day-cloud.svg" },
            { id: 31, detail: "clear (night)", icon: ASSET_IMG_URL + "++.svg" },
            { id: 32, detail: "sunny", icon: ASSET_IMG_URL + "++.svg" },
            { id: 33, detail: "fair (night)", icon: ASSET_IMG_URL + "day-cloud.svg" },
            { id: 34, detail: "fair (day)", icon: ASSET_IMG_URL + "++.svg" },
            { id: 35, detail: "mixed rain and hail", icon: ASSET_IMG_URL + "++.svg" },
            { id: 36, detail: "hot", icon: ASSET_IMG_URL + "++.svg" },
            { id: 37, detail: "isolated thunderstorms", icon: ASSET_IMG_URL + "++.svg" },
            { id: 38, detail: "scattered thunderstorms", icon: ASSET_IMG_URL + "rain-and-thunder-storm.svg" },
            { id: 39, detail: "scattered thunderstorms", icon: ASSET_IMG_URL + "++.svg" },
            { id: 40, detail: "scattered showers", icon: ASSET_IMG_URL + "++.svg" },
            { id: 41, detail: "heavy snow", icon: ASSET_IMG_URL + "++.svg" },
            { id: 42, detail: "scattered snow showers", icon: ASSET_IMG_URL + "++.svg" },
            { id: 43, detail: "heavy snow", icon: ASSET_IMG_URL + "++.svg" },
            { id: 44, detail: "partly cloudy", icon: ASSET_IMG_URL + "++.svg" },
            { id: 45, detail: "thundershowers", icon: ASSET_IMG_URL + "++.svg" },
            { id: 46, detail: "snow showers", icon: ASSET_IMG_URL + "++.svg" },
            { id: 47, detail: "isolated thundershowers", icon: ASSET_IMG_URL + "++.svg" },
            { id: 3200, detail: "not available", icon: ASSET_IMG_URL + "++.svg" }
        ]
    }, 
    visibleHandler: function(){
        if(!this.store.has('weather')) {
            this.options.getWeather.apply(this)
        }
    },
    getWeather: function() {
        var self = this;
        this.options._getWeather.apply(self);
        window.setInterval(function(self, f){
            console.log("getWeather")
            f.apply(self);
        }, (5*60*1000), self, this.options._getWeather);

    },
    _getWeather: function(){
        this.showLoader('getWeather');
        //debugger;
        var woeid = true;
        var locationid = '';
        
        for (var i=0; i<this.options.config.locations.length; i++) {
            if (locationid != '') locationid += ',';
            locationid += "'"+ this.options.config.locations[i] + "'";
        }
        
        now = new Date();
        var queryType = woeid ? 'woeid' : 'location';
        var query = "select * from weather.forecast where "+ queryType +" in ("+ locationid +") and u='c'";
        var api = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(query) 
            +'&rnd='+ now.getFullYear() 
            + now.getMonth() 
            + now.getDay() 
            + now.getHours() +'&format=json&callback=?';

        this.options.dataRequest.call(this, api);
    },
    dataRequest: function(api){
        // Send request
        var _s = this;
        $.ajax({
            type: 'GET',
            url: api,
            dataType: 'json',
            success: function(data) {

                if (data.query) {
        
                    if (data.query.results.channel.length > 0 ) {
                        
                        // Multiple locations
                        var result = data.query.results.channel.length;
                        for (var i=0; i<result; i++) {
                            // Create weather feed item
                            _s.options.renderResult.call(_s, data.query.results.channel[i]);
                        }
                    } else {
                        // Single location only
                        _s.options.renderResult.call(_s, data.query.results.channel);
                    }

                } else {
                    if (options.showerror) $e.html('<p>Weather information unavailable</p>');
                }
            },
            error: function(data) {
                if (options.showerror) $e.html('<p>Weather request failed</p>');
            }
        })
    },
    renderResult: function(feed) {
        // Format feed items
        var weather = {
            "windDirecton": feed.wind.direction,
            "todayForcast": feed.item.forecast[0],
            "tomorrowForcast": feed.item.forecast[1],
            'sunrise': feed.astronomy.sunrise,
            'sunset': feed.astronomy.sunset,
            "condition": feed.item.condition,
            "location": feed.location,
            "wpd": feed.item.pubDate,
            "condCode": feed.item.condition.code,
            "units": feed.units
        }
        
        this.store.set('weather', weather)
        


        this.text().text(weather.condition.text)
        var unit = ' &#8457;';
        if(feed.units.temperature == 'C') {
            unit =  '&deg;';
        }

        this.content_1().html(weather.condition.temp + '<span class="content_1_unit">' + unit + '</span>')
        for (var i = 0; i < this.options.config.conditionMap.length; i++) {
            var map = this.options.config.conditionMap[i];
            if(map.id == weather.condCode) {
                var icons = map.icon;
                if(typeof(icons) == 'string')  {
                    //one icon
                    this.closedIcons([icons]).openIcons([icons]);
                } else {
                    this.closedIcons(icons).openIcons(icons)
                };
            }
        };

        if(pageVisible) {
            this.options.renderPage.apply(this, this.currentPage)
        }
        this.hideLoader.call(this, 'getWeather');
    },
    renderPage: function(element) {
        // pass a jquery iframe element (a page)
        if(!this.store.has('weather')) {
            this.options.getWeather.apply(this)
        }

        w = this.store.get('weather');
        
        element.find('.city').text(w.location.city)
        element.find('.country').text(w.location.country)
    
        var unit = ' &#8457;';
        if(w.units.temperature == 'C') {
            unit =  '&deg;';
        }

        element.find('.today .icon img')[0].src = this.options.config.conditionMap[w.condition.code].icon;
        element.find('.today .text').text(w.condition.text)
        element.find('.today .temp').html(w.condition.temp + '' + unit)

        // element.find('.atmos .sunrise .icon img')[0].src = this.options.config.conditionMap[w.todayForcast.code].icon;
        element.find('.atmos .sunrise .text').text(w.sunrise)
        element.find('.atmos .sunset .text').text(w.sunset)

        element.find('.forecast .first .day').text(w.todayForcast.day)
        element.find('.forecast .second .day').text(w.tomorrowForcast.day)

        
        element.find('.forecast .first .text').text(w.todayForcast.text)
        element.find('.forecast .second .text').text(w.tomorrowForcast.text)

        element.find('.forecast .first .icon img')[0].src = this.options.config.conditionMap[w.todayForcast.code].icon
        element.find('.forecast .second .icon img')[0].src = this.options.config.conditionMap[w.tomorrowForcast.code].icon

        element.find('.date').text(w.wpd)
    },
    pageLoadHandler: function(element) {
        // project javascript hook
        pageVisible = true;
        var el = $(element)
        this.options.renderPage.call(this, el);
    },
    closedHandler: function() { 
        pageVisible = false;
    },
    openHandler: function(){
        console.log('loaded weather')
        if(!this.store.has('weather')) {
            this.options.getWeather.apply(this)
        }
    }
}

registerWidget(WIDGET)