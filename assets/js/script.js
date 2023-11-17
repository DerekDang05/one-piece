//api key: allows access to openweathermap
const apiKey = "a280f3216e9f9223e3f4bab306acf102";
//grabbing local storage
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function searchWeather() {
    const cityInput = document.getElementById("cityInput").value;

    //doesn't allow for repeats in recent search
    if (!searchHistory.includes(cityInput)) {
        searchHistory.push(cityInput);
    }

    //running all the functions
    recentSearch();
    currentForecast(cityInput);
    weekForecast(cityInput);
    saveToLocalStorage();
}

function currentForecast(city) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(weatherURL)
        .then(response => response.json())
        .then(data => {
            //setting variables up for usage
            const currentWeatherElement = document.getElementById("currentWeather");
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            //adding weather icons and content to current weather forecast
            currentWeatherElement.innerHTML = `<h2 class="mt-4">${city}:</h2>
                <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
                <p>Temperature: ${data.main.temp}&deg;F</p>
                <p>Wind Speed: ${data.wind.speed} mph</p>
                <p>Humidity: ${data.main.humidity}%</p>`;
        })
}

function weekForecast(city) {
    const weatherURL2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(weatherURL2)
        .then(response => response.json())
        .then(data => {
            //prints city that's being searched up
            const forecastElement = document.getElementById("forecast");
            forecastElement.innerHTML = `<h2 class="mt-4">${city}:</h2>`;

            //setting variables up for usage
            for (let i = 0; i < data.list.length; i += 8) {
                const date = new Date(data.list[i].dt * 1000);
                const iconCode = data.list[i].weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

                //adding weather icons, and content to forecast. (temp, wind, humidity)
                forecastElement.innerHTML += `
                    <div class="weather-forecast-item">
                        <p>${date.toDateString()}</p>
                        <img src="${iconUrl}" alt="${data.list[i].weather[0].description}" class="weather-icon">
                        <p>Temperature: ${data.list[i].main.temp}&deg;F</p>
                        <p>Wind Speed: ${data.list[i].wind.speed} mph</p>
                        <p>Humidity: ${data.list[i].main.humidity}%</p>
                    </div>`;
            }
        })
}

//function that outputs recent search onto page in list
function recentSearch() {
    const searchHistoryList = document.getElementById("searchHistory");
    searchHistoryList.innerHTML = "";
    for (const city of searchHistory) {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = city;
        listItem.addEventListener("click", () => {
            document.getElementById("cityInput").value = city;
            searchWeather();
        });
        searchHistoryList.appendChild(listItem);
    }
}

//saves search into local storage
function saveToLocalStorage() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
