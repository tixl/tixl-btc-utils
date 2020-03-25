export class RateLimitError extends Error {
  constructor() {
    super('Ran into rate limit, please try again later');
  }
}
