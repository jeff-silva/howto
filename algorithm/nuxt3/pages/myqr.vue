<template>
  <div>
    <v-container>
      <v-text-field
        label="Zoom"
        v-model="text.zoom"
        type="number"
        step="0.01"
        min="0.01"
      />
      <v-textarea
        label="Input"
        v-model="text.input"
      />
      <!-- <div
        v-html="text.output"
        style="display: inline-flex; flex-wrap: wrap"
      ></div> -->
      <div style="display: inline-block; border: solid 1px #000">
        <template v-for="line in text.output">
          <div style="display: flex">
            <template v-for="c in line">
              <div
                :style="`
                  width: 10px;
                  height: 10px;
                  zoom: ${text.zoom};
                  background: #${c == 0 ? '000' : 'fff'}`"
              ></div>
            </template>
          </div>
        </template>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const myqr = (content, options = {}) => {
  options = {
    char0: "0",
    char1: "1",
    break: "\n",
    ...options,
  };
  const binchars = content
    .split("")
    .map((c) => {
      return c.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join("");

  const lineSize = Math.ceil(Math.sqrt(binchars.length));
  return binchars
    .match(new RegExp(`.{${lineSize}}`, "g"))
    .map((line) => line.split(""));
};

// console.clear();
// console.log(myqr("agua mole pedra dura tanto bate ate que fura"));

const text = reactive({
  input: "",
  zoom: 1,
  output: computed(() => {
    return myqr(text.input, {
      char0: '<div style="width:5px; height:5px; background:#ffd;"></div>',
      char1: '<div style="width:5px; height:5px; background:#000;"></div>',
      break: '<div style="width:100%;"></div>',
    });
  }),
});
</script>
