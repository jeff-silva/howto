import { createClient } from "@supabase/supabase-js";

export default () => {
  const conf = useRuntimeConfig();
  const supabase = createClient(
    conf.public.SERVICE_SUPABASE_URL,
    conf.public.SERVICE_SUPABASE_ANON_KEY,
  );

  const scope = reactive({
    //
  });

  scope.movieSearch = async (params = {}) => {
    params = {
      page: 1,
      per_page: 10,
      ...params,
    };

    const from = (params.page - 1) * params.per_page;
    const to = from + params.per_page - 1;

    const { data, error, count } = await supabase
      .from("mdb_movie")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) return { data: [], count: 0 };
    return { data, count };
  };

  return scope;
};
