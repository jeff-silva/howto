export default (optionsParams = {}) => {
  const parseOptions = (options = {}) => {
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

    let options2 = {};
    for (let attr in options) {
      let value = options[attr];
      if (["method", "url", "params", "data"].includes(attr)) {
        if (typeof value == "undefined") {
          value = value();
        }
      }

      options2[attr] = value;
    }

    const u = new URL(options2.url);
    if (Array.from(u.searchParams.keys()).length > 0) {
      options2.params = Object.assign(
        Object.fromEntries(
          Array.from(u.searchParams.keys()).map((name, index) => {
            return [name, u.searchParams.get(name)];
          })
        ),
        options2.params
      );

      options2.url = u.href.replace(
        u.search,
        "?" + new URLSearchParams(options2.params).toString()
      );
    }

    return options2;
  };

  const options = parseOptions(optionsParams);

  return reactive({
    busy: false,
    method: options.method,
    url: options.url,
    params: options.params,
    data: options.data,
    response: options.response,
    error: null,

    submit() {
      return new Promise(async (resolve, reject) => {
        this.error = null;
        this.busy = true;

        const options = parseOptions({
          ...optionsParams,
          method: this.method,
          url: this.url,
          params: this.params,
          data: this.data,
        });

        this.url = options.url;
        options.onBeforeRequest();

        try {
          const resp = await fetch(this.url, {
            method: options.method.toUpperCase(),
            body: ["get"].includes(options.method)
              ? undefined
              : JSON.stringify(this.data),
          });

          this.response = await resp.json();
          options.onSuccess(this.response);
          resolve(this.response);
        } catch (err) {
          this.error = {
            code: null,
            message: err.message,
          };
          options.onError(this.error);
          reject(this.response);
        }

        this.busy = false;
      });
    },
  });
};
