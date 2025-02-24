document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundImage = "url('assets/default.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.getElementById("unitSwitch").addEventListener("change", getWeather);
    getLocationWeather();
});

function getWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";  
    const unit = document.getElementById("unitSwitch").checked ? "imperial" : "metric";
    const unitSymbol = unit === "imperial" ? "°F" : "°C";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("weatherResult").innerHTML = `
                <h2>${data.name}</h2>
                <p>${data.weather[0].description}</p>
                <p>${data.main.temp}${unitSymbol}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} ${unit === "imperial" ? "mph" : "m/s"}</p>
            `;

            changeBackground(data.weather[0].main);
            getForecast(city, unit);
        })
        .catch(() => alert("City not found"));
}

function changeBackground(condition) {
    let bg = "assets/default.jpg";

    if (condition === "Clear") bg = "assets/sunny.jpg";
    else if (condition === "Clouds") bg = "assets/cloudy.jpg";
    else if (condition === "Rain") bg = "assets/rainy.jpg";
    else if (condition === "Snow") bg = "assets/snowy.jpg";
    else if (condition === "Thunderstorm") bg = "assets/storm.jpg";
    else if (condition === "Mist" || condition === "Fog") bg = "assets/foggy.jpg";

    document.body.style.backgroundImage = `url('${bg}')`;
}

function getForecast(city, unit) {
    const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = "<h3>5-Day Forecast:</h3>";
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    forecastHTML += `
                        <div class="forecast-item">
                            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                            <p>${item.weather[0].description}</p>
                            <p>${item.main.temp}${unit === "imperial" ? "°F" : "°C"}</p>
                        </div>
                    `;
                }
            });
            document.getElementById("forecastResult").innerHTML = forecastHTML;
        })
        .catch(error => console.error("Error fetching forecast data:", error));
}

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";
            const unit = document.getElementById("unitSwitch").checked ? "imperial" : "metric";
            const unitSymbol = unit === "imperial" ? "°F" : "°C";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("weatherResult").innerHTML = `
                        <h2>${data.name}</h2>
                        <p>${data.weather[0].description}</p>
                        <p>${data.main.temp}${unitSymbol}</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Wind Speed: ${data.wind.speed} ${unit === "imperial" ? "mph" : "m/s"}</p>
                    `;

                    changeBackground(data.weather[0].main);
                    getForecastByCoords(lat, lon, unit);
                })
                .catch(error => console.error("Error fetching location weather data:", error));
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getForecastByCoords(lat, lon, unit) {
    const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = "<h3>5-Day Forecast:</h3>";
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    forecastHTML += `
                        <div class="forecast-item">
                            <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                            <p>${item.weather[0].description}</p>
                            <p>${item.main.temp}${unit === "imperial" ? "°F" : "°C"}</p>
                        </div>
                    `;
                }
            });
            document.getElementById("forecastResult").innerHTML = forecastHTML;
        })
        .catch(error => console.error("Error fetching forecast data:", error));
}
