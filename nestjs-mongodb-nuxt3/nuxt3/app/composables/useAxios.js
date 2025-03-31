import axios from "axios";

export default (config = {}) => {
  const r = reactive({
    method: "get",
    url: "",
    data: {},
    params: {},
    headers: {},
    response: null,
    onBeforeSubmit: () => {},
    onSuccess: () => {},
    onError: () => {},
    ...config,
    busy: false,
    submit() {
      return new Promise(async (resolve, reject) => {
        r.busy = true;
        r.onBeforeSubmit({ self: r });
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
          resolve(req);
        } catch (e) {
          r.onError(e.response);
          reject(e);
        }

        r.busy = false;
      });
    },
  });

  r.onBeforeSubmit({ self: r });
  return r;
};
