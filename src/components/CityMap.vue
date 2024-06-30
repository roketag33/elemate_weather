<template>
  <div class="card my-4 shadow-sm">
    <div class="card-body p-0">
      <div ref="mapContainer" class="map-container"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'CityMap',
  props: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const mapContainer = ref<HTMLDivElement | null>(null);
    let map: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;

    const initializeMap = () => {
      if (mapContainer.value) {
        map = new google.maps.Map(mapContainer.value, {
          center: { lat: props.lat, lng: props.lng },
          zoom: 12,
        });

        marker = new google.maps.Marker({
          position: { lat: props.lat, lng: props.lng },
          map,
        });
      }
    };

    const clearMap = () => {
      if (marker) {
        marker.setMap(null);
      }
      if (map) {
        google.maps.event.clearInstanceListeners(map);
        map = null;
      }
    };

    onMounted(() => {
      initializeMap();
    });

    watch(
      () => [props.lat, props.lng],
      ([newLat, newLng]) => {
        if (map && marker) {
          const newPosition = { lat: newLat, lng: newLng };
          map.setCenter(newPosition);
          marker.setPosition(newPosition);
        } else {
          clearMap();
          initializeMap();
        }
      }
    );

    onBeforeUnmount(() => {
      clearMap();
    });

    return {
      mapContainer,
    };
  },
});
</script>
