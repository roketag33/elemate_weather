export interface Weather {
  cityName: string;
  temperature: number;
  weatherDescription: string;
  weatherIcon?: string;
  weatherUrl?: string;
  lat?: number;  
  lng?: number;
  humidity: number;
  windSpeed: number;
}
