import { countryCodes } from "./countries";

let appId = "3cbe28ce67b6d8ea4fc65a1a0e18c7af";
let currPosition;
const apiCurrWatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?";

export async function getWeather(url)
{
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}
export async function getCityWeather(cityCountry, units = "metric")
{
    cityCountry = cityCountry.replace(/\s/g, "");
    let splitLocation = cityCountry.split(",");
    let city = splitLocation[0];
    let country = splitLocation[1];
    let countryCode = countryCodes[country];
    const response = await fetch(apiUrl + `q=${city},${countryCode}` + `&exclude=hourly&APPID=${appId}`+ `&units=${units}` );
    const data = await response.json();
    return data;

}
export async function getGeolocationWeather(latitude, longitude, units = "metric")
{
    const response = await fetch(apiUrl + `lat=${latitude}&lon=${longitude}` + `&APPID=${appId}` + `&units=${units}`);
}
function getPosition()
{
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}
export async function getCurrentLocation()
{
    
    try{
        currPosition = await getPosition();
        console.log(currPosition);
    }
    catch(err){
        console.log(err.message);
    }
}
