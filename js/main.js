import {UI, loadForecast, renderForecast} from "./view.js";
import { renderNowTab, setSavedCities } from "./renderUI.js";
import {storage} from "./storage.js";
export {makeResponseWeather, makeResponseForecast, data};

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const serverUrlForecast = 'https://api.openweathermap.org/data/2.5/onecall';
const apiKey = '81ef7d3962516426d5e377aea7aca456';
const data = {};

function makeResponseWeather(city) {
    const cityName = getCurrentCity() || city;
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(response => {
    console.log(response);
    if (response.ok) {
        data.response = response.json();
        return data.response;
    }
    throw new Error("404 Error: There is no such city"); })
    .then(renderNowTab)
    .catch(err => alert(err.message + err.stack))
    .finally(UI.INPUT.value="");

}

async function makeResponseForecast(data) {
    const url = `${serverUrlForecast}?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const json = await res.json();
            renderForecast(json);
        } else {
            throw new Error("404 error");
        }
    } catch(e) {
        console.log(e.message);
    }
    
}

function getCurrentCity() {
    return UI.INPUT.value;
}

makeResponseWeather(storage.getCurrentCity() || "Morozovsk");
if (storage.getFavoriteCities().length !== 0) {
    setSavedCities();
}

UI.SEARCH_BUTTON.addEventListener("click", makeResponseWeather);