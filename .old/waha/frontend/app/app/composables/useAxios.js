import axios from "axios";

export default (opts = {}) => {
  opts = {
    method: "get",
    url: "",
    data: {},
    params: {},
    headers: {},
    onSubmit: () => null,
    onSuccess: () => null,
    onError: () => null,
    response: null,
    ...opts,
  };

  const r = reactive({
    ...opts,

    busy: false,
    error: null,

    submit() {
      return new Promise(async (resolve, reject) => {
        const axiosParams = {
          method: opts.method,
          url: opts.url,
          data: opts.data,
          params: opts.params,
          headers: opts.headers,
        };

        for (const attr in axiosParams) {
          if (typeof axiosParams[attr] == "function") {
            axiosParams[attr] = axiosParams[attr]();
          }
        }

        r.error = null;
        r.busy = true;
        r.onSubmit();

        try {
          const response = await axios(axiosParams);
          r.response = response.data;
          r.onSuccess();
          resolve({ response });
        } catch (e) {
          r.error = e;
          r.onError();
          reject(e);
        }

        r.busy = false;
        console.log(axiosParams);
      });
    },
  });

  return r;
};
