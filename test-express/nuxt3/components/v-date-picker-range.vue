<template>
  <div>
    <div
      class="d-flex ga-3"
      @click="select.dialog = true"
    >
      <div class="flex-grow-1">
        <v-text-field
          label="Data inicial"
          :model-value="propsDateStart"
          :readonly="true"
        />
      </div>
      <div class="flex-grow-1">
        <v-text-field
          label="Data final"
          :model-value="propsDateFinal"
          :readonly="true"
        />
      </div>
    </div>

    <v-dialog
      v-model="select.dialog"
      :close-on-content-click="false"
      width="350"
    >
      <v-date-picker
        multiple="range"
        width="100%"
        @update:model-value="
          (dates) => {
            if (dates.length <= 1) return;
            select.dateStart = dates.at(0);
            select.dateFinal = dates.at(-1);
          }
        "
      >
        <template #actions="bind">
          <v-btn
            text="Alterar"
            class="bg-primary"
            @click="
              () => {
                emit('update:dateStart', dayjs(select.dateStart).format());
                emit('update:dateFinal', dayjs(select.dateFinal).format());
                select.dialog = false;
              }
            "
          />
        </template>
      </v-date-picker>
    </v-dialog>
  </div>
</template>

<script setup>
import dayjs from "dayjs";

const props = defineProps({
  dateStart: { type: [String, Object], default: null },
  dateFinal: { type: [String, Object], default: null },
});

const emit = defineEmits(["update:dateStart", "update:dateFinal"]);

const propsDateStart = computed(() => {
  if (!props.dateStart) return null;
  return dayjs(props.dateStart).format("DD/MM/YYYY");
});

const propsDateFinal = computed(() => {
  if (!props.dateFinal) return null;
  return dayjs(props.dateFinal).format("DD/MM/YYYY");
});

const select = reactive({
  dialog: false,
  dateStart: props.dateStart,
  dateFinal: props.dateFinal,
});
</script>
