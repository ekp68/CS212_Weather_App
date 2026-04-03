$(document).ready(function () {

    // Default background
    $("#app-body").addClass("default-bg");

    //API KEY

    const apiKey = "b03e12d39d3f4a9ebf3202858260204";

    //FORM SUBMISSION

    $("form").on("submit", function (event) {
        event.preventDefault();
        
        let location = $("#locationInput").val();
        $("#locationInput").val("");

        if (location === "") {
            alert("Please enter a city.");
            return;
        }

        // API integration
        fetchWeather(location)
        console.log("Search for:", location);
        
    });

 
// Fetch weather data from WeatherAPI
  function fetchWeather(location) {
    const url =
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
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
  
    $("#feels-like").text(`${Math.round(data.current.feelslike_f)}`);

    // Sky condition
    $("#sky").text(data.current.condition.text);

    // Humidity & Wind
    $("#humidity").text(data.current.humidity);
    $("#wind").text(data.current.wind_mph);

    // Visibility
    $("#visibility").text(`${data.current.vis_miles}`);

    // Precipitation
    $("#precipitation").text(`${data.current.precip_in}`);

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



        changeBackground(data.description);
    }

    function changeBackground(weather) {
        let body = $("#app-body");

        body.removeClass("default-bg sunny cloudy rainy");

        if (weather.toLowerCase().includes("sun")) {
            body.addClass("sunny");
        } else if (weather.toLowerCase().includes("cloud")) {
            body.addClass("cloudy");
        } else if (weather.toLowerCase().includes("rain")) {
            body.addClass("rainy");
        } else {
            body.addClass("default-bg");
        }
    }

});