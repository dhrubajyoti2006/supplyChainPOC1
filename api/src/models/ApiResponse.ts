import {ApiMessage, ApiMessageCode} from "./ApiMessage";

/**
 * API Response
 */
export class ApiResponse<T> {
  public data: T;
  public messages: Array<ApiMessage>;

  /**
   *
   * @param {T} data
   * @param {Array<ApiMessage>} messages
   */
  constructor(data?: T, messages?: Array<ApiMessage>) {
    if (!data) {
      this.data = <T>{};
    } else {
      this.data = data;
    }
    if (!messages) {
      this.messages = [];
    } else {
      this.messages = messages;
    }
  }

  /**
   *
   */
  public addException(): void {
    if (!this.messages) {
      this.messages = [];
    }
    this.messages.push(new ApiMessage(ApiMessageCode.exception, "Exception Raised"));
  }

  /**
   * Adds an exception message with custom text to the messages array.
   * @param {string} message - The exception message to add.
   */
  public addExceptionWithText(message: string): void {
    if (!this.messages) {
      this.messages = [];
    }
    // console.log(message);
    this.messages.push(new ApiMessage(ApiMessageCode.exception, message));
  }

  /**
   * Adds an exception message to the messages array.
   */
  public addSuccess(): void {
    if (!this.messages) {
      this.messages = [];
    }
    this.messages.push(new ApiMessage(ApiMessageCode.success, ""));
  }

  /**
   *
   * @param {string} successText Success Text
   */
  public addSuccessWithText(successText: string): void {
    if (!this.messages) {
      this.messages = [];
    }
    this.messages.push(new ApiMessage(ApiMessageCode.success, successText));
  }

  /**
   *
   * @param {string} errorText Error Text
   */
  public addError(errorText: string): void {
    if (!this.messages) {
      this.messages = [];
    }
    this.messages.push(new ApiMessage(ApiMessageCode.error, errorText));
  }


  /**
   * isSuccessfull
   * @return {boolean} isSuccessfull
   */
  public isSuccessfull(): boolean {
    if (this.messages[0].code == ApiMessageCode.success) {
      return true;
    } else {
      return false;
    }
  }

  /**
   *
   * @return {boolean} isError
   */
  public isError(): boolean {
    if (this.messages[0].code != ApiMessageCode.success) {
      return true;
    } else {
      return false;
    }
  }
}
