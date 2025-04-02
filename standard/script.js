document.addEventListener("DOMContentLoaded", () => {
    document.body.style.backgroundImage = "url('assets/default.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
});

function getWeather() {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Please enter a valid city name.");
        return;
    }

    const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef";  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("weatherResult").innerHTML = `
                <h2>${data.name}</h2>
                <p>${data.weather[0].description}</p>
                <p>${data.main.temp}°C</p>
            `;
            changeBackground(data.weather[0].main);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Unable to fetch weather data. Please check your internet connection or try again later.");
        });
}

function changeBackground(condition) {
    let bg = "assets/default.jpg";

    if (condition === "Clear") bg = "assets/sunny.jpg";
    else if (condition === "Clouds") bg = "assets/cloudy.jpg";
    else if (condition === "Rain") bg = "assets/rainy.jpg";

    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.transition = "background-image 0.5s ease-in-out";
}
