import type { Weather } from '../models/Weather';

export const fakeWeatherData: Weather[] = [
  {
    cityName: 'Paris',
    temperature: 18,
    weatherDescription: 'Sunny',
    weatherIcon: 'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png',
    weatherUrl: 'https://www.google.com/search?q=weather+Paris',
    lat: 48.8566,
    lng: 2.3522,
    humidity: 50,
    windSpeed: 10
  },
  {
    cityName: 'London',
    temperature: 15,
    weatherDescription: 'Partly cloudy',
    weatherIcon: 'https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png',
    weatherUrl: 'https://www.google.com/search?q=weather+London',
    lat: 51.5074,
    lng: -0.1278,
    humidity: 60,
    windSpeed: 12
  }
];
