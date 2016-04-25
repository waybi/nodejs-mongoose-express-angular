var http = require('http');

// 03f3533bc68d8d2124a7c44ac2b143fa openweathermap key
function toFahrenheit(temp) {
    return Math.round((temp-273.15)*9/5+32);
}

function parseWeather(req, res, weatherResponse) {
    var weatherData = '';
    weatherResponse.on('data', function (chunk) {
        weatherData += chunk;
    });

    weatherResponse.on('end', function () {
        var wObj = JSON.parse(weatherData);
        // console.log(wObj);
        if (wObj.name){
            var wData = {
                name: wObj.name,
                humidity: wObj.main.humidity,
                temp: toFahrenheit(wObj.main.temp),
                tempMin: toFahrenheit(wObj.main.temp_min),
                tempMax: toFahrenheit(wObj.main.temp_max),
                wind: Math.round(wObj.wind.speed*2.23694), //mph
                description: wObj.weather[0].main,
                clouds: wObj.clouds.all,
                icon: wObj.weather[0].icon
            }
        }else{
            var wData = {name: "Not Found"};
        }

        res.json(wData);
    })
}

exports.getWeather = function (req, res) {
    var city = req.query.city,
        key = '03f3533bc68d8d2124a7c44ac2b143fa';
    var options = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/weather?q=' + city + '?id=524901&APPID=' + key
    };
    http.request(options, function (weatherResponse) {
        parseWeather(req, res, weatherResponse);
    }).end();
}