import { Controller } from "@hotwired/stimulus";

const apiKey = ""; //provide API key mapbox
const weatherAPI = ""; //provide API key openweather
const today = new Date();
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default class extends Controller {
  static targets = ["address", "city", "date", "condition", "temp", "image"];
  connect() {
    navigator.geolocation.getCurrentPosition((data) => {
      this.getWeather(data.coords.latitude, data.coords.longitude);
    });
  }

  getLocation(event) {
    event.preventDefault();
    const query = this.addressTarget.value;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const longitude = data.features[0].geometry.coordinates[0];
        const latitude = data.features[0].geometry.coordinates[1];
        console.log(longitude, latitude);
        this.getWeather(latitude, longitude);
      });
  }

  getWeather(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.timezone);
        this.cityTarget.innerText = data.name;
        const hour = this.getTime();
        this.dateTarget.innerText = `${days[today.getDay()]}, ${
          months[today.getMonth()]
        } ${today.getDate()}, ${hour}`;
        this.conditionTarget.innerText = data.weather[0].description;
        this.tempTarget.innerText = `${Math.round(data.main.temp)}°C`;
        this.imageTarget.setAttribute(
          "src",
          `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );
      });
  }

  getTime() {
    let time = "";
    const x = today.getHours();
    if (x === 12) {
      time = "12 NN";
    } else if (x === 0) {
      time = "12 MN";
    } else if (x > 12) {
      time = `${x - 12} PM`;
    } else {
      time = `${x} AM`;
    }
    return time;
  }
}
