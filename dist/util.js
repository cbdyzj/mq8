"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debug(...args) {
    if (args[0] && args[0] instanceof Error) {
        console.error(...args);
    }
    console.info(...args);
}
exports.debug = debug;
exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
