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
        // method: opts.method,
        // url: opts.url,
        // params: opts.params,
        // data: opts.data,
        // headers: opts.headers,
        method: r.method,
        url: r.url,
        params: r.params,
        data: r.data,
        headers: r.headers,
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
            const opts = r.axiosOptions();
            if (!opts.url) {
              reject(r.throwError("url-invalid", "Invalid URL", null));
              return;
            }
            const resp = await axios(opts);
            r.response = resp.data;
            resolve(resp);
            r.onSuccess();
          } catch (err) {
            reject(
              r.throwError(err.status, err.message, err.response?.data || null)
            );
          }

          r.busy = false;
        }, 1000);
      });
    },

    throwError(status, message, response) {
      r.error = { status, message, response };
      r.onError();
      return r.error;
    },
  });

  r.axiosOptions();
  return r;
};
