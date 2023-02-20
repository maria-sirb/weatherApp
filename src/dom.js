import { current, hourly, daily, getCityWeather, getWeather, getGeolocationWeather, getCurrentLocation } from "./service";
import { ConvertDist, ConvertSpeed, ConvertTemp, ConvertToKm, ConvertToMiles, ConvertToMph } from "./utils";

let input, unitsSymbol, distUnits, speedUnits;
export let units;

export async function Search()
{
    DeleteError();
    input = document.querySelector(".search").value;
    units = document.querySelector('input[name="units"]:checked').value;
    try
    {
        console.log(await getWeather(input, units));
    }
    catch(err)
    {
        DisplayError();
        console.log(err);
        return;
    }
    DisplayCurrentWeather(current);
    DisplayHourlyWeather(hourly);
    DisplayDailyWeather(daily);
    setBackground();
    console.log( current);
    console.log( hourly);
    console.log( daily);

}
export async function DisplayInitial()
{
   let currLocation = await getCurrentLocation();
   console.log(await getGeolocationWeather(currLocation.coords.latitude, currLocation.coords.longitude));
   setUnits();
    DisplayCurrentWeather(current);
    DisplayHourlyWeather( hourly);
    DisplayDailyWeather( daily);
    setBackground();
   console.log( current);
   console.log( hourly);
   console.log( daily);
  
}
export function getSearchInput()
{
    return document.querySelector(".search").value;
}
function setBackground()
{
    let body = document.querySelector("body");
    body.classList =`${current.icon[2]}${current.icon[0]}${current.icon[1]}`;
    console.log(body.classList);

}
export function DisplayCurrentWeather(current)
{
    GenerateCurrent();
    //the api returns visibility in km only
    if(units == "imperial")
    { current.visibility = ConvertToMiles(current.visibility);
        current.wind = ConvertToMph(current.wind);
    }
    let currContainer = document.querySelector(".current");
    currContainer.innerHTML = 
    `<div class = "curr-first-half">
    <h1 class = "city">${current.city}, ${current.country} </h1>

    <h3 class = "time">${current.time}</h3>
    <img src = "/images/${current.icon}.png"/>
    <h1 class = "temp">${current.temp} ${unitsSymbol}</h1>
    <h3 class = "description">${current.description}</h3>
    </div>
    <div class = "curr-second-half">
    <div class = "value-container feelsLike">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>thermometer</title><path d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z" /></svg>
        Feels Like : 
        </div>
    <span class = "temp">${current.feelsLike} ${unitsSymbol}</span>
    </div>

    <div class = "value-container humidity">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>water-percent</title><path d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z" /></svg>
        Humidity :
        </div>
        <span>${current.humidity}</span>
    </div>

    <div class = "value-container wind">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-windy</title><path d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" /></svg>
        Wind :
        </div> 
        <span class = "speed">${current.wind} ${speedUnits}</span>
    </div>

    <div class = "value-container visibility">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eye-outline</title><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" /></svg>
        Visibility :
        </div> 
        <span class = "distance">${current.visibility} ${distUnits}</span>
    </div>

    <div class = "value-container sunrise">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-sunset-up</title><path d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z" /></svg>
        Sunrise : 
        </div>
        <span>${current.sunrise}</span></div>

    <div class = "value-container sunset">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>weather-sunset-down</title><path d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,20.71L15.82,17.6C16.21,17.21 16.21,16.57 15.82,16.18C15.43,15.79 14.8,15.79 14.41,16.18L12,18.59L9.59,16.18C9.2,15.79 8.57,15.79 8.18,16.18C7.79,16.57 7.79,17.21 8.18,17.6L11.29,20.71C11.5,20.9 11.74,21 12,21C12.26,21 12.5,20.9 12.71,20.71Z" /></svg>
        Sunset :
        </div> 
        <span>${ current.sunset}</span></div>
    </div>
    `;

}
export function ChangeUnits()
{
    setUnits();
    ConvertAllTemp();
    ConvertAllDistance();
    ConvertAllSpeed();
}
export function DisplayHourlyWeather(hourly)
{
   GenerateHourly();
    hourly.forEach(hour => {
        AppendToHourly(hour);
    });
}
export function GenerateCurrent()
{
    let currContainer = document.querySelector(".current");
    currContainer.innerHTML = "";
}
export function ConvertAllTemp()
{
    let tempElem = document.querySelectorAll(".temp");
    tempElem.forEach(elem => {
        let temp = elem.textContent.split(" ")[0];
        elem.textContent = `${ConvertTemp(Number(temp))} ${unitsSymbol}`;
    });
   
}
export function ConvertAllDistance()
{
    let distElem = document.querySelectorAll(".distance");
    distElem.forEach(elem => {
        let dist = elem.textContent.split(" ")[0];
        elem.textContent = `${ConvertDist(Number(dist))} ${distUnits}`;
    });
}
export function ConvertAllSpeed()
{
    let speedElem = document.querySelectorAll(".speed");
    speedElem.forEach(elem => {
        let speed = elem.textContent.split(" ")[0];
        elem.textContent = `${ConvertSpeed(Number(speed))} ${speedUnits}`;
    });
}

export function GenerateHourly()
{
    let hourlyContainer = document.querySelector(".hourly-container");
    hourlyContainer.innerHTML = `
    <div class = "header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>clock-outline</title><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" /></svg>
        Hourly forecast
      </div>
      <div class = "hourly">
      </div>`;
}
export function AppendToHourly(hour)
{
    let hourlyContainer = document.querySelector(".hourly");
    let hourContainer = document.createElement("div");
    hourContainer.classList.add("hour");
    hourContainer.innerHTML = 
    `
        <h4>${hour.hour}</h4>
        <img src = "/images/${hour.icon}.png"/>
        <h4 class = "precipitation">${hour.precipitation} %</h4>
        <h3 class = "temp">${hour.temp} ${unitsSymbol}</h3>
    `;
    hourlyContainer.appendChild(hourContainer);
}
export function DisplayDailyWeather(daily)
{
    GenerateDaily();
    daily.forEach(day => {
        AppendToDaily(day);
    });
}
export function AppendToDaily(day)
{
    let dailyContainer = document.querySelector(".daily");
    let dayContainer = document.createElement("div");
    dayContainer.classList.add("day");
    dayContainer.innerHTML = 
    `
        <h3>${day.day}</h3>
        <img src = "/images/${day.icon}.png"/>
        <h4 class = "precipitation">${day.precipitation} %</h4>
        <h4 class = "temp min-temp">${day.min} ${unitsSymbol}</h4>
        <h4 class = "temp">${day.max} ${unitsSymbol}</h4>
    `;
    dailyContainer.appendChild(dayContainer);
}
export function GenerateDaily()
{
    let dailyContainer = document.querySelector(".daily-container");
    dailyContainer.innerHTML = `
    <div class="header">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>calendar-month</title><path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z" /></svg>
    4 Day Forecast</h3>
  </div>
  <div class = "daily">
  </div>`;
}
export function DisplayError()
{
    let container = document.querySelector(".error-container");
    container.textContent = 'Location not found. Search must be in the form of : "city", "city, country", "city, country code" or "country".';
}
export function DeleteError()
{
    let container = document.querySelector(".error-container");
    container.textContent = "";
}
function setUnits()
{
    units = document.querySelector('input[name="units"]:checked').value;
    if(units == "metric")
    {
        unitsSymbol = String.fromCodePoint(8451);
        distUnits = "km";
        speedUnits = "km/h";
    }
    else 
    {
        unitsSymbol = String.fromCodePoint(8457);
        distUnits = "miles";
        speedUnits = "mph";
    }
}

