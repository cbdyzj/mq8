function debug(message) {
    if (message instanceof Error) {
        console.error(message)
    }
    console.info(message)
}

export { debug }
