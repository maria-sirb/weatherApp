import { countryCodes } from "./countries";

let appId = "3cbe28ce67b6d8ea4fc65a1a0e18c7af";
let currPosition;
const apiCurrWatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?";
export let current, hourly = [], daily = [];

/*export async function getWeather(url)
{
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}*/
export async function getWeather(location, units = "metric")
{
    location = location.replace(/\s/g, "");
    let splitLocation = location.split(",");
    let city = splitLocation[0];
    if(splitLocation.length > 1)
    {
        let country = splitLocation[1].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        let countryCode = country;
        if(countryCodes.hasOwnProperty(country))
        {
            countryCode = countryCodes[country];
        }
        return await getCityCountryWeather(city, countryCode, units);
    }
    return await getCityWeather(city, units);
    
   
}
export async function getCityWeather(city, units = "metric")
{
    const response = await fetch(apiUrl + `q=${city}` + `&APPID=${appId}`+ `&units=${units}` );
    const data = await response.json();
    ProcessData(await data);
    return data;

}
export async function getCityCountryWeather(city, countryCode, units = "metric")
{
    const response = await fetch(apiUrl + `q=${city},${countryCode}` + `&exclude=hourly&APPID=${appId}`+ `&units=${units}` );
    const data = await response.json();
    ProcessData(await data);
    return data;

}
export async function getGeolocationWeather(latitude, longitude, units = "metric")
{
    const response = await fetch(apiUrl + `lat=${latitude}&lon=${longitude}` + `&APPID=${appId}` + `&units=${units}`);
}
function ProcessData(data)
{
    ClearData();
    setCurrent(data);
    setHourly(data);
    setDaily(data);
  //  console.log(current);
  //  console.log(hourly);
  //  console.log(daily);
    
}
function ClearData()
{
    current = {};
    hourly = [];
    daily = [];
}
function setCurrent(data)
{
    current = 
    {
        city : data.city.name,
        country : data.city.country,
        temp: Math.round(data.list[0].main.temp),
        feelsLike : Math.round(data.list[0].main.feels_like),
        humidity : `${data.list[0].main.humidity}%`,
        description : data.list[0].weather[0].main,
        icon : data.list[0].weather[0].icon,
        visibility : `${data.list[0].visibility / 1000} km`,
        sunrise : `${new Date(data.city.sunrise * 1000).getHours()}:${new Date(data.city.sunrise * 1000).getMinutes()}`,
        sunset : `${new Date(data.city.sunset * 1000).getHours()}:${new Date(data.city.sunset * 1000).getMinutes()}`

    };
}
function setHourly(data)
{
    let sunrise = new Date(data.city.sunrise * 1000).getHours();
    let sunset = new Date(data.city.sunset * 1000).getHours();
    let dayTime = "night";
    for(let i = 0; i < 8; i++)
    {
        let currHour = Number(data.list[i].dt_txt.split(" ")[1].split(":")[0]);
        console.log(sunrise + " " + sunset + " " + currHour);
        if( currHour >= sunrise && currHour <= sunset)
        {
            dayTime = "day";
        }
        let hour = 
        {
           hour: data.list[i].dt_txt.split(" ")[1].split(":")[0],
           temp: Math.round(data.list[i].main.temp),
           description: data.list[i].weather[0].main,
           dayTime :  dayTime
        }
        hourly.push(hour);
    }
}
function setDaily(data)
{
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let date = addDays(data.list[0].dt_txt.split(" "), 1);
    let minTemp = 50, maxTemp = -50, description = "";
    let i = 1;
    //dont include today in the daily forecast
    while(data.list[i].dt_txt.split(" ")[0] == data.list[0].dt_txt.split(" ")[0])
    {
        i++;
    }
    while(i < data.list.length)
    {
        let dateTime = data.list[i].dt_txt.split(" ");
        let temp = data.list[i].main.temp;
        if(dateTime[0] != date)
        {
            let day =
            {
                day: weekday[new Date(date).getDay()],
                min: Math.round(minTemp),
                max: Math.round(maxTemp),
                description : description
            }
            daily.push(day);
            minTemp = 50;
            maxTemp = -50;
            description = "";
            date = dateTime[0];
        }
        if(dateTime[1] == "15:00:00")
        {
            description = data.list[i].weather[0].main;
        }
        if(temp < minTemp)
        {
            minTemp = temp;
        }
        if(temp > maxTemp)
        {
            maxTemp = temp;
        }
        i++;
    }
}
function addDays(date, days)
{
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
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
