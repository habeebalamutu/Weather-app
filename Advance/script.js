document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundImage = "url('assets/default.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.transition = "background-image 0.5s ease-in-out";
    document.getElementById("unitSwitch").addEventListener("click", toggleUnit);
    document.getElementById("useLocationButton").addEventListener("click", getLocationWeather);
});

let isFahrenheit = false; 

function toggleUnit() {
    isFahrenheit = !isFahrenheit;
    const unitSwitch = document.getElementById("unitSwitch");
    unitSwitch.textContent = isFahrenheit ? "Switch to Celsius" : "Switch to Fahrenheit";
    getWeather();
}

function showLoading() {
    document.getElementById("weatherResult").innerHTML = "<p>Loading...</p>";
    document.getElementById("forecastResult").innerHTML = "";
}

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    showLoading();
    const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";
    const unit = isFahrenheit ? "imperial" : "metric";
    const unitSymbol = isFahrenheit ? "°F" : "°C";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            document.getElementById("weatherResult").innerHTML = `
                <div class="weather-card">
                    <h2>${data.name}</h2>
                    <p>${data.weather[0].description}</p>
                    <p>${data.main.temp}${unitSymbol}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} ${unit === "imperial" ? "mph" : "m/s"}</p>
                </div>
            `;
            changeBackground(data.weather[0].main);
            getForecast(city, unit);
        })
        .catch(error => {
            document.getElementById("weatherResult").innerHTML = `<p>Error: ${error.message}</p>`;
        });
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
        .then(response => {
            if (!response.ok) throw new Error("Error fetching forecast data");
            return response.json();
        })
        .then(data => {
            let forecastHTML = "<h3>5-Day Forecast:</h3><br>";
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    forecastHTML += `
                        <div class="forecast-item">
                            <p><strong>Date:</strong> ${new Date(item.dt_txt).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> ${new Date(item.dt_txt).toLocaleTimeString()}</p>
                            <p><strong>Weather:</strong> ${item.weather[0].description}</p>
                            <p><strong>Temperature:</strong> ${item.main.temp}${unit === "imperial" ? "°F" : "°C"}</p>
                            <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
                            <p><strong>Wind Speed:</strong> ${item.wind.speed} ${unit === "imperial" ? "mph" : "m/s"}</p>
                        </div>
                        <br>
                    `;
                }
            });
            document.getElementById("forecastResult").innerHTML = forecastHTML;
        })
        .catch(error => {
            document.getElementById("forecastResult").innerHTML = `<p>Error: ${error.message}</p>`;
        });
}

function getLocationWeather() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";
            const unit = isFahrenheit ? "imperial" : "metric";
            const unitSymbol = isFahrenheit ? "°F" : "°C";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error("Error fetching location weather data");
                    return response.json();
                })
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
                .catch(error => {
                    document.getElementById("weatherResult").innerHTML = `<p>Error: ${error.message}</p>`;
                });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getForecastByCoords(lat, lon, unit) {
    const apiKey = "56770887d4b251698a027f5528c18d37";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Error fetching forecast data");
            return response.json();
        })
        .then(data => {
            let forecastHTML = "<h3>5-Day Forecast:</h3><br>";
            data.list.forEach((item, index) => {
                if (index % 8 === 0) {
                    forecastHTML += `
                        <div class="forecast-item">
                            <p><strong>Date:</strong> ${new Date(item.dt_txt).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> ${new Date(item.dt_txt).toLocaleTimeString()}</p>
                            <p><strong>Weather:</strong> ${item.weather[0].description}</p>
                            <p><strong>Temperature:</strong> ${item.main.temp}${unit === "imperial" ? "°F" : "°C"}</p>
                            <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
                            <p><strong>Wind Speed:</strong> ${item.wind.speed} ${unit === "imperial" ? "mph" : "m/s"}</p>
                        </div>
                        <br>
                    `;
                }
            });
            document.getElementById("forecastResult").innerHTML = forecastHTML;
        })
        .catch(error => {
            document.getElementById("forecastResult").innerHTML = `<p>Error: ${error.message}</p>`;
        });
}