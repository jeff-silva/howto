<template>
  <v-card title="Filme">
    <v-card-text>
      <v-text-field
        v-model="cineMovie.data.slug"
        label="Slug"
        disabled
      />
      <v-text-field
        v-model="cineMovie.data.name"
        label="Nome"
      />

      <cine-movie-cast-edit
        v-if="cineMovie.data.id"
        :cine-movie-id="cineMovie.data.id"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        text="Salvar"
        @click="cineMovie.save()"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  entityId: { type: String, default: null },
});

const emit = defineEmits(["on-success"]);

const cineMovie = useCrud({
  entity: "cine_movie",
  fields: ["id", "slug", "name"],
  selectGraphql() {
    return `{
      id slug name
    }`;
  },
  onSuccess(ctx) {
    emit("on-success", { ...ctx, ...cineMovie });
  },
});

cineMovie.select(props.entityId);

watch(
  () => props.entityId,
  (id) => {
    cineMovie.select(id);
  }
);
</script>
