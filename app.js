// API Key
const apiKey = "b03e12d39d3f4a9ebf3202858260204";

$(document).ready(function () {

    // Load previous weather data if available
    const previousData = loadWeatherData();
    if (previousData) {
        fetchWeather(previousData);
        createAlert("Loaded previous weather data");
    }

    // Default Background
    $("#app-body").addClass("default-bg");

    // Get Location Button    
    $("#getLocationBtn").on("click", function() {
        getLocation();
    });

    // Form Submission
    $("form").on("submit", function (event) {
        event.preventDefault();
        
        let location = $("#locationInput").val();
        $("#locationInput").val("");

        if (location === "") {
            alert("Please enter a city or zip code.");
            return;
        }

        // API Integration
        fetchWeather(location)
        console.log("Searching for:", location);
    });
});

// Fetch weather data from WeatherAPI
function fetchWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
            saveWeatherData(data);
        })
        .catch(error => {
            console.error("Weather API error:", error);
            alert("Unable to retrieve weather data.");
        });
}

// Update all UI elements
function updateUI(data) {

    // City
    $("#cityName").text(`${data.location.name}, ${data.location.region}`);

    // Temperatures
    $("#temperature").text(Math.round(data.current.temp_f));
    $("#feels-like").text(Math.round(data.current.feelslike_f));

    // Sky condition
    $("#sky").text(data.current.condition.text);

    // Weather Icons and Background
    setIconAndBackground(data.current);

    // Humidity & Wind
    $("#humidity").text(data.current.humidity);
    $("#wind").text(data.current.wind_mph);

    // Visibility
    $("#visibility").text(data.current.vis_miles);

    // Precipitation
    $("#precipitation").text(data.current.precip_in);

    // UV Index + Risk
    const uvValue = data.current.uv;
    let uvRisk = "";

    if (uvValue <= 2) uvRisk = "Low";
    else if (uvValue <= 5) uvRisk = "Moderate";
    else if (uvValue <= 7) uvRisk = "High";
    else if (uvValue <= 10) uvRisk = "Very High";
    else uvRisk = "Extreme";

    $("#uv").text(`${uvValue} (${uvRisk})`);

    // Air Quality
    const aqi = data.current.air_quality["us-epa-index"];
    const aqiLabels = {
        1: "Good",
        2: "Moderate",
        3: "Unhealthy (Sensitive Groups)",
        4: "Unhealthy",
        5: "Very Unhealthy",
        6: "Hazardous"
    };

    $("#air-quality").text(`${aqi} – ${aqiLabels[aqi]}`);
}

// Weather map data structure to replace if else statements
const weatherMap = [
    {key:"sun",         class:"sunny"},
    {key:"cloud",       class:"cloudy"},
    {key:"overcast",    class:"overcast"},
    {key:"fog",         class:"fog"},
    {key:"mist",        class:"mist"},
    {key:"thunder",     class:"thunderstorm"},
    {key:"rain",        class:"rain"},
    {key:"sleet",       class:"sleet"},
    {key:"snow",        class:"snow"},
    {key:"blizzard",    class:"blizzard"}
];

function setIconAndBackground(weather) {
    const body = $("#app-body");
    body.removeClass();

    const condition = weather.condition.text.toLowerCase();

    // Finds first object in weatherMap where its key is included in condition
    const match = weatherMap.find(obj =>
        condition.includes(obj.key)
    );

    // Use the class name to determine base, defaults to sunny if no match found
    let base = match ? match.class : "sunny";

    // Check for nighttime and adjust base if necessary
    const isNight = weather.is_day === 0;
    if (isNight) {
        if (base === "sunny") {
            base = "clear-night";
        } 
        else if (base === "cloudy") {
            base = "cloudy-night";
        }
    }

    // Apply background    
    body.addClass(base);

    // Set icon
    const iconFile = `${base}.png`;
    $("#weatherIcon").attr("src", "images/" + iconFile);
}

function saveWeatherData(data) {
    const coords = `${data.location.lat}, ${data.location.lon}`;
    localStorage.setItem("Location", JSON.stringify(coords));
}

function loadWeatherData() {
    const dataString = localStorage.getItem("Location");
    if (!dataString) return null;
    const data = JSON.parse(dataString);

    return data;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(`${lat},${lon}`);
        }, function(error) {
            console.error("Geolocation error:", error);
            alert("Unable to retrieve your location. Please allow location access or enter a city/zip code manually.");
        });
    }
}

function createAlert(message) {
    const alertDiv = $(`
        <div class="alert alert-primary alert-slide-down" role="alert">
            ${message}
        </div>
    `);

    $("#alertContainer").append(alertDiv);

    setTimeout(() => {
        alertDiv.removeClass("alert-slide-down").addClass("alert-slide-up");
    }, 2000);

    setTimeout(() => {
        alertDiv.remove();
    }, 2300);
}