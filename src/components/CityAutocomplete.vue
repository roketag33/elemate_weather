<template>
  <div class="mb-4">
    <input type="text" v-model="searchQuery" @input="onInput" class="form-control form-control-lg shadow-sm" placeholder="Entrez une ville" ref="autocomplete">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

export default defineComponent({
  name: 'CityAutocomplete',
  emits: ['placeChanged'],
  setup(_, { emit }) {
    const searchQuery = ref('');
    const autocomplete = ref<HTMLInputElement | null>(null);
    let autocompleteService: google.maps.places.Autocomplete | null = null;

    onMounted(() => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      const loader = new Loader({
        apiKey: apiKey,
        libraries: ['places'],
      });

      loader.load().then(() => {
        if (autocomplete.value) {
          autocompleteService = new google.maps.places.Autocomplete(autocomplete.value, {
            types: ['(cities)'],
          });

          autocompleteService.addListener('place_changed', () => {
            if (autocompleteService) {
              const place = autocompleteService.getPlace();
              if (place.name) {
                searchQuery.value = place.name;
                emit('placeChanged', place.name);
              }
            }
          });
        }
      }).catch(err => {
        console.error('Error loading Google Maps API:', err);
      });
    });

    const onInput = () => {
      if (autocomplete.value) {
        emit('placeChanged', searchQuery.value);
      }
    };

    watch(searchQuery, (newQuery) => {
      if (newQuery === '') {
        emit('placeChanged', newQuery);
      }
    });

    return {
      searchQuery,
      autocomplete,
      onInput,
    };
  },
});
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
