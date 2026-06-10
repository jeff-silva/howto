<template>
  <div>
    <v-container>
      <v-text-field v-model="heisenberg.name">
        <template #append-inner>
          <v-btn
            color="primary"
            @loading="heisenberg.busy"
            @click="heisenberg.sayMyName()"
          >
            Say my name
          </v-btn>
        </template>
      </v-text-field>

      <v-fade-transition>
        <v-alert
          v-if="heisenberg.response && !heisenberg.busy"
          :type="heisenberg.success ? 'success' : 'error'"
        >
          {{ heisenberg.response }}
        </v-alert>
      </v-fade-transition>
    </v-container>
  </div>
</template>

<script setup lang="ts">
class Heisenberg {
  busy: boolean = false;
  success: boolean = false;
  name: string = "";
  response: string = "";

  sayMyName(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.busy = true;
      this.success = false;
      this.response = "";

      if (!this.name) {
        this.busy = false;
        resolve("");
        return;
      }

      setTimeout(() => {
        let response = "WTF?";

        if ("heisenberg" == this.name.toLowerCase()) {
          this.success = true;
          response = "You damn right";
        }

        this.busy = false;
        this.response = response;
        resolve(response);
      }, 1000);
    });
  }
}

const heisenberg = reactive(new Heisenberg());
</script>
