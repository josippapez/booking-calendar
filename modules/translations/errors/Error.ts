export class TranslationFileNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranslationFileNotFoundError';
  }
}
