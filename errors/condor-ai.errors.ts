class CondorAIError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export { CondorAIError };
