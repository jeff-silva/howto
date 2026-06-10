<template>
  <div>
    <v-container>
      <v-btn
        text="submit"
        :loading="map.busy"
        @click="map.submit()"
      />
      <br /><br />
      <pre>map: {{ map }}</pre>
    </v-container>
  </div>
</template>

<script setup>
// import { useGeolocation } from "@vueuse/core";

const map = useRequest({
  url: `https://overpass-api.de/api/interpreter`,
  params: {
    async data() {
      if (!navigator.geolocation) return "";

      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude: lat, longitude: lng } = pos.coords;

      const size = 0.01;
      let lat1 = (lat === Infinity ? 0 : lat) - size;
      let lat2 = (lat === Infinity ? 0 : lat) + size;
      let lng1 = (lng === Infinity ? 0 : lng) - size;
      let lng2 = (lng === Infinity ? 0 : lng) + size;

      return `[out:json];
        (
          way(${lat1},${lng1},${lat2},${lng2});
          node(${lat1},${lng1},${lat2},${lng2});
        );
      out;`;

      // return `[out:json];
      //   (
      //     node(${lat1},${lng1},${lat2},${lng2});
      //     way(${lat1},${lng1},${lat2},${lng2});
      //     rel(${lat1},${lng1},${lat2},${lng2});
      //   );
      // out;`;
    },
  },
  response: {
    elements: [],
  },
});

onMounted(() => {
  map.submit();
});
</script>
