import axios from "axios";

export default (opts = {}) => {
  opts = {
    response: { data: {} },
    query: (self) => `{}`,
    ...opts,
  };

  const meta = {
    timeout: null,
  };

  const r = reactive({
    ...opts,

    busy: false,
    error: null,

    submit() {
      return new Promise(async (resolve, reject) => {
        r.error = null;
        r.busy = true;

        if (meta.timeout) clearTimeout(meta.timeout);
        meta.timeout = setTimeout(async () => {
          try {
            const query = await r.query(r);
            const variables = {};
            const response = await axios({
              method: "post",
              url: "http://localhost:8000/graphql",
              data: { query, variables },
            });
            r.response = response.data;
            resolve({ ...r, query, variables });
          } catch (e) {
            r.error = e;
          }

          r.busy = false;
        }, 1000);
      });
    },
  });

  return r;
};
