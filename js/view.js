import {data, makeResponseForecast} from "./main.js";
import { renderNowTab } from "./renderUI.js";
export {UI, loadForecast, renderForecast}
const UI = {
    INPUT: document.querySelector("#input-city"),
    SEARCH_BUTTON: document.querySelector(".search-button"),
    FORM: document.getElementById("form"), 

    btnDisplay: document.querySelector(".button-display"),
    nowButton: document.querySelector(".now-btn"),
    detailsButton: document.querySelector(".details-btn"),
    forecastButton: document.querySelector(".forecast-btn"),

    display: document.querySelector(".content"),
}


UI.detailsButton.addEventListener("click", renderTab(UI.detailsButton, renderDetails));
UI.nowButton.addEventListener("click", renderTab(UI.nowButton, renderNowTab));
UI.forecastButton.addEventListener("click", renderTab(UI.forecastButton, loadForecast));

function renderTab(button, renderFunc) {
    return function() {
        updateActiveClass()
        if (button !== UI.forecastButton) {
            data.response.then(renderFunc)
        } else {
            renderFunc();
        }
    }

    function updateActiveClass() {
        for (let elem of button.parentElement.children) {
            if (elem.classList.contains("active")) {
                elem.classList.remove("active")
            }
        }
        button.classList.add("active");
    }

}

function renderDetails(data) {
    console.log(getCookie("city"));
    UI.display.innerHTML = ` <p>${data.name}</p>
    <div class="details-display">
        <p>Temperature: ${data.main.temp}</p>
        <p>Feels like: ${data.main.feels_like}</p>
        <p>Weather: ${data.weather[0].main}</p>
        <p>Sunrise: ${getTime(data.sys.sunrise)}</p>
        <p>Sunset: ${getTime(data.sys.sunset)}</p>
    </div>
</div>`;
}

async function loadForecast() {
   const {storage} = await import("./storage.js")
    UI.display.innerHTML = `<p>${storage.getCurrentCity()}</p>`;
    data.response.then(makeResponseForecast)
}

function renderForecast(data) {
    console.log(data)
    data.hourly.forEach(hourData => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<span class="date">${getDate(hourData.dt)}</span>
        <span class="time">${getTime(hourData.dt)}</span>
        <span class="temperature">Temperature: ${hourData.temp}°</span>
        <span class="feel_like">Feels like: ${hourData.feels_like}°</span>
        <span class="state">${hourData.weather[0].main}</span>
        <img src="http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png" alt="weather icon" class="icon" width="28px">`;
        UI.display.insertAdjacentElement("beforeend", div);
    })
}

function getDate(unixTimestamp) {
    const millSecond = unixTimestamp*1000;
    const dateObj = new Date(millSecond);
    return dateObj.toLocaleString("en-US", {day: "numeric", weekday: "long"});
}

function getTime(unixTimestamp) {
    const millSecond = unixTimestamp*1000;
    const dateObj = new Date(millSecond);
    return dateObj.toLocaleString("ru", {hour: "numeric", minute: "numeric"});
}
