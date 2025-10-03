<template>
  <v-container>
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
                <v-list-item>{{ o.name }}</v-list-item>
              </template>
            </v-list>
          </v-card-text>
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
                <v-list-item>{{ o.name }}</v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>
    <pre>{{ search }}</pre>
  </v-container>
</template>

<script setup>
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
</script>
