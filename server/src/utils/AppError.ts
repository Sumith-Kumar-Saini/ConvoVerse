class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string; // Optional custom error code

  /**
   * Constructs an instance of AppError.
   * @param message The error message.
   * @param statusCode The HTTP status code associated with the error.
   * @param errorCode An optional custom error code for more specific identification.
   */
  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message); // Call the parent Error class constructor

    this.statusCode = statusCode;
    this.isOperational = true; // Indicates an error that can be handled gracefully
    this.errorCode = errorCode;

    // Capture the stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
