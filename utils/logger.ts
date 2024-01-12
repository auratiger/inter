import pino from "pino";

export default pino({
  level: "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => bindings,
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});
