<template>
  <div>
    <!-- Cast view -->
    <div v-if="!props.cineCastId && props.cineMovieId">
      <v-list>
        <template v-for="o in search.response.data.cine_movie_cast_search.data">
          <v-list-item>
            <div>{{ o.cine_cast.name }} - {{ o.name }}</div>
          </v-list-item>
        </template>
      </v-list>
    </div>

    <!-- Movies view -->
    <div
      v-if="
        props.cineCastId &&
        !props.cineMovieId &&
        search.response.data.cine_movie_cast_search.data.length
      "
    >
      <v-list elevation="4">
        <template v-for="o in search.response.data.cine_movie_cast_search.data">
          <v-list-item>
            <div>{{ o.name }} em {{ o.cine_movie.name }}</div>
          </v-list-item>
        </template>
      </v-list>
      <br />
    </div>

    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="cineMovieCast.data.name"
          label="Cargo"
        />
      </v-col>
      <v-col
        v-if="
          search.response.data.cine_movie_search &&
          search.response.data.cine_movie_search.data.length
        "
        cols="4"
      >
        <v-autocomplete
          v-model="cineMovieCast.data.cine_movie_id"
          label="Filme"
          :items="search.response.data.cine_movie_search.data"
          item-value="id"
          item-title="name"
        />
      </v-col>
      <v-col
        v-if="
          search.response.data.cine_cast_search &&
          search.response.data.cine_cast_search.data.length
        "
        cols="4"
      >
        <v-autocomplete
          v-model="cineMovieCast.data.cine_cast_id"
          label="Ator"
          :items="search.response.data.cine_cast_search.data"
          item-value="id"
          item-title="name"
        />
      </v-col>
      <v-col cols="4">
        <v-btn
          block
          text="Inserir"
          :loading="cineMovieCast.busy"
          @click="cineMovieCast.save()"
        />
      </v-col>
    </v-row>

    <!-- <pre>{{ props }}</pre> -->
    <!-- <pre>{{ cineMovieCast }}</pre> -->
    <!-- <pre>{{ search }}</pre> -->
  </div>
</template>

<script setup>
const props = defineProps({
  cineCastId: { type: String, default: null },
  cineMovieId: { type: String, default: null },
});

const cineMovieCast = useCrud({
  entity: "cine_movie_cast",
  data: {
    cine_cast_id: props.cineCastId,
    cine_movie_id: props.cineMovieId,
  },
  init() {
    cineMovieCast.data = {
      cine_cast_id: props.cineCastId,
      cine_movie_id: props.cineMovieId,
    };
  },
  async onSuccess(ctx) {
    if (ctx.action == "save") {
      await search.submit();
      cineMovieCast.init();
    }
  },
});

const search = useGraphql({
  cineCastId: props.cineCastId,
  cineMovieId: props.cineMovieId,
  init() {
    search.cineCastId = props.cineCastId;
    search.cineMovieId = props.cineMovieId;
  },
  query() {
    let params = [];

    if (search.cineCastId) {
      params.push(`cine_cast_id: "${search.cineCastId}"`);
    }

    if (search.cineMovieId) {
      params.push(`cine_movie_id: "${search.cineMovieId}"`);
    }

    params = params.length ? `(${params.join(", ")})` : "";

    let query = `query MyQuery {
      cine_movie_cast_search${params} {
        data {
          id
          name
          cine_cast {
            id
            name
            slug
          }
          cine_movie {
            id
            name
            slug
          }
        }
      }
    `;

    if (search.cineCastId) {
      query += `
        cine_movie_search(first: 99) {
          data { id name }
        }
      `;
    }

    if (search.cineMovieId) {
      query += `
        cine_cast_search(first: 99) {
          data { id name }
        }
      `;
    }

    query += "}";

    return query;
  },
  response: {
    data: {
      cine_movie_cast_search: {
        data: [],
      },
      cine_movie_search: {
        data: [],
      },
      cine_cast_search: {
        data: [],
      },
    },
  },
});

search.init();
search.submit();
</script>
