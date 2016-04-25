/**
 * Created by waybe on 16/4/20.
 */
// var express = require('express');
var weather = require('./controllers/weather_controller');
var words = require('./controllers/words_controller');

module.exports = function (app) {
    app.get('/', function(req, res){
        res.render('rich_ui');
    });

    app.get('/weather', weather.getWeather);
    app.get('/words', words.getWords);
}