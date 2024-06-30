<template>
  <div class="weather-info card text-center my-4 shadow-sm">
    <div class="card-body">
      <h2 class="card-title text-primary">{{ cityName }}</h2>
      <p class="card-text">Température actuelle: <span class="text-warning">{{ temperature }}°C</span></p>
      <p class="card-text">Description: <span class="text-info">{{ weatherDescription }}</span></p>
      <p class="card-text">Humidité: <span class="text-success">{{ humidity }}%</span></p>
      <p class="card-text">Vitesse du vent: <span class="text-danger">{{ windSpeed }} km/h</span></p>
      <img :src="weatherIcon" alt="Weather icon" v-if="weatherIcon" class="mx-auto d-block my-3">
      <a :href="weatherUrl" target="_blank" v-if="weatherUrl" class="btn btn-primary mt-3">Plus de détails</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WeatherInfo',
  props: {
    cityName: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    weatherDescription: {
      type: String,
      required: true,
    },
    weatherIcon: {
      type: String,
      required: false,
    },
    weatherUrl: {
      type: String,
      required: false,
    },
    humidity: {
      type: Number,
      required: true,
    },
    windSpeed: {
      type: Number,
      required: true,
    },
  },
});
</script>