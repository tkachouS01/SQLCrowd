const convertDate = (str) => {
    let date = new Date(str);
    let now = new Date();
    let diff = date - now;
    let options = {numeric: "auto"};
    let rtf = new Intl.RelativeTimeFormat("ru-RU", options);
    let formattedDate;

    if (Math.abs(diff) < 60 * 1000) {
        formattedDate = rtf.format(Math.round(diff / 1000), "second");
    } else if (Math.abs(diff) < 60 * 60 * 1000) {
        formattedDate = rtf.format(Math.round(diff / (60 * 1000)), "minute");
    } else if (Math.abs(diff) < 24 * 60 * 60 * 1000) {
        formattedDate = rtf.format(Math.round(diff / (60 * 60 * 1000)), "hour");
    } else if (Math.abs(diff) < 30 * 24 * 60 * 60 * 1000) {
        formattedDate = rtf.format(Math.round(diff / (24 * 60 * 60 * 1000)), "day");
    } else if (Math.abs(diff) < 12 * 30 * 24 * 60 * 60 * 1000) {
        formattedDate = rtf.format(Math.round(diff / (30 * 24 * 60 * 60 * 1000)), "month");
    } else {
        formattedDate = rtf.format(Math.round(diff / (12 * 30 * 24 * 60 * 60 * 1000)), "year");
    }

    if (Math.abs(diff) >= 24 * 60 * 60 * 1000 || date.getFullYear() !== now.getFullYear()) {
        let timeOptions = {hour: "numeric", minute: "numeric"};
        let time = date.toLocaleTimeString("ru-RU", timeOptions);
        formattedDate += " в " + time;
    }

    return formattedDate;
}
const simpleConvertDate = (str) => {
    let date = new Date(str);
    let options = {day: 'numeric', month: 'long', year: 'numeric'};
    let formattedDate = date.toLocaleDateString("ru-RU", options);
    return formattedDate
}
const timeSolution = (str) => {
    return str.split(':')
        .map((val, i) => val !== "00" ? val + ['ч', 'мин', 'сек'][i] : "")
        .filter(val => val !== "")
        .join(' ');
}

export {convertDate, timeSolution, simpleConvertDate}