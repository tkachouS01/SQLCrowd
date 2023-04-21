function formatMilliseconds(ms) {
    let result = new Date(ms).toISOString().substring(11, 19);
    return result;
}
export { formatMilliseconds }