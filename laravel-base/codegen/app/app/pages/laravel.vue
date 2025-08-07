<template>
  <nuxt-layout name="app">
    <v-list>
      <template v-for="o in files">
        <v-list-item @click="file.setValue(o)">{{ o.file }}</v-list-item>
      </template>
    </v-list>

    <template v-if="file.value">
      <lib-monaco
        v-model="file.value.content"
        :options="{ language: file.value.language }"
      />
    </template>

    <pre>{{ api.value }}</pre>
  </nuxt-layout>
</template>

<script setup>
const api = useOpenapi();

const file = reactive({
  value: null,
  setValue(value) {
    file.value = value;
  },
});

const files = computed(() => {
  const files = [];

  Object.entries(api.value.components.schemas).map(([key, value]) => {
    const content = [`<?php`, ``, `class ${key} {`, ` protected $fillable = [`];

    Object.entries(value.properties).forEach(([propKey, propValue]) => {
      if (["id"].includes(propKey)) return;
      content.push(`   '${propKey}',`);
    });

    content.push(` ];`, `}`, ``);

    files.push({
      file: `app/Models/${key}.php`,
      language: "php",
      content: content.join("\n"),
    });
  });

  console.clear();
  Object.entries(api.value.paths).map(([routePath, routeMethods]) => {
    Object.entries(routeMethods).map(([routeMethod, routeData]) => {
      files.push({
        file: `app/Http/Controllers/${routeData.operationId}.php`,
        language: "php",
        content: [
          `<?php`,
          ``,
          `class ${routeData.operationId}Controller extends Controller {`,
          `}`,
          ``,
        ].join("\n"),
      });
      console.log({
        routePath,
        routeMethod,
        routeData,
        id: routeData.operationId,
      });
    });
  });

  return files;
});
</script>
