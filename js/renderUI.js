import { makeResponseWeather } from "./main.js";
import {storage} from "./storage.js";
export {renderNowTab, setSavedCities, ui}; 

const ui = {
    display: document.querySelector(".content"),
    favCity: document.querySelector(".save-locations"),
}
const savedCities = storage.getFavoriteCities().split(",");

function renderNowTab(data) {
    console.log(data);
    const iconId = data.weather[0].icon;
    ui.display.innerHTML = `<span class="degree">${data.main.temp + "°"}</span>
    <img  class="weather-icon">
    <div class="city-footer">
    <span id="current-city">${data.name}</span> 
    <a class="like-btn" data-added="false"><img id ="like-btn" src="img/fav_disable.svg" width="30px"></a>
        </div>`

    ui.city = document.querySelector("#current-city");
    ui.likeImg = document.querySelector("#like-btn");
    ui.degree = document.querySelector(".degree");
    ui.favCity = document.querySelector(".save-locations");
    ui.saveButton = document.querySelector(".like-btn");
    ui.cities = document.querySelector(".save-locations").children;


    loadIcon(iconId);
    initSaveButton();
}

function loadIcon(iconId) {
    const img = document.querySelector(".weather-icon");
    const url = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
    img.src = url;
}

function initSaveButton() {
    const isAlreadySave = savedCities.includes(ui.city.textContent);
    console.log(savedCities)
    if (isAlreadySave) {
        ui.likeImg.src = "img/fav_enable.svg";
        ui.saveButton.dataset.added = "true";
        storage.saveCurrentCity(ui.city.textContent);
    } else {
        ui.likeImg.src = "img/fav_disable.svg";
        ui.saveButton.dataset.added = "false";
    }
 ui.saveButton.addEventListener("click", clickSaveButton);

}

function clickSaveButton() {
    const cityName = ui.city.textContent;
    if (ui.saveButton.dataset.added === "false") {
        ui.likeImg.src = "img/fav_enable.svg";
        ui.saveButton.dataset.added = "true";
        storage.saveCurrentCity(ui.city.textContent);
        updateSavedCities(cityName);
    } else {
        ui.likeImg.src = "img/fav_disable.svg";
        ui.saveButton.dataset.added = "false";
        updateSavedCities(cityName); 
    }
    
}

function updateSavedCities(city) {
    const index = savedCities.indexOf(city);
    if (index !== -1) {
        for (let elem of ui.cities) {
            if (elem.textContent === city) {
                elem.remove();
            }
        }
        savedCities.splice(index, 1);
    } else {
        createCityElement(city);
        savedCities.push(city);
    }
    storage.saveFavoriteCities(savedCities);
}

function setSavedCities() {
    const cities = storage.getFavoriteCities().split(",");
    cities.forEach(createCityElement);
}

function createCityElement(city) {
    const div = document.createElement("div");
    div.innerHTML = `${city}<a><img src="img/cancel.svg"></a>`;

    div.addEventListener("click", function() {
        makeResponseWeather(div.textContent);
    })
    div.firstElementChild.addEventListener("click", function() {
        const pos = savedCities.indexOf(div.textContent);
        savedCities.splice(pos, 1);
        storage.saveFavoriteCities(savedCities);
        if (div.textContent === ui.city.textContent) {
            ui.likeImg.src = "img/fav_disable.svg";
            ui.saveButton.dataset.added = "false";
        }
        div.remove();
    })
    ui.favCity.insertAdjacentElement("beforeend", div);
}