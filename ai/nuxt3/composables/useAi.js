import { GoogleGenerativeAI } from "@google/generative-ai";

export default (options = {}) => {
  const app = useApp();

  const optionsDefault = (merge = {}) => {
    return {
      token: app.access.token,
      model: "gemini-1.5-flash",
      appendHistory: false,
      context: "",
      prompt: "",
      ...merge,
    };
  };

  options = optionsDefault(options);

  return reactive({
    options,
    busy: false,
    error: null,
    prompt: options.prompt,
    response: {
      candidates: [],
      usageMetadata: {
        promptTokenCount: 1,
        candidatesTokenCount: 1,
        totalTokenCount: 1,
      },
    },

    history: [],

    historyClear() {
      this.history = [];
    },

    contextUpdate(context) {
      this.options.context = context;
    },

    async getResponse(prompt, options = {}) {
      options = optionsDefault(options);

      const genAI = new GoogleGenerativeAI(app.access.token);
      const model = genAI.getGenerativeModel({ model: this.options.model });

      const history = this.history.map((text) => text).join("\n");
      const result = await model.generateContent(
        [options.context, history, prompt].filter((v) => !!v).join("\n---\n")
      );

      if (this.options.appendHistory) {
        this.history.push(this.prompt);
        this.history.push(result.response.text());
      }

      return result;
    },

    submit() {
      return new Promise(async (resolve, reject) => {
        if (!this.prompt) {
          this.error = "Digite alguma pergunta";
          return;
        }

        this.error = null;
        this.busy = true;

        try {
          this.response = await this.getResponse(this.prompt, this.options);
          resolve(this.response);
        } catch (err) {
          this.error = err.message;
        }

        this.busy = false;
      });
    },
  });
};
