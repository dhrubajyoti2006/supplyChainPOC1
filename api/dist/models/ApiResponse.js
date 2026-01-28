"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const ApiMessage_1 = require("./ApiMessage");
/**
 * API Response
 */
class ApiResponse {
    /**
     *
     * @param {T} data
     * @param {Array<ApiMessage>} messages
     */
    constructor(data, messages) {
        if (!data) {
            this.data = {};
        }
        else {
            this.data = data;
        }
        if (!messages) {
            this.messages = [];
        }
        else {
            this.messages = messages;
        }
    }
    /**
     *
     */
    addException() {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(new ApiMessage_1.ApiMessage(ApiMessage_1.ApiMessageCode.exception, "Exception Raised"));
    }
    /**
     * Adds an exception message with custom text to the messages array.
     * @param {string} message - The exception message to add.
     */
    addExceptionWithText(message) {
        if (!this.messages) {
            this.messages = [];
        }
        // console.log(message);
        this.messages.push(new ApiMessage_1.ApiMessage(ApiMessage_1.ApiMessageCode.exception, message));
    }
    /**
     * Adds an exception message to the messages array.
     */
    addSuccess() {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(new ApiMessage_1.ApiMessage(ApiMessage_1.ApiMessageCode.success, ""));
    }
    /**
     *
     * @param {string} successText Success Text
     */
    addSuccessWithText(successText) {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(new ApiMessage_1.ApiMessage(ApiMessage_1.ApiMessageCode.success, successText));
    }
    /**
     *
     * @param {string} errorText Error Text
     */
    addError(errorText) {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(new ApiMessage_1.ApiMessage(ApiMessage_1.ApiMessageCode.error, errorText));
    }
    /**
     * isSuccessfull
     * @return {boolean} isSuccessfull
     */
    isSuccessfull() {
        if (this.messages[0].code == ApiMessage_1.ApiMessageCode.success) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     *
     * @return {boolean} isError
     */
    isError() {
        if (this.messages[0].code != ApiMessage_1.ApiMessageCode.success) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.ApiResponse = ApiResponse;
