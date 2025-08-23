import axios from "axios";

export default (opts = {}) => {
  const conf = useRuntimeConfig();

  const tokens = {
    "https://openrouter.ai": conf.public.OPENROUTER_KEY,
  };

  opts = {
    method: "get",
    url: "",
    params: {},
    data: {},
    headers: {},
    response: null,
    onSubmit: () => null,
    onSuccess: () => null,
    onError: () => null,
    ...opts,
  };

  const r = reactive({
    ...opts,
    busy: false,

    async submit() {
      r.busy = true;
      r.onSubmit();
      try {
        const axiosOpts = r.axiosOpts();
        const resp = await axios(axiosOpts);
        r.response = resp.data;
        r.onSuccess(r.response);
      } catch (err) {
        r.onError();
      }
      r.busy = false;
    },

    axiosOpts() {
      const opts = {
        method: r.method,
        url: r.url,
        params: r.params,
        data: r.data,
        headers: r.headers,
      };

      for (const attr in opts) {
        const value = opts[attr];
        if (typeof value == "function") {
          value = value();
        }
        opts[attr] = value;
      }

      for (const prefix in tokens) {
        const token = tokens[prefix];
        if (opts.url.startsWith(prefix)) {
          opts.headers[`Authorization`] = `Bearer ${token}`;
        }
      }

      return opts;
    },
  });

  return r;
};
