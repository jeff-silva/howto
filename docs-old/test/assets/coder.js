const coder = {
  encode(data, opts = {}) {
    opts = {
      chunkSize: 50,
      ...opts,
    };
    data = JSON.stringify(data, (key, value) => {
      if (typeof value == "function") {
        value = value.toString();
        const args = (value.match(/\((.+?)\)/gm) || []).at(0);
        const body = value.replace(/^.+{/g, "{");
        return `function:${args} => ${body}`;
      }
      return value;
    });
    data = btoa(data);

    let chunks = [];
    const cs = opts.chunkSize;
    for (let i = 0, dataLen = data.length; i < dataLen; i += cs) {
      chunks.push(data.substring(i, i + cs));
    }

    return chunks;
  },
  decode(data) {
    const deepParser = (data) => {
      for (let i in data) {
        let value = data[i];
        if (typeof value == "string" && value.startsWith("function:")) {
          value = value.replace(/function:+/g, "");
          value = eval(value);
        } else if (typeof value == "object") {
          value = deepParser(value);
        }
        data[i] = value;
      }
      return data;
    };
    data = data.join("");
    data = atob(data);
    data = JSON.parse(data);
    data = deepParser(data);
    return data;
  },
};
