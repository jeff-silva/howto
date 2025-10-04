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
    <div v-if="props.cineCastId && !props.cineMovieId">
      <v-list>
        <template v-for="o in search.response.data.cine_movie_cast_search.data">
          <v-list-item>
            <div>{{ o.name }} em {{ o.cine_movie.name }}</div>
          </v-list-item>
        </template>
      </v-list>
    </div>

    <!-- <pre>{{ props }}</pre> -->
    <!-- <pre>{{ search.response.data.cine_movie_cast_search.data }}</pre> -->
  </div>
</template>

<script setup>
const props = defineProps({
  cineCastId: { type: String, default: null },
  cineMovieId: { type: String, default: null },
});

const search = useGraphql({
  cineCastId: props.cineCastId,
  cineMovieId: props.cineMovieId,
  query() {
    let params = [];
    if (search.cineCastId) params.push(`cine_cast_id: "${search.cineCastId}"`);
    if (search.cineMovieId)
      params.push(`cine_movie_id: "${search.cineMovieId}"`);
    params = params.length ? `(${params.join(", ")})` : "";

    return `query MyQuery {
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
    }`;
  },
  response: {
    data: {
      cine_movie_cast_search: {
        data: [],
      },
    },
  },
});

search.submit();
</script>
