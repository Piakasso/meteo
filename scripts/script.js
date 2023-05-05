"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector(".widget");
  const popup = document.querySelector(".main-block__popup");
  const buttons = document.querySelector(".popup__buttons");
  const allowButton = document.querySelector("._allow");
  const blockButton = document.querySelector("._block");
  const notice = document.querySelector(".widget__notice");
  const bg = document.querySelector(".main-block__bg");

  //Get my geolacation

  function hidePopup() {
    popup.style.display = "none";
  }
  function showWidget() {
    widget.style.display = "block";
  }

  function hideNotice() {
    notice.style.display = "none";
  }

  let latitude, longitude;

  buttons.addEventListener("click", (e) => {
    if (e.target === allowButton) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log(position);
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;
          getDataFromWeatherAPI(latitude, longitude);
          hidePopup();
        },
        function () {
          showWidget();
          hidePopup();
        }
      );
    } else if (e.target === blockButton) {
      hidePopup();
      showWidget();
    }
  });

  // Get data from weather API

  function getDataFromWeatherAPI() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3a45478219da468839419b1a25dc54c0`
    )
      .then((responce) => responce.json())
      .then(function (data) {
        console.log(data);
        showWidget();
        hideNotice();
        let widgetWeather = document.createElement("div");
        widgetWeather.classList.add("widget__weather");
        widget.appendChild(widgetWeather);
        widgetWeather.innerHTML = ` <div class="weather__position">Weather in ${
          data.name
        }</div>
        <div class="weather__temperature">${Math.round(
          data.main.temp - 273
        )} °C</div>
        <div class="weather__weather"><img src="./img/icons/${
          data.weather[0].main
        }.png" width="30px"
                height="30px">${data.weather[0].main}</div>
        <div class="weather__humidity">Humidity: ${data.main.humidity}</div>
        <div class="weather__wind">Wind Speed: ${data.wind.speed} km/hr</div>`;

        //change BG

        bg.outerHTML = `<img class="main-block__bg" loading="lazy" src="./img/${data.weather[0].main}.jpeg" alt="">`;
      });
  }
});
