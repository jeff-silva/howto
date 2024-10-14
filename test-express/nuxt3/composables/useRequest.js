export default (options = {}) => {
  // const parseOptions = (options = {}) => {
  //   options = {
  //     method: "get",
  //     url: "",
  //     params: {},
  //     data: {},
  //     headers: {},
  //     response: null,
  //     onBeforeRequest: (resp) => null,
  //     onSuccess: (resp) => null,
  //     onError: (error) => null,
  //     ...options,
  //   };

  //   let options2 = {};
  //   for (let attr in options) {
  //     let value = options[attr];
  //     if (["method", "url", "params", "data"].includes(attr)) {
  //       if (typeof value == "function") {
  //         value = value();
  //       }
  //     }

  //     options2[attr] = value;
  //   }

  //   const u = new URL(options2.url);
  //   console.log(u);
  //   if (Array.from(u.searchParams.keys()).length > 0) {
  //     options2.params = Object.assign(
  //       Object.fromEntries(
  //         Array.from(u.searchParams.keys()).map((name, index) => {
  //           return [name, u.searchParams.get(name)];
  //         })
  //       ),
  //       options2.params
  //     );

  //     options2.url = u.href.replace(
  //       u.search,
  //       "?" + new URLSearchParams(options2.params).toString()
  //     );
  //   }

  //   return options2;
  // };

  // const options = parseOptions(optionsParams);

  options = {
    method: "get",
    url: "",
    params: {},
    data: {},
    headers: {},
    response: null,
    onBeforeRequest: (resp) => null,
    onSuccess: (resp) => null,
    onError: (error) => null,
    ...options,
  };

  const u = new URL(options.url);
  const params2 = Object.fromEntries(
    Array.from(u.searchParams.keys()).map((name, index) => {
      return [name, u.searchParams.get(name)];
    })
  );

  options.params = { ...params2, ...options.params };
  options.headers["Accept"] = "application/json";
  options.headers["Content-Type"] = "application/json";

  const r = reactive({
    ...options,
    busy: false,
    error: null,

    errorField(name) {
      if (r.error === null) return [];
      if (typeof r.error.errors[name] == "undefined") return [];
      return r.error.errors[name];
    },

    errorClear() {
      r.error = null;
    },

    submit() {
      return new Promise(async (resolve, reject) => {
        r.errorClear();
        r.error = null;
        r.busy = true;
        r.method = r.method.toUpperCase();

        r.onBeforeRequest();

        let fetchOpts = {
          method: r.method,
          headers: r.headers,
        };

        if (["POST", "PUT"].includes(r.method)) {
          fetchOpts.body = JSON.stringify(r.data);
        }

        let url = r.url;
        if (["GET"].includes(r.method)) {
          const queryString = "?" + new URLSearchParams(r.params).toString();
          url = u.href + queryString;
          if (u.search) {
            url = u.href.replace(u.search, queryString);
          }
        }

        const resp = await fetch(url, fetchOpts);

        if (resp.status >= 200 && resp.status <= 299) {
          r.response = await resp.json();
          r.onSuccess(r.response);
          resolve(r.response);
        } else {
          r.error = await resp.json();
          r.onError(r.error);
          reject(r.error);
        }

        r.busy = false;
      });
    },
  });

  return r;
};
