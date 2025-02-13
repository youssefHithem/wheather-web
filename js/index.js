// =======================================

navigator.geolocation.getCurrentPosition(
  function (position) {
    let details = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    geoLocation(details.lat, details.lng);
  },
  function () {
    getData("cairo");
  }
);

async function geoLocation(lat, lng) {
  let api = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  let finalData = await api.json();
  console.log(finalData);
  getData(finalData.address.state);
}
// =======================================
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");

async function getData(city) {
  let x = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=fe6c8a4c07804309bb2144126240312&q=${city}&days=7`
  );
  let finalData = await x.json();
  console.log(finalData);
  let forecast = finalData.forecast;
  let currentWeather = finalData.current;
  let loction = finalData.location;
  let hoursOfDay = finalData.forecast.forecastday[0].hour;
  currentDay(loction, currentWeather, forecast);
  timeOfday(hoursOfDay);
  airConditions(currentWeather, forecast);
  daysForecast(forecast);
}

searchBtn.addEventListener("click", function () {
  if (searchBar != "") {
    getData(searchBar.value);
    searchBar.value = "";
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key == "Enter" && searchBar.value != "") {
    getData(searchBar.value);
    searchBar.value = "";
  }
});

/* =========================== */
const cityName = document.getElementById("cityName");
const currentRain = document.getElementById("currentRain");
const currentTemp = document.querySelector(".currentTemp");
const currentWeatherStatue = document.querySelector(".currentWeatherStatus");

function currentDay(location, curr, forecast) {
  currentTemp.innerHTML = `${curr.temp_c}°C`;
  currentWeatherStatue.src = curr.condition.icon;
  cityName.innerHTML = location.name;
  currentRain.innerHTML = `${forecast.forecastday[0].day.daily_chance_of_rain}%`;
}
/* =========================== */
const timesOfDay = document.querySelectorAll(".hour span.time");
const weatherStatue = document.querySelectorAll(".today-icon");
const forecastOfDay = document.querySelectorAll(".hour span.today-temp");

function timeOfday(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i += 3) {
    if (i >= 6 && i <= 21) {
      newArr.push(arr[i]);
    }
  }
  addTime(newArr);
  addIcon(newArr);
  addTemprature(newArr);
  console.log(newArr);
}

function addTime(arr) {
  timesOfDay.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (i == index) {
        timesOfDay[index].innerHTML = arr[i].time
          .split(" ")
          .reverse()
          .slice(0, 1)
          .join();
      }
    }
  });
}

function addIcon(arr) {
  weatherStatue.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (i == index) {
        weatherStatue[index].src = arr[i].condition.icon;
      }
    }
  });
}

function addTemprature(arr) {
  forecastOfDay.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (i == index) {
        forecastOfDay[index].innerHTML = `${arr[i].temp_c}°C`;
      }
    }
  });
}
/* =========================== */

const tempFeel = document.querySelector(".temp");
const wind = document.querySelector(".wind");
const chanceOfRain = document.querySelector(".rain");
const uvIndex = document.querySelector(".uv");

function airConditions(curr, forecast) {
  tempFeel.innerHTML = `${curr.feelslike_c} °C`;
  uvIndex.innerHTML = curr.uv;
  wind.innerHTML = `${curr.wind_kph} Kp/h`;
  chanceOfRain.innerHTML = `${forecast.forecastday[0].day.daily_chance_of_rain}%`;
}

/* =========================== */

const dateOfDay = document.querySelectorAll(".date");
const statusOfDay = document.querySelectorAll(".status");
const forecastWeatherStatus = document.querySelectorAll(".icon-day");
const forecastMaxTemp = document.querySelectorAll(".day .maxTemp");
const forecastMinTemp = document.querySelectorAll(".day .minTemp");

const forecastMediaDay = document.querySelectorAll(".day-media .date-media");
const weatherStatueMedia = document.querySelectorAll(".days-icon");
const forecastMediaMaxTemp = document.querySelectorAll(".day-media .maxTemp");
const forecastMediaMinTemp = document.querySelectorAll(".day-media .minTemp");

function daysForecast(forecast) {
  let forecastDays = forecast.forecastday;
  getDate(forecastDays, dateOfDay);
  getDate(forecastDays, forecastMediaDay);
  getIcon(forecastDays, forecastWeatherStatus);
  getIcon(forecastDays, weatherStatueMedia);
  getMaxTemp(forecastDays, forecastMediaMaxTemp);
  getMinTemp(forecastDays, forecastMediaMinTemp);
  getMaxTemp(forecastDays, forecastMaxTemp);
  getMinTemp(forecastDays, forecastMinTemp);
  statue(forecastDays);
}

function getDate(arr, x) {
  x.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (index == i) {
        let day = getDay(arr[i].date);
        // let day = 5;
        x[index].innerHTML = day;
      }
    }
  });
}

function getIcon(arr, x) {
  x.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (index == i) {
        x[index].src = arr[i].day.condition.icon;
      }
    }
  });
}

function getMaxTemp(arr, x) {
  x.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (index == i) {
        x[index].innerHTML = arr[i].day.maxtemp_c;
      }
    }
  });
}

function getMinTemp(arr, x) {
  x.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (index == i) {
        x[index].innerHTML = arr[i].day.mintemp_c;
      }
    }
  });
}

function statue(arr) {
  statusOfDay.forEach(function (e, index) {
    for (let i = 0; i < arr.length; i++) {
      if (index == i) {
        statusOfDay[index].innerHTML = arr[i].day.condition.text;
      }
    }
  });
}

function getDay(date) {
  let x = new Date(`${date}`).toString();
  return (day = x.split(" ", 1).join(""));
}
