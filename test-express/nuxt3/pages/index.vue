<template>
  <div>
    <v-container>
      <div class="d-flex align-center ga-4">
        <v-text-field
          label="random"
          v-model.number="test.params.random"
          :hide-details="true"
          density="compact"
          type="number"
        />

        <v-btn
          :loading="test.busy"
          @click="test.submit()"
        >
          submit
        </v-btn>
        <v-btn @click="() => _location.reload()">reload</v-btn>
      </div>
      <br />

      <pre>{{ test }}</pre>
    </v-container>
  </div>
</template>

<script setup>
const _location = location;

const test = useRequest({
  url: "http://localhost:3000/api/v1/test",
  params: { random: null },
  response: { random: null },
  // onBeforeRequest(data) {
  //   test.params = data;
  // },
  onSuccess(data) {
    test.params = data;
  },
});
</script>
