<template>
  <v-dialog max-width="400">
    <template #activator="scope">
      <v-text-field
        v-model="modelValue.human"
        v-bind="$attrs"
        v-maska="{ mask: modelValue.country.mask }"
        @update:modelValue="
          (value) => {
            modelValue.number = modelValue.human.replace(/[^0-9]/g, '');
            modelValue.emitValue();
          }
        "
      >
        <template #prepend-inner>
          <v-sheet
            class="d-flex ga-2 me-2 ms-n3 px-2"
            v-bind="scope.props"
            style="cursor: pointer; overflow: hidden"
            rounded="sm"
          >
            <v-icon
              :icon="`flag:${modelValue.country.iso}-1x1`"
              size="40"
            />
            <div class="d-flex align-center text-uppercase">
              {{ modelValue.country.code }}
            </div>
          </v-sheet>
        </template>
      </v-text-field>
    </template>

    <template #default="scope">
      <v-card>
        <v-card-text class="pa-0">
          <v-text-field
            v-model="modelValue.countryFilter"
            hide-details
            label="Filtrar"
            rounded="0"
          />
          <v-list>
            <v-virtual-scroll
              max-height="400"
              :items="modelValue.getCountries()"
            >
              <template #default="scope">
                <v-list-item @click="modelValue.setCountry(scope.item.iso)">
                  <template #prepend>
                    <v-icon :icon="`flag:${scope.item.iso}-1x1`" />
                  </template>
                  {{ scope.item.code }} - {{ scope.item.name }}
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Fechar"
            class="bg-primary"
            @click="scope.isActive.value = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { vMaska } from "maska/vue";
import countries from "@/utils/country-phone-masks.js";

const props = defineProps({
  modelValue: { type: String, default: "" },
  country: { type: String, default: "br" },
});

const emit = defineEmits(["update:modelValue", "update:country"]);
const rootRef = ref(null);

const modelValue = reactive({
  countryFilter: "",
  country: {},
  number: "",
  human: "",
  emitValue() {
    const value = `${modelValue.country.code}:${modelValue.number}`;
    emit("update:modelValue", value);
  },
  setCountry(iso) {
    modelValue.country = { iso, ...(countries[iso] || {}) };
  },
  setValue(value) {
    const [code = "", number = ""] = (value || ":").split(":");
    modelValue.number = number;
    modelValue.human = number;
  },
  getCountries() {
    const countryFilter = modelValue.countryFilter.toLowerCase();
    const countriesList = Object.entries(countries)
      .map(([iso, countryData]) => {
        return { iso, ...countryData };
      })
      .filter((countryData) => {
        return JSON.stringify(countryData)
          .toLowerCase()
          .includes(countryFilter);
      });
    return modelValue.country.code
      ? [modelValue.country, ...countriesList]
      : countriesList;
  },
});

modelValue.setValue(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    if (
      rootRef.value &&
      (rootRef.value == document.activeElement ||
        rootRef.value.contains(document.activeElement))
    ) {
      return;
    }
    modelValue.setValue(value);
  }
);

modelValue.setCountry(props.country);

watch(
  () => props.country,
  (country) => {
    modelValue.setCountry(country);
  }
);
</script>
