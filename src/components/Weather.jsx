import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
    const [weatherData , setWeatherData] = useState(false)
    const [userLocation , setUserLocation] = useState(null)
    const [permissionReq , setPermissionReq] = useState(null)

    const getLocation = ()=>{
        if("geolocation" in navigator){
            setPermissionReq(true);
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    const {latitude , longitude} = position.coords;
                    console.log(`User latitude : ${latitude} Longitude : ${longitude}`);
                    setUserLocation({latitude,longitude});
                },(err)=>{
                    console.err("Error in getting loc")
                });
        }else{
            console.err("Geolocation not supported by brow")
        }
    }

    const inputRef = useRef();
    const search = async (city) =>{
        if(city === ""){
            alert("Enter City Name");
            return;
        }
        try{
            const api = "c3c77c1cdf9406db56b0425f795740c3"
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            
            const allIcons = {
                "01d":clear_icon,
                "01n":clear_icon,
                "02d":cloud_icon,
                "02n":cloud_icon,
                "03d":cloud_icon,
                "03n":cloud_icon,
                "04d":drizzle_icon,
                "04n":drizzle_icon,
                "09d":rain_icon,
                "09n":rain_icon,
                "10d":rain_icon,
                "10n":rain_icon,
                "13d":snow_icon,
                "13n":snow_icon,
            }
            const response = await fetch(url);
            const data = await response.json();

            if(!response.ok){
                alert(data.message);
                return;
            }
            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity : data.main.humidity,
                windSpeed : data.wind.speed,
                temp : Math.floor(data.main.temp),
                location : data.name,
                icon : icon
            })
        
        }catch (err){
            setWeatherData(false);
            console.err("ERror in fetching")
        }
    }

useEffect(()=>{
    getLocation();
    search("Bengaluru");
},[]);
return (
    <div className='weather'>
        
        <div className="searchBar">
            <input ref={inputRef} type="text" placeholder='Search' />
            <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)}/>
        </div>
        {weatherData?<>
            <img src={weatherData.icon} alt="" className='weatherIcon'/>
        <p className='temp'> {weatherData.temp}° C</p>
        <p className='location'>{weatherData.location}</p>

        <div className="weatherData">
            <div className="column">
                <img src={humidity_icon} alt="" />
                <div>
                    <p>{weatherData.humidity}%</p>
                    <span>Humidity</span>
                </div>
            </div>
            <div className="column">
                <img src={wind_icon} alt="" />
                <div>
                    <p>{weatherData.windSpeed}km/hr</p>
                    <span>Wind Speed</span>
                </div>
            </div>
        </div>
        </>:<>
        
        </>}
        
    </div>
    )
}

export default Weather