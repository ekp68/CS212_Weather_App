// API Key
const apiKey = "b03e12d39d3f4a9ebf3202858260204";

// Global variable to track day/night status
let isNight = false;

$(document).ready(function () {

    // Default Background
    $("#app-body").addClass("default-bg");

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
        console.log("Search for:", location);
    });
});


// Fetch weather data from WeatherAPI
function fetchWeather(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            isNight = (data.current.is_day === 0);
            updateUI(data);
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
    setIconAndBackground(data.current.condition.text);

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
    let body = $("#app-body");
    body.removeClass();

    const condition = weather.toLowerCase();

    // Finds first object in weatherMap where its key is included in condition
    const match = weatherMap.find(obj =>
        condition.includes(obj.key)
    );

    // Use the class name to determine base, defaults to sunny if no match found
    let base = match ? match.class : "sunny";

    // Check for nighttime and adjust base if necessary
    if (isNight) {
        if (base === "sunny") {
            // Future: Update base when night icons are added
            // base = "clear-night";
            console.log("Nighttime detected, but no clear night icon available. Using sunny icon as fallback.");
        } else if (base === "cloudy") {
            // Future: Update base when night icons are added
            // base = "cloudy-night";
            console.log("Nighttime detected, but no cloudy night icon available. Using cloudy icon as fallback.");
        }
    }

    // Apply background    
    body.addClass(base);

    // Set icon
    const iconFile = `${base}.png`;
    $("#weatherIcon").attr("src", "images/" + iconFile);
}