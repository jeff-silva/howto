import { createClient } from "@supabase/supabase-js";

export default () => {
  const supabase = createClient("http://supabase.moviedb.localhost", "xxx");

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

    console.log({ data, count });
    if (error) return { data: [], count: 0 };
    return { data, count };
  };

  return scope;
};
