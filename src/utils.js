import { units } from "./dom";
export function ConvertSpeed(speed)
{
    if(units == "metric")
        return ConvertToKph(speed);
    else 
        return ConvertToMph(speed);    
}
export function ConvertDist(dist)
{
    if(units == "metric")
        return ConvertToKm(dist);
    else 
        return ConvertToMiles(dist);    
}
export function ConvertTemp(temp)
{
    if(units == "metric")
        return ConvertToCelsius(temp);
    else 
        return ConvertToFahrenheit(temp);    
}
export function ConvertToCelsius(temp)
{
    return Math.round((temp - 32) * 0.5556);   
}
export function ConvertToFahrenheit(temp)
{   
    return Math.round((temp * 1.8) + 32);
}
export function ConvertToKm(dist)
{
    return Math.round(dist * 1.6);
}
export function ConvertToMiles(dist)
{
    return Math.round(dist * 0.621371);
}
export function ConvertToKph(speed)
{
    return Math.round(speed * 1.6093440006147);
}
export function ConvertToMph(speed)
{
    return Math.round(speed / 1.609344);
}