function getWeather() {
    const city = document.getElementById("cityInput").value;
    const apiKey = "883d7cd4a0a2c85dcf1cfe188825f7ef"; // Replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {
                document.getElementById("weatherResult").innerHTML = "City not found!";
            } else {
                const temp = data.main.temp;
                const desc = data.weather[0].description;
                document.getElementById("weatherResult").innerHTML = `
                    <h2>${data.name}</h2>
                    <p>Temperature: ${temp}°C</p>
                    <p>Condition: ${desc}</p>
                `;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}
