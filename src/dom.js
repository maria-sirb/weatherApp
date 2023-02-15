import { current, hourly, daily, getCityWeather, getWeather } from "./service";

let input;
export function DisplayCurrentWeather()
{

}
export async function Search()
{
    input = document.querySelector(".search").value;
    console.log(await getWeather(input));
    console.log(await current);
    console.log(await hourly);
    console.log(await daily);

}
export function getSearchInput()
{
    return document.querySelector(".search").value;
}