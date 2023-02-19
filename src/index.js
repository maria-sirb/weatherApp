import { countryCodes } from "./countries"
import { ChangeUnits, DisplayInitial, Search } from "./dom";
import { getCityWeather, getCountryCode, getCurrentLocation, getPosition, getWeather, getCurrentWeather } from "./service"
import "./style.css";

/*let code = countryCodes['Italy'];
console.log(code);
const data = await getWeather("https://api.openweathermap.org/data/2.5/weather?q=Venice&APPID=3cbe28ce67b6d8ea4fc65a1a0e18c7af");
console.log(data);
console.log(await getCityWeather("Oradea"));*/
//const data = await getCurrentWeather("https://api.openweathermap.org/data/2.5/weather?q=Oradea&APPID=3cbe28ce67b6d8ea4fc65a1a0e18c7af");
//console.log(data);
let searchBtn = document.querySelector(".search-btn");
searchBtn.addEventListener('click', () => {
    Search();
})
window.addEventListener('load', () => {
    DisplayInitial();
});
let radioBtns = document.getElementsByName("units");
radioBtns.forEach(radioBtn => radioBtn.addEventListener('click', () => {
    ChangeUnits();
}));
