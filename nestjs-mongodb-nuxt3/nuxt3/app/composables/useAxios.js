import axios from "axios";

export default (config = {}) => {
  const r = reactive({
    method: "get",
    url: "",
    data: {},
    params: {},
    headers: {},
    response: null,
    onSuccess: () => {},
    onError: () => {},
    ...config,
    busy: false,
    submit() {
      return new Promise(async (resolve, reject) => {
        r.busy = true;
        r.sync();
        try {
          const req = await axios({
            method: r.method,
            url: r.url,
            data: r.data,
            params: r.params,
            headers: r.headers,
          });
          r.response = req.data;
          r.onSuccess(req);
        } catch (e) {
          r.onError(e.response);
        }
        resolve(req);
        r.busy = false;
      });
    },
    sync() {
      let defaults = {
        method: "get",
        url: "",
        data: {},
        params: {},
        headers: {},
      };

      for (let attr in defaults) {
        if (typeof config[attr] == "undefined") continue;
        if (["url", "data", "params"].includes(attr)) continue;
        r[attr] = config[attr];
      }

      for (let attr in defaults) {
        if (typeof r[attr] == "function") {
          r[attr] = r[attr](r);
        }
      }

      let axiosConf = {};
      for (let attr in defaults) {
        axiosConf[attr] = r[attr];
      }

      axios.interceptors.request.handlers.map((item) => {
        axiosConf = item.fulfilled(axiosConf);
      });

      for (let attr in axiosConf) {
        r[attr] = axiosConf[attr];
      }
    },
  });

  r.sync();

  return r;
};
