export function logError(...args: any[]) {
  console.error("[zenblog error] ", ...args);
}

export function throwError(msg: string, ...args: any[]) {
  logError(msg, ...args);
  throw new Error("[zenblog error] " + msg);
}

export function createLogger(debug: boolean) {
  return (...args: any[]) => {
    if (debug) {
      console.log("[sdk] ", ...args);
    }
  };
}
