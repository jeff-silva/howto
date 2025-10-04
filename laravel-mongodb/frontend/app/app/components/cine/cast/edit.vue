<template>
  <v-card title="Equipe">
    <v-card-text>
      <v-text-field
        v-model="cineCast.data.slug"
        label="Slug"
        disabled
      />
      <v-text-field
        v-model="cineCast.data.name"
        label="Nome"
      />

      <cine-movie-cast-edit
        v-if="cineCast.data.id"
        :cine-cast-id="cineCast.data.id"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        text="Salvar"
        @click="cineCast.save()"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  entityId: { type: String, default: null },
});

const emit = defineEmits(["on-success"]);

const cineCast = useCrud({
  entity: "cine_cast",
  fields: ["id", "slug", "name"],
  selectGraphql() {
    return `{
      id slug name
      cine_movie_list {
        id name
        cine_movie { id slug name }
      }
    }`;
  },
  onSuccess(ctx) {
    emit("on-success", { ...ctx, ...cineCast });
  },
});

cineCast.select(props.entityId);

watch(
  () => props.entityId,
  (id) => {
    cineCast.select(id);
  }
);
</script>
