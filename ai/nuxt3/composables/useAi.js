import { GoogleGenerativeAI } from "@google/generative-ai";
const app = useApp();

export default (options = {}) => {
  options = {
    model: "gemini-1.5-flash",
    appendHistory: false,
    context: "",
    ...options,
  };

  return reactive({
    options,
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

    history: [],

    historyClear() {
      this.history = [];
    },

    contextUpdate(context) {
      this.options.context = context;
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
          const genAI = new GoogleGenerativeAI(app.access.token);

          const model = genAI.getGenerativeModel({ model: options.model });

          const history = this.history.map((text) => text).join("\n");
          const result = await model.generateContent(
            [this.options.context, history, this.prompt]
              .filter((v) => !!v)
              .join("\n---\n")
          );

          if (options.appendHistory) {
            this.history.push(this.prompt);
            this.history.push(result.response.text());
          }

          resolve((this.response = result.response));
        } catch (err) {
          this.error = err.message;
        }

        this.busy = false;
      });
    },
  });
};
