<template>
  <div class="container mt-5 p-4 bg-light shadow-lg rounded h-100">
    <div class="row h-100">
      <div class="col-lg-7 col-md-10 mx-auto">
        <h1 class="text-center my-4 text-primary">Recherche de météo</h1>
        <CityAutocomplete @placeChanged="debouncedFetchWeather" />
        <div v-if="isLoading" class="text-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Chargement...</span>
          </div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger my-4">{{ errorMessage }}</div>
        <WeatherInfo v-if="weather"
                     :cityName="weather.cityName"
                     :temperature="weather.temperature"
                     :weatherDescription="weather.weatherDescription"
                     :weatherIcon="weather.weatherIcon"
                     :weatherUrl="weather.weatherUrl"
                     :humidity="weather.humidity"
                     :windSpeed="weather.windSpeed" />
        <CityMap v-if="weather && weather.lat !== undefined && weather.lng !== undefined"
                 :lat="weather.lat"
                 :lng="weather.lng" />
      </div>
      <div class="col-lg-5 col-md-10 mx-auto">
        <div v-if="searchHistory.length" class="my-4 h-100">
          <h3 class="text-secondary">Historique des recherches</h3>
          <input type="text" v-model="searchQuery" class="form-control mb-2" placeholder="Rechercher dans l'historique">
          <button class="btn btn-sm btn-danger mb-2" @click="clearHistory">Nettoyer l'historique</button>
          <ul class="list-group shadow-sm">
            <li v-for="(item, index) in filteredSearchHistory" :key="index" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between" @click="fetchWeatherFromHistory(item.cityName)">
              <div class="d-flex align-items-center">
                <img :src="item.weatherIcon" alt="Weather icon" class="history-icon mr-2">
                <span class="history-city-name" :title="item.cityName">{{ item.cityName }}</span>
              </div>
              <span class="text-muted history-description">{{ item.weatherDescription }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import { getWeather } from './services/WeatherService';
import type { Weather } from './models/Weather';
import { fakeWeatherData } from './utils/fakeWeatherData';
import CityAutocomplete from './components/CityAutocomplete.vue';
import WeatherInfo from './components/WeatherInfo.vue';
import CityMap from './components/CityMap.vue';
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'App',
  components: {
    WeatherInfo,
    CityAutocomplete,
    CityMap,
  },
  setup() {
    const weather = ref<Weather | null>(null);
    const errorMessage = ref('');
    const isLoading = ref(false);
    const searchHistory = ref<Weather[]>([]);
    const searchQuery = ref('');
    const updateInterval = ref<number | null>(null);

    const fetchWeather = async (cityName: string) => {
      if (!cityName || cityName.length < 3) {
        return;
      }
      isLoading.value = true;
      try {
        const fetchedWeather = await getWeather(cityName);
        if (fetchedWeather) {
          weather.value = fetchedWeather;
          updateSearchHistory(fetchedWeather);
        }
        errorMessage.value = '';
      } catch (error) {
        console.error(error);
        errorMessage.value = 'Erreur lors de la récupération des données météo. Veuillez réessayer.';
      } finally {
        isLoading.value = false;
      }
    };

    const debouncedFetchWeather = debounce(fetchWeather, 300);

    const fetchWeatherFromHistory = async (cityName: string) => {
      const cachedWeather = searchHistory.value.find(item => item.cityName === cityName);
      if (cachedWeather) {
        weather.value = cachedWeather;
      } else {
        await fetchWeather(cityName);
      }
    };

    const updateSearchHistory = (newWeather: Weather) => {
      const existingIndex = searchHistory.value.findIndex(item => item.cityName === newWeather.cityName);
      if (existingIndex !== -1) {
        searchHistory.value.splice(existingIndex, 1);
      }
      searchHistory.value.unshift(newWeather);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
    };

    const loadSearchHistory = () => {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        searchHistory.value = JSON.parse(savedHistory);
      }
    };

    const populateFakeData = () => {
      localStorage.setItem('searchHistory', JSON.stringify(fakeWeatherData));
      searchHistory.value = fakeWeatherData;
    };

    const updateHistoryWeatherData = async () => {
      const updatedHistory: Weather[] = [];
      for (const item of searchHistory.value) {
        try {
          const updatedWeather = await getWeather(item.cityName);
          updatedHistory.push(updatedWeather);
        } catch (error) {
          console.error(`Erreur lors de la mise à jour des données météo pour ${item.cityName}:`, error);
        }
      }
      searchHistory.value = updatedHistory;
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
    };

    const clearHistory = () => {
      searchHistory.value = [];
      localStorage.removeItem('searchHistory');
    };

    onMounted(() => {
      loadSearchHistory();
      if (!searchHistory.value.length) {
        populateFakeData();
      }
      updateInterval.value = setInterval(updateHistoryWeatherData, 60000);
    });

    onUnmounted(() => {
      if (updateInterval.value) {
        clearInterval(updateInterval.value);
      }
    });

    const filteredSearchHistory = computed(() => {
      return searchHistory.value.filter(item => item.cityName.toLowerCase().includes(searchQuery.value.toLowerCase()));
    });

    return {
      weather,
      errorMessage,
      isLoading,
      fetchWeather,
      debouncedFetchWeather,
      fetchWeatherFromHistory,
      searchHistory,
      clearHistory,
      filteredSearchHistory,
      searchQuery,
    };
  },
});
</script>