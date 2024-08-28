"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.throwError = exports.logError = void 0;
function logError(...args) {
    console.error("[zenblog error] ", ...args);
}
exports.logError = logError;
function throwError(msg, ...args) {
    logError(msg, ...args);
    throw new Error("[zenblog error] " + msg);
}
exports.throwError = throwError;
function createLogger(debug) {
    return (...args) => {
        if (debug) {
            console.log("[🍊] ", ...args);
        }
    };
}
exports.createLogger = createLogger;
//# sourceMappingURL=index.js.map