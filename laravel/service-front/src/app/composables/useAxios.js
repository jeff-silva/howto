import axios from "axios";
import _ from "lodash";

export default (axiosOpts = {}, scopeOpts = {}) => {
  const conf = useRuntimeConfig();
  const axiosScope = reactive(
    _.merge(
      {
        method: "get",
        url: "",
        params: {},
        data: {},
        headers: {},
      },
      axiosOpts,
    ),
  );

  axiosScope.sync = (params = {}) => {
    axiosScope.url = scope.url;
    axiosScope.method = scope.method;
    axiosScope.headers = scope.headers;
    axiosScope.params = scope.params;
    axiosScope.data = scope.data;

    for (const attr in params) {
      let value = axiosScope[attr] || null;
      if (_.isPlainObject(value)) {
        value = _.merge(value, params[attr]);
      }
      axiosScope[attr] = value;
    }

    for (const attr in params) {
      let value = axiosScope[attr] || null;
      if (typeof value == "function") {
        value = value();
      }
      axiosScope[attr] = value;
    }

    if (axiosScope.url.startsWith("/api")) {
      axiosScope.url = `${conf.public.SERVICE_APP_URL}${axiosScope.url}`;
      //   const session = useSupabaseSession();
      //   if (session.value?.access_token) {
      //     console.log({ session });
      //     axiosScope.headers["Authorization"] =
      //       `Bearer ${session.value.access_token}`;
      //   }
    }
  };

  const scope = reactive({
    url: axiosScope.url,
    method: axiosScope.method,
    headers: axiosScope.headers,
    params: axiosScope.params,
    data: axiosScope.data,
    response: null,
    debounce: 1000,
    onSubmit: () => null,
    onSuccess: () => null,
    onError: () => null,
    ...scopeOpts,
    busy: false,
    error: null,
    attempt: 0,
  });

  scope.errorMessages = (field) => {
    return scope.error?.response?.data?.errors?.[field] || [];
  };

  let timeout = null;
  scope.submit = (params = {}) => {
    return new Promise(async (resolve, reject) => {
      axiosScope.sync(params);
      scope.error = null;
      scope.busy = true;

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        scope.attempt++;
        evt.dispatch("submit");

        try {
          const resp = await axios(axiosScope);
          scope.response = resp.data;
          evt.dispatch("success", resp);
          resolve(resp);
        } catch (err) {
          scope.error = err;
          evt.dispatch("error", err);
          reject(err);
        }

        scope.busy = false;
      }, scope.debounce);
    });
  };

  const evt = reactive({
    items: [],
    on(name, call) {
      if (typeof call == "function") {
        evt.items.push({ name, call });
      }
    },
    dispatch(name, ...args) {
      for (const item of evt.items) {
        if (item.name != name) continue;
        item.call(...args);
      }
    },
  });

  scope.on = evt.on;
  scope.on("submit", () => scope.onSubmit());
  scope.on("success", (resp) => scope.onSuccess(resp));
  scope.on("error", (err) => scope.onError(err));

  return scope;
};
