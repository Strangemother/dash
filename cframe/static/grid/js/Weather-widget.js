
/// =============================================================================================

HelloWorldWidget = {
    /* By default this is true unless set false */
    
    name: 'Hello World',
    closedIcon: '/static/img/icons/hello.svg',
    closedText: 'Hello',
    openIcon: '/static/img/icons/world.svg',
    openText: 'World.',
    highlightColor: '#2E454D',

    visibleHandler: function(){
        page.fullalert('Hello World Widget Created',
            'Some widgets can show a popup when they are first created.' , '/static/img/icons/creation.svg')
    },
    touchHandler: function(ev){
        if(ev.type != 'release') {
            this.text().text(ev.type);
            //console.log('Hello world heard', ev.type);
            //console.log(this)

            if(ev.type == 'doubletap') this.toggleState();
        }
    },
} 

WeatherWidget = {
    name: 'Weather',
    closedIcon: '/static/img/icons/weather.svg',
    closedText: 'Weather Widget',
    closedIconColor: '#CCCCCC',
    highlightColor: '#333',
    openHeight: 1,
    openWidth: 3,
    config: {
        // list of woeid for yahoo api
        locations: [21125],
        conditionMap: [
            { id: 0, detail: "tornado", icon: "/static/grid/img/hurricane.svg" },
            { id: 1, detail: "tropical storm", icon: "/static/grid/img/hurricane-1.svg" },
            { id: 2, detail: "hurricane", icon: "/static/grid/img/hurricane (3).svg" },
            { id: 3, detail: "severe thunderstorms", icon: "/static/grid/img/rain-and-thumderstorm.svg" },
            { id: 4, detail: "thunderstorms", icon: "/static/grid/img/thunderstorm.svg" },
            { id: 5, detail: "mixed rain and snow", icon: ["/static/grid/img/rain.svg", 
                                                         "/static/grid/img/snow.svg"]},
            { id: 6, detail: "mixed rain and sleet", icon: ["/static/grid/img/rain.svg", 
                                                         "/static/grid/img/sleet.svg"]},
            { id: 7, detail: "mixed snow and sleet", icon:  ["/static/grid/img/snow.svg", 
                                                         "/static/grid/img/sleet.svg"]},
            { id: 8, detail: "freezing drizzle", icon: ["/static/grid/img/cold-2.svg", 
                                                         "/static/grid/img/drizzle.svg"] },
            { id: 9, detail: "drizzle", icon: "/static/grid/img/drizzle.svg" },
            { id: 10, detail: "freezing rain", icon:  ["/static/grid/img/cold.svg", 
                                                         "/static/grid/img/rain.svg"] },
            { id: 11, detail: "showers", icon: "/static/grid/img/shower.svg" },
            { id: 12, detail: "showers", icon: "/static/grid/img/shower.svg" },
            { id: 13, detail: "snow flurries", icon: "/static/grid/img/snow 2.svg" },
            { id: 14, detail: "light snow showers", icon:  ["/static/grid/img/light show.svg", 
                                                         "/static/grid/img/shower.svg"] },
            { id: 15, detail: "blowing snow", icon:  ["/static/grid/img/windy.svg", 
                                                         "/static/grid/img/snow.svg"]},
            { id: 16, detail: "snow", icon: "/static/grid/img/snow.svg" },
            { id: 17, detail: "hail", icon: "/static/grid/img/hail.svg" },
            { id: 18, detail: "sleet", icon: "/static/grid/img/hail-2.svg" },
            { id: 19, detail: "dust", icon: "/static/grid/img/dusty.svg" },
            { id: 20, detail: "foggy", icon: "/static/grid/img/fog.svg" },
            { id: 21, detail: "haze", icon: "/static/grid/img/fog 2.svg" },
            { id: 22, detail: "smoky", icon: "/static/grid/img/windy.svg" },
            { id: 23, detail: "blustery", icon: "/static/grid/img/windy-2.svg" },
            { id: 24, detail: "windy", icon: "/static/grid/img/windy.svg" },
            { id: 25, detail: "cold", icon: "/static/grid/img/cold.svg" },
            { id: 26, detail: "cloudy", icon: "/static/grid/img/day-cloud.svg" },

            { id: 27, detail: "mostly cloudy (night)", icon: "/static/grid/img/day-cloud.svg" },
            { id: 28, detail: "mostly cloudy (day)", icon: "/static/grid/img/day-cloud-2.svg" },
            { id: 29, detail: "partly cloudy (night)", icon: "/static/grid/img/day-cloud++.svg" },
            { id: 30, detail: "partly cloudy (day)", icon: "/static/grid/img/day-cloud++.svg" },
            { id: 31, detail: "clear (night)", icon: "/static/grid/img/++.svg" },
            { id: 32, detail: "sunny", icon: "/static/grid/img/++.svg" },
            { id: 33, detail: "fair (night)", icon: "/static/grid/img/++.svg" },
            { id: 34, detail: "fair (day)", icon: "/static/grid/img/++.svg" },
            { id: 35, detail: "mixed rain and hail", icon: "/static/grid/img/++.svg" },
            { id: 36, detail: "hot", icon: "/static/grid/img/++.svg" },
            { id: 37, detail: "isolated thunderstorms", icon: "/static/grid/img/++.svg" },
            { id: 38, detail: "scattered thunderstorms", icon: "/static/grid/img/++.svg" },
            { id: 39, detail: "scattered thunderstorms", icon: "/static/grid/img/++.svg" },
            { id: 40, detail: "scattered showers", icon: "/static/grid/img/++.svg" },
            { id: 41, detail: "heavy snow", icon: "/static/grid/img/++.svg" },
            { id: 42, detail: "scattered snow showers", icon: "/static/grid/img/++.svg" },
            { id: 43, detail: "heavy snow", icon: "/static/grid/img/++.svg" },
            { id: 44, detail: "partly cloudy", icon: "/static/grid/img/++.svg" },
            { id: 45, detail: "thundershowers", icon: "/static/grid/img/++.svg" },
            { id: 46, detail: "snow showers", icon: "/static/grid/img/++.svg" },
            { id: 47, detail: "isolated thundershowers", icon: "/static/grid/img/++.svg" },
            { id: 3200, detail: "not available", icon: "/static/grid/img/++.svg" }
        ]
    },
    visibleHandler: function(){
        console.log("visible");
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
            "condition": feed.item.condition,
            "location": feed.location,
            "wpd": feed.item.pubDate,
            "condCode": feed.item.condition.code
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

        this.hideLoader.call(this, 'getWeather');
    }, 
    closedHandler: function() {

    },
    openHandler: function(){
    
        if(!this.store.has('weather')) {
            this.options.getWeather.apply(this)
        }
    }
}

AddWidgetWidget = {
    name: 'Add'
}

ExampleWidget = {
    /* annotated */

    /* the name of your widget for use with the add button
    and interface alerts */
    name: 'Example',

    /*
    Icon displayed when closed 
    <img>
    */
    closedIcon: 'image.ext',

    /*
    closed text
    */
    closedText: 'closed example widget',
}
