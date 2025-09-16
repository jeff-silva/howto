<template>
  <div>
    <v-text-field
      v-bind="$attrs"
      v-model="address.value.name"
      readonly
      @click="dialog.toggle()"
    />

    <v-dialog
      v-model="dialog.show"
      max-width="700"
      scrollable
    >
      <v-defaults-provider :defaults="{ VTextField: { hideDetails: true } }">
        <v-card title="Endereço">
          <v-card-text class="pa-0">
            <v-map
              ref="mapRef"
              style="height: 250px"
              :options="{
                lat: address.value.lat || 0,
                lng: address.value.lng || 0,
                zoom: $props.zoom,
              }"
              @ready="
                ({ L, map }) => {
                  mainMap.map = map;

                  mainMap.marker = L.marker(
                    [address.value.lat || 0, address.value.lng || 0],
                    {
                      draggable: true,
                    }
                  ).addTo(map);

                  map.on('click', (ev) => {
                    mainMap.marker.setLatLng(ev.latlng);
                    nominatimReverse.find(ev.latlng.lat, ev.latlng.lng);
                  });

                  mainMap.marker.on('dragend', (ev) => {
                    const latlng = ev.target.getLatLng();
                    nominatimReverse.find(latlng.lat, latlng.lng);
                  });
                }
              "
            />

            <div class="pa-4">
              <v-text-field
                label="Buscar Endereço"
                v-model="nominatimSearch.params.q"
                :append-inner-icon="address.busy ? 'app:loading' : 'app:search'"
                @input="nominatimSearch.submit()"
                @click="view.set('search')"
              />

              <template v-if="view.value == 'search'">
                <v-list
                  elevation="5"
                  v-if="nominatimSearch.items.length > 0"
                >
                  <template v-for="o in nominatimSearch.items">
                    <v-list-item
                      @click="
                        () => {
                          address.set(o);
                          view.set('edit');
                          mainMap.map.panTo([o.lat, o.lng]);
                          mainMap.marker.setLatLng([o.lat, o.lng]);
                        }
                      "
                    >
                      {{ o.name }}
                    </v-list-item>
                  </template>
                </v-list>
              </template>
              <br />

              <template v-if="view.value == 'edit'">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Rua"
                      v-model="address.value.route"
                      @input="address.emit()"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Número"
                      v-model="address.value.number"
                      @input="address.emit()"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="CEP"
                      v-model="address.value.zipcode"
                      @input="address.emit()"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Complemento"
                      v-model="address.value.complement"
                      @input="address.emit()"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="Bairro"
                      v-model="address.value.neighborhood"
                      @input="address.emit()"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Cidade"
                      v-model="address.value.city"
                      @input="address.emit()"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Estado"
                      v-model="address.value.state"
                      @input="address.emit()"
                    />
                  </v-col>
                </v-row>
              </template>

              <!-- <pre>{{ { address } }}</pre> -->
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Ok"
              @click="
                () => {
                  view.set('edit');
                  dialog.toggle();
                }
              "
            />
          </v-card-actions>
        </v-card>
      </v-defaults-provider>
    </v-dialog>
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  zoom: { type: Number, default: 16 },
});

const $emit = defineEmits(["update:modelValue"]);

const nominatimSearch = useAxios({
  method: "get",
  url: "https://nominatim.openstreetmap.org/search",
  params: { format: "json", q: null, limit: 10, addressdetails: 1 },
  response: [],
  items: computed(() => {
    return nominatimSearch.response.map(address.nominatimToAddress);
  }),
  onBeforeSubmit() {
    address.busy = true;
  },
  onSuccess() {
    address.busy = false;
  },
  onError() {
    address.busy = false;
  },
});

const nominatimReverse = useAxios({
  method: "get",
  url: "https://nominatim.openstreetmap.org/reverse",
  params: { format: "json", addressdetails: 1, lat: null, lon: null },
  async find(lat, lng) {
    nominatimReverse.params.lat = lat;
    nominatimReverse.params.lon = lng;
    const resp = await nominatimReverse.submit();
    address.set(address.nominatimToAddress(resp.data));
  },
  onBeforeSubmit() {
    address.busy = true;
  },
  onSuccess() {
    address.busy = false;
  },
  onError() {
    address.busy = false;
  },
});

const mapRef = ref(null);
const address = reactive({
  busy: false,
  value: $props.modelValue,
  emit() {
    address.value = address.addressFormat(address.value);
    $emit("update:modelValue", address.value);
  },
  set(value) {
    address.value = value;
    address.emit();
  },
  nominatimToAddress(data) {
    let [country = null, state = null] = (
      data.address["ISO3166-2-lvl4"] || "-"
    ).split("-");
    country = country.toLowerCase();
    state = state.toLowerCase();

    let addr = {
      name: "",
      route: data.address.road || data.address.route || null,
      number: "",
      complement: "",
      zipcode: data.address.postcode || null,
      neighborhood:
        data.address.neighbourhood ||
        data.address.neighborhood ||
        data.address.suburb ||
        null,
      city:
        data.address.city ||
        data.address.city_district ||
        data.address.town ||
        data.address.municipality ||
        null,
      city_code: "",
      state: data.address.state || null,
      state_code: state,
      country: data.address.country || null,
      country_code: country || data.address.country_code || null,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
    };

    return address.addressFormat(addr);
  },
  addressFormat(addr) {
    if (!addr) return {};
    let name = [];
    if (addr.route) name.push(addr.route);
    if (addr.number) name.push(`Nº ${addr.number}`);
    if (addr.neighborhood) name.push(addr.neighborhood);
    if (addr.city) name.push(addr.city);
    if (addr.state && addr.country_code)
      name.push(addr.state + "/" + addr.country_code.toUpperCase());
    // if (addr.country) name.push(addr.country);
    addr.name = name.join(", ");

    addr.city_code = null;
    if (addr.country_code && addr.state_code && addr.city) {
      addr.city_code =
        addr.country_code +
        "-" +
        addr.state_code +
        "-" +
        addr.city
          .toString()
          .toLowerCase()
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
          .replace(/--+/g, "-");
    }

    addr.lat = parseFloat(addr.lat);
    addr.lng = parseFloat(addr.lng);
    return addr;
  },
});

const dialog = reactive({
  show: false,
  toggle(value = null) {
    dialog.show = value === null ? !dialog.show : value;
    nominatimSearch.params.q = null;
  },
});

const mainMap = {
  map: null,
  marker: null,
};

const view = reactive({
  value: "edit",
  set(value) {
    view.value = value;
  },
});

watch(
  () => $props.modelValue,
  (modelValueNew) => {
    if (modelValueNew !== null && typeof modelValueNew == "object") {
      address.value = address.addressFormat(modelValueNew);
    }
  }
);
</script>
