"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const widget = document.querySelector(".widget");
  const popup = document.querySelector(".main-block__popup");
  const buttons = document.querySelector(".popup__buttons");
  const allowButton = document.querySelector("._allow");
  const blockButton = document.querySelector("._block");
  const notice = document.querySelector(".widget__notice");
  const search = document.querySelector(".widget__button");
  const input = document.querySelector(".widget__string");
  const bg = document.querySelector(".main-block");

  let widgetWeather = document.createElement("div");

  function changeBG(data) {
    bg.style.backgroundImage = `url("img/${data.weather[0].main}.jpg")`;
  }

  function showPopup() {
    popup.style.display = "block";
  }

  function hidePopup() {
    popup.style.display = "none";
  }
  function showWidget() {
    widget.style.display = "block";
  }

  function hideNotice() {
    notice.style.display = "none";
  }

  function clearWidgetWeather() {
    widgetWeather.innerHTML = "";
  }

  let latitude, longitude;

  //Get my geolacation

  buttons.addEventListener("click", (e) => {
    if (e.target === allowButton) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3a45478219da468839419b1a25dc54c0`
          )
            .then((response) => response.json())
            .then((data) => {
              buildingCard(data);
              changeBG(data);
              showWidget();
              hideNotice();
            });
          hidePopup();
        },
        function (dismiss) {
          console.log(dismiss);
          showWidget();
          hidePopup();
        }
      );
    } else if (e.target === blockButton) {
      hidePopup();
      showWidget();
    }
  });

  // Build cards

  function buildingCard(data) {
    widgetWeather.classList.add("widget__weather");
    widget.appendChild(widgetWeather);
    widgetWeather.innerHTML = ` <p class="weather__position">Weather in ${
      data.name
    }</p>
        <p class="weather__temperature">${Math.round(
          data.main.temp - 273
        )} °C</p>
        <div class="weather__weather"><img src="./img/icons/${
          data.weather[0].main
        }.png" width="30px" height="30px">${data.weather[0].main}</div>
        <p class="weather__humidity">Humidity: ${data.main.humidity} %</p>
        <p class="weather__wind">Wind Speed: ${data.wind.speed} km/hr</p>`;
  }

  // Get data from search

  search.addEventListener("click", (e) => {
    e.preventDefault();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=3a45478219da468839419b1a25dc54c0`
    )
      .then((response) => {
        if (response.ok === true) {
          response.json().then((data) => {
            clearWidgetWeather();
            hideNotice();
            buildingCard(data);
            changeBG(data);
          });
        } else {
          notice.style.display = "block";
          notice.innerHTML = "Wrong name of the city.Please try again";
          clearWidgetWeather();
          throw new Error(response.statusText);
        }
      })
      .catch((e) => {})
      .finally(() => {
        input.value = "";
      });
  });
});
