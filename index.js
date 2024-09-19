

const locationBtn = document.getElementById("location-button")
const weatherLocation = document.getElementById("weather-location")
const inputEl= document.getElementById("input")
const containerEl = document.getElementById("container")
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");



/*html*/
const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

/*html*/
/* toggle icon*/
let menuListEl = document.getElementById("menu-right-list")
                menuListEl.style.maxHeight="0px";
                function toggleMenu(){
                    if (menuListEl.style.maxHeight=="0px")
                    {
                        menuListEl.style.maxHeight="300px";
                    }else{
                        menuListEl.style.maxHeight="0px";
                    }
                }
/* toggle icon */
inputEl.addEventListener("keypress" ,function(event){
    
    if (event.key==="Enter"){
        weatherLocation.innerHTML=inputEl.value
       getCityCoordinates()
}
/*FETCHING coordinates*/
});
setTimeout(()=>{
    locationBtn.addEventListener("click",()=>{
    (navigator.geolocation.getCurrentPosition(showLocation))
    
    })
}, 1000);


/*fetching  city name from coordinates*/
function showLocation(pos){
    const lat = pos.coords.latitude
    const lon =pos.coords.longitude;
    try{
        const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=fr&apiKey=a4141fb647734d4ca4f03eedfd519765`
        
        fetch(apiUrl)
        .then(response=>response.json())
        .then(data=>{
            const areaName=weatherLocation.innerHTML= data.features[0].properties.city
            console.log(areaName)
            /*getWeatherDetails(weatherLocation,Lat,Lon)*/
            fetchWeather(areaName,lat,lon)
        })
    }catch(error){
        console.log(error)
    }
        
}
/*fetching city coordinates*/
const getCityCoordinates = () => {
    const cityName = inputEl.value.trim();
    API_KEY="d7ff7153fa1e08e15e88885e3f8b897e"
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const {
            lat,
            lon,
            name
        } = data[0];
        fetchWeather(name,lat,lon)
        
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}


/*fetching weather */
function fetchWeather(cityName,lat,lon){
    console.log(cityName)
    console.log(lon)
API_KEY="d7ff7153fa1e08e15e88885e3f8b897e"
const  URL =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
fetch(URL).then(response=>response.json())
.then(data=>{
    const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        inputEl.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    }).catch((error) => {
        console.log(error)
        alert("An error occurred while fetching the weather forecast!");
    });
    }  



