<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-btn
          text="Submit"
          :loading="appIndex.busy"
          @click="appIndex.submit()"
        />
        <pre>appIndex: {{ appIndex }}</pre>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          label="name"
          v-model="appUserCreate.data.name"
        />
        <v-text-field
          label="email"
          v-model="appUserCreate.data.email"
        />
        <v-btn
          text="Submit"
          :loading="appUserCreate.busy"
          @click="appUserCreate.submit()"
        />
        <pre>appUserCreate: {{ appUserCreate }}</pre>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import axios from "axios";

const useRequest = (options = {}) => {
  if (options.url.startsWith("api://")) {
    options.url = options.url.replace("api://", "http://localhost:3333/");
  }

  const r = reactive({
    busy: false,
    url: "",
    method: "get",
    params: {},
    data: {},
    headers: {},
    response: null,
    onSuccess: () => null,
    onError: () => null,
    ...options,
    error: null,
    async submit() {
      r.busy = true;
      r.error = null;

      let fetchOptions = {
        url: r.url,
        method: r.method || "get",
        params: r.params || {},
        headers: r.headers || {},
      };

      if (["post", "put"].includes(fetchOptions.method)) {
        fetchOptions.data = r.data;
      }

      console.log(fetchOptions);

      try {
        const resp = await axios(fetchOptions);
        r.response = resp.data;
      } catch (err) {
        r.error = {
          name: err.name,
          status: err.status,
          message: err.message,
          response: err.response,
        };
      }

      r.busy = false;
    },
  });

  return r;
};

const appIndex = useRequest({
  method: "get",
  url: "api://app/index",
  response: { data: [] },
});

const appUserCreate = useRequest({
  method: "post",
  url: "api://app_user",
  response: { entity: null },
});
</script>
