function formatMilliseconds(ms) {
    return new Date(ms).toISOString().substring(11, 19);
}
export { formatMilliseconds }