function consoleMessage(text) {
    console.log(`\x1b[33m !!          [${text}] \x1b[0m`);
}

function consoleError(text) {
    console.log(`\x1b[31m !!          [${text}] \x1b[0m`)
}

export {consoleMessage, consoleError}