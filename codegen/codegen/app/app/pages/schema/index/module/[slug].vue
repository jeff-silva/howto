<template>
  <div>
    <v-text-field
      label="Nome"
      v-model="mod.name"
    />
    <v-text-field
      label="Versão"
      v-model="mod.version"
    />
    <v-textarea
      label="Descrição"
      v-model="mod.description"
    />

    <v-card subtitle="Entidades">
      <v-card-text>
        <v-ext-table
          :items="entity.items"
          :headers="[{ key: 'attr', title: 'Atributos' }]"
        >
          <template #item.attr="scope">
            <v-text-field
              v-model="scope.item.attr"
              density="compact"
              hide-details
              @input="entity.save()"
            />
          </template>
        </v-ext-table>
        <!-- <pre>{{ entity }}</pre> -->
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-ext-form-actions
          :actions="[
            {
              text: 'Inserir',
              class: 'bg-primary',
              onClick() {
                entity.add({ attr: '', data: {} });
              },
            },
          ]"
        />
      </v-card-actions>
    </v-card>
    <br />

    <v-card subtitle="Endpoints">
      <v-card-text>
        <v-ext-table :items="endpoint.items" />
        <!-- <pre>{{ endpoint }}</pre> -->
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-ext-form-actions :actions="[{ text: 'Inserir' }]" />
      </v-card-actions>
    </v-card>

    <pre>{{ mod }}</pre>
  </div>
</template>

<script setup>
import _ from "lodash";
const route = useRoute();
const project = useProject();
const mod = _.get(project.data, `module.${route.params.slug}`);

const entity = project.jsonItems(`module.${route.params.slug}.entity`);
const endpoint = project.jsonItems(`module.${route.params.slug}.endpoint`);
</script>
