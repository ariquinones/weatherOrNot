console.log("hello")
var apiKey = '2af24699275f34e8a9b7f95cf5b6de4c'
var baseUrl = 'https://api.forecast.io/forecast/' + apiKey
var chromeSecurityCode = '?callback=?'
var houston = '/29.7604,-95.3698'
var houstonFullUrl = $.getJSON(baseUrl+houston+chromeSecurityCode)
var forecastDiv = document.querySelector(".forecastWeather")
var city = document.querySelector(".city")




var successCallBack = function(positionObject) { 
	var latitude = positionObject.coords.latitude
		longitude = positionObject.coords.longitude
	console.log(positionObject)
	var fullUrl = baseUrl + "/" + latitude + "," + longitude 
	$.getJSON(fullUrl).then(showData)
	//$.getJSON(fullUrl).then(function(resp) {
		// console.log(resp.currently.temperature) 
		// var cityDiv = document.querySelector(".cityWeather")
		// cityDiv.innerHTML = resp.currently.temperature
	//})
} 
var errorCallBack = function (error) {
	console.log(error)
	city.innerHTML = "<p>Current Location<p>"
}


var weekObject = {
		0: "Sunday",
		1: "Monday",
		2: "Tuesday", 
		3: "Wednesday", 
		4: "Thursday",
		5: "Friday", 
		6: "Saturday"
}
function getQuery(keyEvent) {
	var query = keyEvent.srcElement
	if (keyEvent.keyCode === 13) {
		var userCity = query.value 
		location.hash = userCity
		query.value = ''
	}
}

var findCityInput = document.querySelector(".findCity")
findCityInput.addEventListener('keydown',getQuery)

var controller = function () {
		var newQuery = location.hash.substring(1)
		city.innerHTML = '<p>' + newQuery + '</p>'
		var geoLocationApiKey = 'AIzaSyDoPQ0h-D869qcL-uF6rJBG21cgTfKVy8k'
		var geoLocator = 'https://maps.googleapis.com/maps/api/geocode/json?address='
		var getLocation = $.getJSON(geoLocator + newQuery)
		function showLocation (jsonData) {
			var location = (jsonData.results[0].geometry.location)
			var queryLat = location.lat 
			var queryLng = location.lng 
			console.log("Longitude: " + queryLng)
			console.log("Lat: " + queryLat)
			var fullUrl = $.getJSON(baseUrl+'/'+queryLat+','+queryLng+chromeSecurityCode)
			fullUrl.then(showData)
		}
		getLocation.then(showLocation)
}


window.addEventListener("hashchange",controller)

if (location.hash === "") {
	//location.hash = "Houston, Tx"
	navigator.geolocation.getCurrentPosition(successCallBack,errorCallBack)
}
else {
	controller() 
}



// Buttons to show temperatures 

var weeklyButton = document.querySelector(".weeklyButton")
var hourlyButton = document.querySelector(".hourlyButton")
var currentTempButton = document.querySelector('.currentTempButton')

var showData = function(jsonData) {
	var day = new Date()
	var today = day.getDay()
	var cityDiv = document.querySelector(".cityWeather")
	var forecastDiv = document.querySelector(".forecastWeather")
	cityDiv.innerHTML = ''
	forecastDiv.innerHTML = ''

	cityDiv.innerHTML = '<div class="currentTemperature"><h1>' + parseInt(jsonData.currently.temperature) + '&deg;F</h1>\
						<img class="mainIcon" src="images/' + jsonData.currently.icon + '.svg"></div>\
						<div class="daySummary"><p class="weekday">' + weekObject[today] + '</p>' +
						//'<div class="iconDiv">\
						'<p>' + jsonData.currently.summary + '</p></div>'
	
	function currentForecast () {
		forecastDiv.innerHTML = ''
		forecastDiv.innerHTML += '<div class="currentForecast">' +
								'<p>Feels like: ' + parseInt(jsonData.currently.apparentTemperature) + '&deg;F</p>' +
								'<p>Wind: ' + jsonData.currently.windSpeed + ' mph</p>' +
								'<p>Humidity: ' + parseInt((jsonData.currently.humidity)*100) + ' %</p>' +
								'<p>Precipitation: ' + parseInt((jsonData.currently.precipProbability)*100) + '%</p>' +
								'<p>Dew Point: ' + parseInt(jsonData.currently.dewPoint) + '&deg;F</p>' +
								'<p>Pressure: ' + jsonData.currently.pressure + ' in.</p>' +
								'<p>Visibility: ' + jsonData.currently.visibility + ' mi.</p>' +
								'</div>'
	}
	currentTempButton.addEventListener('click',currentForecast)

	var showWeeklyData = function () {
		var weeklyWeather = jsonData.daily.data 
		forecastDiv.innerHTML = ''
		for (var i = 1; i < weeklyWeather.length; i++) {
				//console.log(dailyHoustonWeather[i].temperatureMax)
			if (today < 7) {
				today += 1 
				forecastDiv.innerHTML += '<div class="dayTemp">' +
									  '<h3>' + weekObject[today].substring(0,3) + '</h3>' + 
									  '<img class="icon" src="images/' + weeklyWeather[i].icon + '.svg">' +
									  '<p>' + parseInt(weeklyWeather[i].temperatureMax) + 
										'&deg;F</p></div>'
			} else { today = 0}
		}
	}
	weeklyButton.addEventListener('click',showWeeklyData)

	var showHourlyData = function() {
		
		var hourlyWeather = jsonData.hourly.data 
		forecastDiv.innerHTML = ''
		function getHourTime (input) {
			var hour = new Date(input * 1000)
			return hour.getHours() + ":" + hour.getMinutes() + hour.getMinutes() 
		}
		for (var i = 0; i < 6; i++) {
				forecastDiv.innerHTML += '<div class="hourlyTemp">' +
										'<p>' + getHourTime(hourlyWeather[i].time)+'</p>' +
										'<img class="icon" src="images/' + jsonData.hourly.icon + '.svg">' +
									 	'<p>' + parseInt(hourlyWeather[i].temperature) +
										'&deg;F /'+ parseInt(hourlyWeather[i].windSpeed) + ' mph</p>' +
										'<p>Precip: '+ parseInt((hourlyWeather[i].precipProbability)*100)+ '%</p>\
										<p>Humidity: ' + parseInt((hourlyWeather[i].humidity)*100) +'%</p></div>'
		}
		forecastDiv.innerHTML += '<img class="nextHourButton" src="images/arrow-right.svg">'
		var nextButton1 = document.querySelector(".nextHourButton")
		nextButton1.addEventListener("click", nextSix)
		function nextSix () {
			forecastDiv.innerHTML = '<img class="previousHourButton" src="images/arrow-left.svg">'
			for (var i = 6; i < 12; i++) {
				forecastDiv.innerHTML += '<div class="hourlyTemp">' +
										'<p>' + getHourTime(hourlyWeather[i].time)+'</p>' +
										'<img class="icon" src="images/' + jsonData.hourly.icon + '.svg">' +
									 	'<p>' + parseInt(hourlyWeather[i].temperature) +
										'&deg;F /'+ parseInt(hourlyWeather[i].windSpeed) + ' mph</p>' +
										'<p>Precip: '+ parseInt((hourlyWeather[i].precipProbability)*100)+ '%</p>\
										<p>Humidity: ' + parseInt((hourlyWeather[i].humidity)*100) +'%</p></div>'
			}
			forecastDiv.innerHTML += '<img class="nextHourButton" src="images/arrow-right.svg">'
			var nextButton2 = document.querySelector(".nextHourButton")
			nextButton2.addEventListener("click", secondSix) 
			var goBackButton1 = document.querySelector(".previousHourButton")
			goBackButton1.addEventListener("click", showHourlyData)
		}
		function secondSix () {
			forecastDiv.innerHTML = '<img class="previousHourButton" src="images/arrow-left.svg">'
			for (var i = 12; i < 18; i++) {
				forecastDiv.innerHTML += '<div class="hourlyTemp">' +
										'<p>' + getHourTime(hourlyWeather[i].time)+'</p>' +
										'<img class="icon" src="images/' + jsonData.hourly.icon + '.svg">' +
									 	'<p>' + parseInt(hourlyWeather[i].temperature) +
										'&deg;F /'+ parseInt(hourlyWeather[i].windSpeed) + ' mph</p>' +
										'<p>Precip: '+ parseInt((hourlyWeather[i].precipProbability)*100)+ '%</p>\
										<p>Humidity: ' + parseInt((hourlyWeather[i].humidity)*100) +'%</p></div>'
			}
			forecastDiv.innerHTML += '<img class="nextHourButton" src="images/arrow-right.svg">'
			var nextButton3 = document.querySelector(".nextHourButton")
			nextButton3.addEventListener("click", lastSix) 
			var goBackButton2 = document.querySelector(".previousHourButton")
			goBackButton2.addEventListener("click", nextSix)
		}
		function lastSix () {
			forecastDiv.innerHTML = '<img class="previousHourButton" src="images/arrow-left.svg">'
			for (var i = 18; i < 24; i++) {
				forecastDiv.innerHTML += '<div class="hourlyTemp">' +
										'<p>' + getHourTime(hourlyWeather[i].time)+'</p>' +
										'<img class="icon" src="images/' + jsonData.hourly.icon + '.svg">' +
									 	'<p>' + parseInt(hourlyWeather[i].temperature) +
										'&deg;F /'+ parseInt(hourlyWeather[i].windSpeed) + ' mph</p>' +
										'<p>Precip: '+ parseInt((hourlyWeather[i].precipProbability)*100)+ '%</p>\
										<p>Humidity: ' + parseInt((hourlyWeather[i].humidity)*100) +'%</p></div>'
			}
			var goBackButton3 = document.querySelector(".previousHourButton")
			goBackButton3.addEventListener("click", secondSix)
		}
	}

	hourlyButton.addEventListener('click',showHourlyData)
}






var clock = document.querySelector(".currentTime")
var time = function() {
	today = new Date ()
	todayTime = today.toLocaleTimeString()
	clock.innerHTML = todayTime.substring(0,8)
}
setInterval(time,1000)





