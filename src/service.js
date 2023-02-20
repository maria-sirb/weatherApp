import { countryCodes } from "./countries";
import fromUnixTime from 'date-fns/fromUnixTime';

let appId = "3cbe28ce67b6d8ea4fc65a1a0e18c7af";
let currPosition;
const apiCurrUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?";
export let current, hourly = [], daily = [];

export async function getCurrentWeather(url)
{
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}
export async function getWeather(location, units = "metric")
{
    ClearData();
    let splitLocation = location.split(",");
    let city = splitLocation[0].replace(/\s/g, "+");
    if(splitLocation.length > 1)
    {
        let country = splitLocation[1].replace(/\s/g, "").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        let countryCode = country;
        if(countryCodes.hasOwnProperty(country))
        {
            countryCode = countryCodes[country];
        }
        return {forecast: await getCityCountryForecast(city, countryCode, units), curr : await getCityCountryCurrentWeather(city, countryCode)};
        // console.log(await getCityCountryCurrentWeather(city, countryCode));
    }
    return {forecast : await getCityForecast(city, units), curr : await getCityCurrentWeather(city, units)};
   
}
export async function getCityForecast(city, units = "metric")
{
    let data;
    try
    {
        const response = await fetch(apiUrl + `q=${city}` + `&APPID=${appId}`+ `&units=${units}` );
         data = await response.json();
       // ProcessForecast(await data);
   
    }
    catch(err)
    {
        return err.message;
    }
    ProcessForecast(await data);
    console.log(data);
    return await data;

}
export async function getCityCurrentWeather(city, units = "metric")
{
    let data;
    try
    {
        const response = await fetch(apiCurrUrl + `q=${city}` + `&APPID=${appId}`+ `&units=${units}` );
        data = await response.json();
       
    }
    catch(err)
    {
        return err.message;
    }
    ProcessCurrent(await data);
    return await data;

}
export async function getCityCountryForecast(city, countryCode, units = "metric")
{
    let data;
    try
    {
        const response = await fetch(apiUrl + `q=${city},${countryCode}` + `&APPID=${appId}`+ `&units=${units}` );
        data = await response.json();
    
    }
    catch(err)
    {
        return err.message;
    }
    ProcessForecast(await data);
    return await data;

}
export async function getCityCountryCurrentWeather(city, countryCode, units = "metric")
{
    let data;
    try
    {
        const response = await fetch(apiCurrUrl + `q=${city},${countryCode}` + `&APPID=${appId}`+ `&units=${units}` );
        data = await response.json();
   
    }
    catch(err)
    {
        return err.message;
    }
    ProcessCurrent(await data);
    return await data;
}
export async function getGeolocationWeather(latitude, longitude, units = "metric")
{
    return {forecast: await getGeolocationForecast(latitude, longitude, units), current : await getGeolocationCurrentWeather(latitude, longitude, units)};
}
export async function getGeolocationForecast(latitude, longitude, units = "metric")
{
    const response = await fetch(apiUrl + `lat=${latitude}&lon=${longitude}` + `&APPID=${appId}` + `&units=${units}`);
    const data = await response.json();
    ProcessForecast(await data);
    return data;
}
export async function getGeolocationCurrentWeather(latitude, longitude, units = "metric")
{
    const response = await fetch(apiCurrUrl + `lat=${latitude}&lon=${longitude}` + `&APPID=${appId}` + `&units=${units}`);
    const data = await response.json();
    ProcessCurrent(await data);
    return data;
}
function ProcessForecast(data)
{
    hourly = [];
    daily = [];
    setHourly(data);
    setDaily(data);
    
}
function ProcessCurrent(data)
{
    current = {};
    setCurrent(data);
}
function ClearData()
{
    hourly = [];
    daily = [];
    current = {};
}

async function setCurrent(data)
{
    console.log(data);
    current = 
    {
        city : data.name,
        country : data.sys.country,
        time : getTime(data.dt, data.timezone),
        temp: Math.round(data.main.temp),
        feelsLike : Math.round(data.main.feels_like),
        humidity : `${data.main.humidity}%`,
        description : data.weather[0].main,
        icon : data.weather[0].icon,
        visibility : `${data.visibility / 1000}`,
        wind : Math.round((data.wind.speed * 3600) / 1000),
        sunrise : getTime(data.sys.sunrise, data.timezone),
        sunset : getTime(data.sys.sunset, data.timezone),
        daytime : getDayTime(getTime(data.dt, data.timezone), getTime(data.sys.sunrise, data.timezone), getTime(data.sys.sunset, data.timezone) )
    };
   // console.log( Number(data.list[0].dt_txt.split(" ")[1].split(":")[0])+ " " + new Date((data.city.sunrise) * 1000).getHours() + " " +new Date(data.city.sunset * 1000).toLocaleTimeString());
    console.log(getTime(data.dt, data.timezone));
   console.log(fromUnixTime( data.sys.sunrise + data.timezone).toUTCString().split(" ")[4]);
    console.log(fromUnixTime( data.sys.sunset + data.timezone).toUTCString().split(" ")[4])
}
function setHourly(data)
{
    let sunrise = new Date(data.city.sunrise * 1000).getHours();
    let sunset =  new Date(data.city.sunset * 1000).getHours();
    for(let i = 0; i < 8; i++)
    {
        
        let currHour = Number(data.list[i].dt_txt.split(" ")[1].split(":")[0]);
        let dayTime = getDayTime(currHour, sunrise, sunset);
       // console.log(sunrise + " " + sunset + " " + currHour);
        let hour = 
        {
          // hour: data.list[i].dt_txt.split(" ")[1].split(":")[0],
          hour: getTime(data.list[i].dt, data.city.timezone).split(":")[0],
           temp: Math.round(data.list[i].main.temp),
           description: data.list[i].weather[0].main,
           icon : data.list[i].weather[0].icon,
           precipitation : Math.round(data.list[i].pop * 100),
           dayTime :  dayTime
        }
        hourly.push(hour);
    }
}
function setDaily(data)
{
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let date = addDays(data.list[0].dt_txt.split(" "), 1);
    let minTemp = 50, maxTemp = -50, description = "", icon = "", precipitation = 0;
    let i = 1;
    //dont include today in the daily forecast
    while(data.list[i].dt_txt.split(" ")[0] == data.list[0].dt_txt.split(" ")[0])
    {
        i++;
    }
    while(i < data.list.length)
    {
       let dateTime = data.list[i].dt_txt.split(" ");
       let time = getTime(data.list[i].dt, data.city.timezone);
        let temp = data.list[i].main.temp;
        let precip = data.list[i].pop;
        if(dateTime[0] != date)
        {
            let day =
            {
                day: weekday[new Date(date).getDay()],
                min: Math.round(minTemp),
                max: Math.round(maxTemp),
                icon : icon,
                precipitation : Math.round(precipitation * 100),
                description : description
            }
            daily.push(day);
            minTemp = 50;
            maxTemp = -50;
            description = "";
            date = dateTime[0];
        }
        if(time >= "12:00" && time <= "15:00")
        {
            description = data.list[i].weather[0].main;
            icon = data.list[i].weather[0].icon;
            precipitation = data.list[i].pop;
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
function getTime(unixTimestamp, offset)
{
    let time =  fromUnixTime( unixTimestamp + offset).toUTCString().split(" ")[4];
    return time.split(":")[0] + ":" + time.split(":")[1];
  
}
function getDayTime(current, sunrise, sunset)
{
    let dayTime = "night";
   // console.log(current + " " + sunrise + " " + sunset);
   console.log(current);
    if( current >= sunrise && current <= sunset)
    {
        dayTime = "day";
    }
    return dayTime;
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
        return currPosition;
    }
    catch(err){
        console.log(err.message);
        return err.message;
    }
}
