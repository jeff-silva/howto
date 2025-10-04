import _ from "lodash";
import axios from "axios";

export default (opts = {}) => {
  const r = reactive(
    _.merge(
      {
        entity: "",
        fields: ["id"],
        data: {},
        selectGraphql: () => "{ id }",
        onSubmit: () => null,
        onSuccess: () => null,
        onError: () => null,
      },
      opts,
      {
        busy: false,
        status: null,

        fill(data = {}) {
          r.data = _.merge(r.data, data);
        },

        set(data = {}) {
          r.data = data;
        },

        async select(id) {
          r.busy = true;
          r.status = "select";

          let query = await r.selectGraphql();
          query = `query MyQuery { ${r.entity}(id: "${id}") ${query} }`;

          const axiosParams = {
            method: "post",
            url: `http://localhost:8000/graphql`,
            data: {
              variables: {},
              query,
            },
          };

          try {
            const response = await axios(axiosParams);
            r.data = response.data.data[r.entity] || {};
            r.onSuccess({ action: "select", ...r, response });
          } catch (error) {
            r.onError({ ...r, error });
          }

          r.busy = false;
          r.status = null;
        },

        async save() {
          r.busy = true;
          r.status = "save";

          const axiosParams = {
            method: "post",
            url: `http://localhost:8000/api/${r.entity}`,
            data: r.data,
            headers: {},
          };

          if (r.data.id) {
            axiosParams.method = "put";
            axiosParams.url += `/${r.data.id}`;
          }

          try {
            const response = await axios(axiosParams);
            r.onSuccess({ action: "save", ...r, response });
          } catch (error) {
            r.onError({ ...r, error });
          }

          r.busy = false;
          r.status = null;
        },

        async delete() {},
      }
    )
  );

  return r;
};
