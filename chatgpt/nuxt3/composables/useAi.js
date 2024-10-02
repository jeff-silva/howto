import { GoogleGenerativeAI } from "@google/generative-ai";
const app = useApp();

export default (options = {}) => {
  options = {
    appendHistory: false,
    ...options,
  };

  return reactive({
    busy: false,
    error: null,
    prompt: "",
    response: {
      candidates: [],
      usageMetadata: {
        promptTokenCount: 1,
        candidatesTokenCount: 1,
        totalTokenCount: 1,
      },
    },
    history: [options.context],
    submit() {
      return new Promise(async (resolve, reject) => {
        this.error = null;
        this.busy = true;
        try {
          // AIzaSyDC8YYFnmcybRwCPqtkfFrCDWojw-4Nbx4
          const genAI = new GoogleGenerativeAI(app.access.token);

          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(
            this.history.map((text) => text).join("\n") + `\n\n${this.prompt}`
          );
          if (options.appendHistory) {
            this.history.push(this.prompt);
            this.history.push(result.response.text());
          }
          resolve((this.response = result.response));
        } catch (err) {
          // reject(err);
          // console.log(err);
          this.error = err.message;
        }
        this.busy = false;
      });
    },
  });
};
