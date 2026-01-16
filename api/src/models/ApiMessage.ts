export enum ApiMessageCode { success = 1, error = 0, exception = -1 }

/**
 * API Message
 */
export class ApiMessage {
  public code: ApiMessageCode;
  public text: string;

  /**
   *
   * @param {ApiMessageCode} code Message Code
   * @param {string} text Message Text
   */
  constructor(code: ApiMessageCode, text: string) {
    this.code = code;
    this.text = text;
  }
}
