"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = logError;
exports.throwError = throwError;
exports.createLogger = createLogger;
function logError(...args) {
    console.error("[zenblog error] ", ...args);
}
function throwError(msg, ...args) {
    logError(msg, ...args);
    throw new Error("[zenblog error] " + msg);
}
function createLogger(debug) {
    return (...args) => {
        if (debug) {
            console.log("[sdk] ", ...args);
        }
    };
}
//# sourceMappingURL=index.js.map