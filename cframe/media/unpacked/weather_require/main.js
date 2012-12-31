WIDGET = {
    name: 'Weather',
    closedIcon: 'weather.svg',
    closedText: 'Weather Widget',
    closedIconColor: '#CCCCCC',
    highlightColor: 'rgba(77, 170, 255, 0.41)',
    openHeight: 1,
    openWidth: 3,
    config: {
        // list of woeid for yahoo api
        locations: [21125],
        conditionMap: [
            { id: 0, detail: "tornado", icon: "hurricane.svg" },
            { id: 1, detail: "tropical storm", icon: "hurricane-1.svg" },
            { id: 2, detail: "hurricane", icon: "hurricane (3).svg" },
            { id: 3, detail: "severe thunderstorms", icon: "rain-and-thumderstorm.svg" },
            { id: 4, detail: "thunderstorms", icon: "thunderstorm.svg" },
            { id: 5, detail: "mixed rain and snow", icon: ["rain.svg", 
                                                         "snow.svg"]},
            { id: 6, detail: "mixed rain and sleet", icon: ["rain.svg", 
                                                         "sleet.svg"]},
            { id: 7, detail: "mixed snow and sleet", icon:  ["snow.svg", 
                                                         "sleet.svg"]},
            { id: 8, detail: "freezing drizzle", icon: ["cold-2.svg", 
                                                         "drizzle.svg"] },
            { id: 9, detail: "drizzle", icon: "drizzle.svg" },
            { id: 10, detail: "freezing rain", icon:  ["cold.svg", 
                                                         "rain.svg"] },
            { id: 11, detail: "showers", icon: "shower.svg" },
            { id: 12, detail: "showers", icon: "shower.svg" },
            { id: 13, detail: "snow flurries", icon: "snow 2.svg" },
            { id: 14, detail: "light snow showers", icon:  ["light show.svg", 
                                                         "shower.svg"] },
            { id: 15, detail: "blowing snow", icon:  ["windy.svg", 
                                                         "snow.svg"]},
            { id: 16, detail: "snow", icon: "snow.svg" },
            { id: 17, detail: "hail", icon: "hail.svg" },
            { id: 18, detail: "sleet", icon: "hail-2.svg" },
            { id: 19, detail: "dust", icon: "dusty.svg" },
            { id: 20, detail: "foggy", icon: "fog.svg" },
            { id: 21, detail: "haze", icon: "fog 2.svg" },
            { id: 22, detail: "smoky", icon: "windy.svg" },
            { id: 23, detail: "blustery", icon: "windy-2.svg" },
            { id: 24, detail: "windy", icon: "windy.svg" },
            { id: 25, detail: "cold", icon: "cold.svg" },
            { id: 26, detail: "cloudy", icon: "day-cloud.svg" },

            { id: 27, detail: "mostly cloudy (night)", icon: "day-cloud.svg" },
            { id: 28, detail: "mostly cloudy (day)", icon: "day-cloud-2.svg" },
            { id: 29, detail: "partly cloudy (night)", icon: "day-cloud.svg" },
            { id: 30, detail: "partly cloudy (day)", icon: "day-cloud.svg" },
            { id: 31, detail: "clear (night)", icon: "error.svg" },
            { id: 32, detail: "sunny", icon: "error.svg" },
            { id: 33, detail: "fair (night)", icon: "day-cloud.svg" },
            { id: 34, detail: "fair (day)", icon: "error.svg" },
            { id: 35, detail: "mixed rain and hail", icon: "error.svg" },
            { id: 36, detail: "hot", icon: "error.svg" },
            { id: 37, detail: "isolated thunderstorms", icon: "error.svg" },
            { id: 38, detail: "scattered thunderstorms", icon: "rain-and-thunder-storm.svg" },
            { id: 39, detail: "scattered thunderstorms", icon: "error.svg" },
            { id: 40, detail: "scattered showers", icon: "error.svg" },
            { id: 41, detail: "heavy snow", icon: "error.svg" },
            { id: 42, detail: "scattered snow showers", icon: "error.svg" },
            { id: 43, detail: "heavy snow", icon: "error.svg" },
            { id: 44, detail: "partly cloudy", icon: "error.svg" },
            { id: 45, detail: "thundershowers", icon: "error.svg" },
            { id: 46, detail: "snow showers", icon: "error.svg" },
            { id: 47, detail: "isolated thundershowers", icon: "error.svg" },
            { id: 3200, detail: "not available", icon: "error.svg" }
        ]
    }, 
    weatherGeocode: function(location, cb) {
        var status;
        var results;
        var html = '';
        var msg = '';
        var output = '';

        if (location) {
            // Cache results for an hour to prevent overuse
            now = new Date();

            // Create Yahoo Weather feed API address
            var query = 'select * from geo.places where text="'+ location +'"';
            var api = 'http://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent(query) +'&rnd='+ now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() +'&format=json&callback=?';

            // Send request
            $.ajax({
                type: 'GET',
                url: api,
                dataType: 'json',
                success: function(data) {
                    console.log(data.query);
                    cb(data.query)
                },
                error: function(data) {
                    output = { error: 'An error has occurred'};
                }
            });

        } else {
            output = { error: 'Please enter a location or partial address'};
        }

        return output;
    },
    visibleHandler: function(){
        if(!this.store.has('weather')) {
            this.options.getWeather.apply(this)
        }
    },
    getLocation: function(){
        /*
        Present a large popup asking for the user location, 
        store a woeid
        */
        
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
        
        this.store.set('weather', weather);

        return this.options.renderWeather.call(this, weather)
    },
    renderWeather: function(weather) {

        this.text().text(weather.condition.text)
        var unit = ' &#8457;';
        if(weather.units.temperature == 'C') {
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
            return this.options.renderPage.apply(this, $(this.currentPage) )
        }
        this.hideLoader.call(this, 'getWeather');

        return true
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

        var self = this;
        function icon(code) {
            var path = this.context().path;
            var _icon = this.options.config.conditionMap[code].icon;
            return path + '/icons/' + _icon;
        }

        element.find('.today .icon img')[0].src = icon.call(this, w.condition.code);
        element.find('.today .text').text(w.condition.text)
        element.find('.today .temp').html(w.condition.temp + '' + unit)

        // element.find('.atmos .sunrise .icon img')[0].src = this.options.config.conditionMap[w.todayForcast.code].icon;
        element.find('.atmos .sunrise .text').text(w.sunrise)
        element.find('.atmos .sunset .text').text(w.sunset)

        element.find('.forecast .first .day').text(w.todayForcast.day)
        element.find('.forecast .second .day').text(w.tomorrowForcast.day)

        
        element.find('.forecast .first .text').text(w.todayForcast.text)
        element.find('.forecast .second .text').text(w.tomorrowForcast.text)

        element.find('.forecast .first .icon img')[0].src = icon.call(this, w.todayForcast.code)
        element.find('.forecast .second .icon img')[0].src = icon.call(this, w.tomorrowForcast.code)

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
        } else {
            this.options.renderWeather.call(this, this.store.get('weather'))
        }
    }
}

define(WIDGET)