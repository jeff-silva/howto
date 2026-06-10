(() => {
  axios.interceptors.request.use((config) => {
    if (config.cache == true) {
      config.cacheKey =
        config.url +
        "#" +
        JSON.stringify({
          method: config.method,
          headers: config.headers,
          params: config.params,
          data: config.data,
        });
      const cachedData = localStorage.getItem(config.cacheKey);
      if (cachedData) {
        config.adapter = async (cfg) => {
          return JSON.parse(cachedData);
        };
      }
    }
    return config;
  });

  axios.interceptors.response.use((response) => {
    if (response.config.cache) {
      if (response.status.toString().startsWith("2")) {
        localStorage.setItem(
          response.config.cacheKey,
          JSON.stringify(response)
        );
      }
    }

    const cachedData = localStorage.getItem(response.config.cacheKey);
    if (cachedData) {
      response.data = JSON.parse(cachedData).data;
      response.cached = true;
    }

    return response;
  });
})();
