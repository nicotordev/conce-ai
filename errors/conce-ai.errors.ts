class ConceAIError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export { ConceAIError };
