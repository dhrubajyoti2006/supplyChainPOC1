"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMessage = exports.ApiMessageCode = void 0;
var ApiMessageCode;
(function (ApiMessageCode) {
    ApiMessageCode[ApiMessageCode["success"] = 1] = "success";
    ApiMessageCode[ApiMessageCode["error"] = 0] = "error";
    ApiMessageCode[ApiMessageCode["exception"] = -1] = "exception";
})(ApiMessageCode || (exports.ApiMessageCode = ApiMessageCode = {}));
/**
 * API Message
 */
class ApiMessage {
    /**
     *
     * @param {ApiMessageCode} code Message Code
     * @param {string} text Message Text
     */
    constructor(code, text) {
        this.code = code;
        this.text = text;
    }
}
exports.ApiMessage = ApiMessage;
