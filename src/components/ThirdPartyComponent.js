import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const ThirdPartyComponent = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
                fetchForecast(latitude, longitude);
            }, error => {
                console.error("Error getting location", error);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, []);

    const fetchWeather = async (latitude, longitude) => {
        try {
            const apiKey = '60162dd23e20513ff670f6aa4c5a940c';
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            setCurrentWeather(response.data);
        } catch (error) {
            console.error('Failed to fetch current weather', error);
        }
    };

    const fetchForecast = async (latitude, longitude) => {
        const apiKey = '60162dd23e20513ff670f6aa4c5a940c';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        
        try {
            const response = await axios.get(url);
            // setForecast(response.data.daily);

            // As the data is every 3 hours, let's select a single time point per day for simplicity
            const dailyData = response.data.list.filter((item, index) => index % 8 === 0); // Every 24 hours (8x3-hour segments)
            // setForecast(dailyData);
            console.log("Forecast: ", dailyData);

            const chartData = {
                labels: dailyData.map(item => ((new Date(item.dt * 1000).toLocaleDateString()).toString() + ' | ' + (item.weather[0].main).toString())),
                datasets: [{
                    label: 'Daily Temperature °C',
                    data: dailyData.map(item => item.main.temp),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };
            setForecast(chartData);
        } catch (error) {
            console.error('Failed to fetch forecast', error);
        }
    };

    return (
        <div className="container mx-auto my-4">
            {currentWeather && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Current Weather in {currentWeather.name}</h5>
                        <p className="card-text">Condition: {currentWeather.weather[0].main}</p>
                        <p className="card-text">Temperature: {currentWeather.main.temp} °C</p>
                    </div>
                </div>
            )}

            {forecast && (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Temperature Forecast for next 4 days</h5>
                        <Line data={forecast} />
                    </div>
                </div>
            )}

            <div className='card mt-3'></div>
        </div>
    );
};

export default ThirdPartyComponent;
