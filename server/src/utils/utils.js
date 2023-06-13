function formatMilliseconds(ms) {
    return new Date(ms).toISOString().substring(11, 19);
}

function generatePassword(passwordLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

function convertScoreToRating(score, totalScore) {
    return +((score * 5 / totalScore).toFixed(2))
}

function convertRatingToScore(rating, totalScore) {
    return +((rating*totalScore/5).toFixed(2))
}

export {formatMilliseconds, generatePassword, convertScoreToRating, convertRatingToScore}