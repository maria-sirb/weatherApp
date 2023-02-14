import { countryCodes } from "./countries"
import { getCityWeather, getCountryCode, getCurrentLocation, getPosition, getWeather } from "./service"

// Create heading node
const heading = document.createElement('h1')
heading.textContent = 'djkjnshsuif!'

// Append heading node to the DOM
const app = document.querySelector('#root')
app.append(heading)

let code = countryCodes['Italy'];
console.log(code);
const data = await getWeather("https://api.openweathermap.org/data/2.5/weather?q=Venice&APPID=3cbe28ce67b6d8ea4fc65a1a0e18c7af");
console.log(data);
console.log(await getCityWeather("Oradea"));