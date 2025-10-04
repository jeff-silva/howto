import _ from "lodash";

export default (opts = {}) => {
  const r = reactive(
    _.merge(
      {
        value: false,
        onOpen: () => null,
        onClose: () => null,
      },
      opts,
      {
        toggle(value = null) {
          r.value = value === null ? !r.value : value;
        },
      }
    )
  );

  watch(
    () => r.value,
    (value) => {
      value ? r.onOpen() : r.onClose();
    }
  );

  return r;
};
