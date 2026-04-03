$(document).ready(function () {

    // Default background
    $("#app-body").addClass("default-bg");

    $("form").on("submit", function (event) {
        event.preventDefault();
        
        let location = $("#locationInput").val();
        $("#locationInput").val("");

        if (location === "") {
            alert("Please enter a city.");
            return;
        }

        // API integration
        console.log("Search for:", location);
        
    });

    function updateUI(data) {
        $("#cityName").text(data.city);
        $("#temperature").text(data.temp + " °F");
        $("#description").text(data.description);
        $("#humidity").text(data.humidity);
        $("#wind").text(data.wind);
        $("#weatherIcon").attr("src", data.icon);

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