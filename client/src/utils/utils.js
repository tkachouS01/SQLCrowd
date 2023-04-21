const convertDate=(str)=> {
    return new Date(str).toLocaleString('ru-RU');
}
const timeSolution=(str)=> {
    return str.split(':')
        .map((val, i) => val + ['ч', 'мин', 'сек'][i])
        .join(' ');
}
export {convertDate, timeSolution}