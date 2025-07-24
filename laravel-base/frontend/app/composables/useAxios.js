import axios from "axios";

export default (opts = {}) => {
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

  const meta = reactive({
    timeout: null,
  });

  const r = reactive({
    ...opts,
    busy: false,
    error: null,

    axiosOptions() {
      const _opts = {
        method: opts.method,
        url: opts.url,
        params: opts.params,
        data: opts.data,
        headers: opts.headers,
      };

      for (const attr in _opts) {
        let value = _opts[attr];
        if (typeof value == "function") {
          value = value();
        }
        _opts[attr] = value;
      }

      if (_opts.url.startsWith("/api")) {
        _opts.url = `http://localhost:8000${_opts.url}`;
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          _opts.headers["Authorization"] = `Bearer ${access_token}`;
        }
      }

      for (const attr in _opts) {
        r[attr] = _opts[attr];
      }

      return _opts;
    },

    fieldErrors(name) {
      if (!r.error) return [];
      if (!r.error.response) return [];
      if (!r.error.response.errors) return [];
      return r?.error?.response?.errors[name] || [];
    },

    submit() {
      return new Promise(async (resolve, reject) => {
        r.axiosOptions();
        r.error = null;
        r.busy = true;
        r.onSubmit();

        if (meta.timeout) clearTimeout(meta.timeout);
        meta.timeout = setTimeout(async () => {
          try {
            const resp = await axios(r.axiosOptions());
            r.response = resp.data;
            resolve(resp);
            r.onSuccess();
          } catch (err) {
            r.error = {};
            r.error.status = err.status;
            r.error.message = err.message;
            r.error.response = err.response?.data || null;
            reject(err);
            r.onError();
          }

          r.busy = false;
        }, 1000);
      });
    },
  });

  r.axiosOptions();
  return r;
};
