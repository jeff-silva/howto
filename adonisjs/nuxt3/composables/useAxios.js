import axios from "axios";
import { reactive } from "vue";

export default (options = {}) => {
  if (options.url.startsWith("api://")) {
    options.url = options.url.replace("api://", "http://localhost:3333/");
  }

  const r = reactive({
    busy: false,
    url: "",
    method: "get",
    params: {},
    data: {},
    headers: {},
    response: null,
    onSuccess: () => null,
    onError: () => null,
    ...options,
    error: null,
    async submit() {
      r.busy = true;
      r.error = null;

      let fetchOptions = {
        url: r.url,
        method: r.method || "get",
        params: r.params || {},
        headers: r.headers || {},
      };

      if (["post", "put"].includes(fetchOptions.method)) {
        fetchOptions.data = r.data;
      }

      try {
        const resp = await axios(fetchOptions);
        r.response = resp.data;
        r.onSuccess(r.response);
      } catch (err) {
        r.error = {
          name: err.name,
          status: err.status,
          message: err.message,
          response: err.response,
        };
        r.onError(r.error);
      }

      r.busy = false;
    },
  });

  return r;
};
