<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-table>
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="o in appUserIndex.response.data">
              <tr>
                <td>{{ o.name }}</td>
                <td>{{ o.email }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
        <v-btn
          text="Submit"
          :loading="appUserIndex.busy"
          @click="appUserIndex.submit()"
        />
        <pre>appUserIndex: {{ appUserIndex }}</pre>
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
    </v-row>
  </div>
</template>

<script setup>
const appIndex = useAxios({
  method: "get",
  url: "api://app/index",
  response: { data: [] },
});

appIndex.submit();

const appUserCreate = useAxios({
  method: "post",
  url: "api://app_user",
  response: { entity: null },
  onSuccess() {
    appIndex.submit();
  },
});

const appUserIndex = useAxios({
  method: "get",
  url: "api://app_user",
  response: { data: [] },
});
</script>
