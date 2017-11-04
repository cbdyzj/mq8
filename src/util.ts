export function debug(...args) {
    if (args[0] && args[0] instanceof Error) {
        console.error(...args)
    }
    console.info(...args)
}

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

