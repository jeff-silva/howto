export default (config = {}) => {
  config = {
    content: "",
    suggestedName: undefined,
    types: [],
    ...config,
  };

  const meta = reactive({
    handle: null,
    event: {
      items: [],
      on(evt, call) {
        meta.event.items.push({ evt, call });
      },
      dispatch(evt) {
        meta.event.items.map((item) => {
          if (item.evt != evt) return;
          item.call();
        });
      },
    },
  });

  const r = reactive({
    content: config.content,

    async open() {
      if (!meta.handle) {
        const [handle] = await window.showOpenFilePicker({
          types: config.types,
        });
        meta.handle = handle;
      }

      try {
        const file = await meta.handle.getFile();
        r.content = await file.text();
        r.dispatch("open", { file });
      } catch (err) {}
    },

    async save() {
      if (!meta.handle) {
        meta.handle = await window.showSaveFilePicker({
          suggestedName: config.suggestedName,
          types: config.types,
        });
      }

      const writable = await meta.handle.createWritable();
      await writable.write(r.content);
      await writable.close();
      r.dispatch("save", {});
    },

    on(...args) {
      meta.event.on(...args);
    },

    dispatch(...args) {
      meta.event.dispatch(...args);
    },
  });
  return r;
};
