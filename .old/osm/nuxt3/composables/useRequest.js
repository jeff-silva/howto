export default (options = {}) => {
  const _call = async (call, ...args) => {
    return await call(...args);
  };

  const r = reactive({
    url: "",
    method: "get",
    data: {},
    params: {},
    headers: {},
    error: null,
    response: null,
    onBeforeRequest: () => null,
    onSuccess: () => null,
    onError: () => null,
    ...options,
    busy: false,

    parseOptions: async () => {
      let attrs = ["url", "method", "params", "data", "headers"];
      for (let attr in attrs) {
        attr = attrs[attr];
        if (typeof options[attr] == "function") {
          r[attr] = await options[attr]();
        }

        if (r[attr] !== null && typeof r[attr] == "object") {
          for (let attr2 in r[attr]) {
            if (typeof r[attr][attr2] == "function") {
              r[attr][attr2] = await r[attr][attr2]();
            }
          }
        }
      }

      r.method = r.method.toLocaleLowerCase();
    },

    async submit() {
      await r.parseOptions();
      r.onBeforeRequest();
      r.busy = true;

      const resp = await $fetch(r.url, {
        headers: r.headers,
        method: r.method,
        params: r.params,
        body: ["get", "head"].includes(r.method) ? undefined : r.data,
      });

      r.response = resp;
      r.busy = false;
    },
  });

  r.parseOptions();

  return r;
};
