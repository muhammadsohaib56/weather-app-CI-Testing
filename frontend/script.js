const searchButton = document.getElementById("search-button");
const weatherInfo = document.getElementById("weather-info");
const weatherForecast = document.getElementById("weather-forecast");
const dateTimeElement = document.getElementById("date-time");

// Function to update date and time
function updateDateTime() {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  dateTimeElement.textContent = formattedDate;
}

// Initial call to update date and time
updateDateTime();

// Update date and time every second
setInterval(updateDateTime, 1000);

searchButton.addEventListener("click", () => {
  const cityName = document.getElementById("city-name").value;
  if (cityName === "") {
    weatherInfo.innerHTML = "<p class='error'>Please enter a city name.</p>";
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=9920008360e6212a01a59fd9eb579f46`, true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C / ${Math.round((data.main.temp - 273.15) * 9/5 + 32)}°F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind speed: ${data.wind.speed} m/s</p>
        <p>Air pressure: ${data.main.pressure} hPa</p>
        <p>Visibility: ${data.visibility} m</p>
        <p>Chance of precipitation: ${data.clouds.all}%</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
      `;
      // Get the forecast data for the week
      const forecastXhr = new XMLHttpRequest();
      forecastXhr.open("GET", `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=9920008360e6212a01a59fd9eb579f46`, true);
      forecastXhr.onload = () => {
        if (forecastXhr.status === 200) {
          const forecastData = JSON.parse(forecastXhr.responseText);
          const forecastElements = forecastData.list.filter((item, index) => index % 8 === 0).map(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateFormat = { month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', dateFormat);
            const temp = Math.round(forecast.main.temp - 273.15);
            const iconCode = forecast.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            return `
              <div class="forecast-day">
                <p>${dayOfWeek}, ${formattedDate}</p>
                <img class="forecast-icon" src="${iconUrl}" alt="${forecast.weather[0].description}">
                <p class="forecast-temp">${temp}°C</p>
              </div>
            `;
          });
          weatherForecast.innerHTML = forecastElements.join('');
        } else {
          weatherForecast.innerHTML = "<p class='error'>An error occurred while fetching the weather forecast. Please try again.</p>";
        }
      };
      forecastXhr.send();
    } else {
      weatherInfo.innerHTML = "<p class='error'>An error occurred. Please try again.</p>";
    }
  };
  xhr.send();
});
