import axios from 'axios';
import type { Weather } from '../models/Weather';

const API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY;
const BASE_URL = 'http://api.weatherstack.com/current';  

const cache: Record<string, Weather> = {};

export async function getWeather(city: string): Promise<Weather> {
  if (cache[city]) {
    return cache[city];
  }

  try {
    const requestUrl = `${BASE_URL}?access_key=${API_KEY}&query=${city}`;
    const response = await axios.get(requestUrl);
    const data = response.data;

    if (data.error) {
      throw new Error(data.error.info);
    }

    const weather: Weather = {
      cityName: data.location.name,
      temperature: data.current.temperature,
      weatherDescription: data.current.weather_descriptions[0],
      weatherIcon: data.current.weather_icons[0],
      weatherUrl: `https://www.google.com/search?q=weather+${data.location.name}`,
      lat: parseFloat(data.location.lat),
      lng: parseFloat(data.location.lon),
      humidity: data.current.humidity,
      windSpeed: data.current.wind_speed,
    };

    cache[city] = weather;

    return weather;
  } catch (error) {
    handleError(error);
  }
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.response?.data);
  } else if (error instanceof Error) {
    console.error('General error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
  throw new Error('Erreur lors de la récupération des données météo');
}
