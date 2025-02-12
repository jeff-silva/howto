import axios from "axios";
import { reactive } from "vue";

class Error {
  status = "";
  message = "";
  field = {};
  load(ex) {
    this.status = ex.status;
    this.message = ex.message;
    this.field = {};
    if (ex.response) {
      ex.response.data.errors.map((err) => {
        this.field[err.field] = this.field[err.field] || [];
        this.field[err.field].push(err.message);
      });
    }
  }
  clear() {
    this.status = null;
    this.message = "";
    this.field = {};
  }
  getField(name) {
    if (!this.field[name]) return [];
    return this.field[name] || [];
  }
}

export default (options = {}) => {
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
    error: new Error(),
    init() {
      if (r.url.startsWith("api://")) {
        r.url = r.url.replace("api://", "http://localhost:3333/");
      }
    },
    async submit() {
      r.init();
      r.busy = true;
      r.error.clear();

      let fetchOptions = {
        url: r.url,
        method: r.method || "get",
        params: r.params || {},
        headers: r.headers || {},
      };

      const hasUpload =
        Object.values(r.data).filter((value) => value instanceof File).length >
        0;

      if (["post", "put"].includes(fetchOptions.method)) {
        if (hasUpload) {
          const formData = new FormData();
          for (let i in r.data) {
            formData.append(i, r.data[i]);
          }
          fetchOptions.data = formData;
          fetchOptions.headers["Content-Type"] = "multipart/form-data";
        } else {
          fetchOptions.data = r.data;
        }
      }

      try {
        const resp = await axios(fetchOptions);
        r.response = resp.data;
        r.onSuccess(r.response);
      } catch (err) {
        // r.error = {
        //   name: err.name,
        //   status: err.status,
        //   message: err.message,
        //   response: err.response,
        // };
        r.error.load(err);
        r.onError(r.error);
      }

      r.busy = false;
    },
  });

  r.init();
  return r;
};
