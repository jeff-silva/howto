<template>
  <v-container>
    <v-btn
      text="upload"
      @click="upload.submit()"
    />
    <br />
    <br />
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="Filtrar"
          v-model="search.name"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model.number="search.page"
          type="number"
        />
      </v-col>
      <v-col cols="4">
        <v-btn
          block
          text="Buscar"
          :loading="search.busy"
          @click="search.submit()"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card title="Elenco">
          <v-card-text class="pa-0">
            <v-list>
              <template v-for="o in search.response.data.cine_cast_search.data">
                <v-list-item>
                  {{ o.name }}

                  <template #append>
                    <v-btn
                      text="Editar"
                      @click="
                        async () => {
                          cineCastDialog.edit(o.id);
                        }
                      "
                    />
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text="Criar"
              @click="cineCastDialog.edit(null)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card title="Filmes">
          <v-card-text class="pa-0">
            <v-list>
              <template
                v-for="o in search.response.data.cine_movie_search.data"
              >
                <v-list-item>
                  {{ o.name }}

                  <template #append>
                    <v-btn
                      text="Editar"
                      @click="
                        () => {
                          cineMovieDialog.edit(o.id);
                        }
                      "
                    />
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text="Criar"
              @click="cineMovieDialog.edit(null)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="cineCastDialog.value"
      max-width="600"
      scrollable
    >
      <cine-cast-edit
        :entity-id="cineCastDialog.id"
        @on-success="
          (ctx) => {
            if (ctx.action == 'save') {
              cineCastDialog.toggle(false);
              search.submit();
            }
          }
        "
      />
    </v-dialog>

    <v-dialog
      v-model="cineMovieDialog.value"
      max-width="600"
      scrollable
    >
      <cine-movie-edit
        :entity-id="cineMovieDialog.id"
        @on-success="
          (ctx) => {
            if (ctx.action == 'save') {
              cineMovieDialog.toggle(false);
              search.submit();
            }
          }
        "
      />
    </v-dialog>

    <!-- <pre>{{ search }}</pre> -->
  </v-container>
</template>

<script setup>
const cineCastDialog = useDialog({
  id: null,
  edit(id) {
    cineCastDialog.id = id;
    cineCastDialog.toggle(true);
  },
});

const cineMovieDialog = useDialog({
  id: null,
  edit(id) {
    cineMovieDialog.id = id;
    cineMovieDialog.toggle(true);
  },
});

const search = useGraphql({
  name: "",
  page: 1,
  query(self) {
    const params = [];
    if (self.page) params.push(`page: ${self.page}`);
    if (self.name) params.push(`name: "${self.name}"`);
    return `query MyQuery {
      cine_cast_search(${params.join(", ")}) {
        paginatorInfo {
          hasMorePages
          lastPage
          perPage
          total
        }
        data {
          id
          name
        }
      }

      cine_movie_search(${params.join(", ")}) {
        paginatorInfo {
          hasMorePages
          lastPage
          perPage
          total
        }
        data {
          id
          name
        }
      }
    }`;
  },
  response: {
    data: {
      cine_cast_search: {
        data: [],
      },
      cine_movie_search: {
        data: [],
      },
    },
  },
});

search.submit();

import axios from "axios";
const upload = reactive({
  async submit() {
    Object.assign(document.createElement("input"), {
      type: "file",
      multiple: true,
      async onchange(ev) {
        const formData = new FormData();

        for (const i in ev.target.files) {
          const file = ev.target.files[i];
          formData.append(`file_${i}`, file);
        }

        const resp = await axios({
          method: "post",
          url: "http://localhost:8000/api/app_file",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (p) => {
            console.log(p.loaded / p.total, p);
          },
        });

        console.clear();
        console.log(JSON.stringify(resp.data, null, 2));
      },
    }).click();
  },
});
</script>
