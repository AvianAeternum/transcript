/**
 * Converts a day of the month to a string with the appropriate suffix.
 *
 * @param day The day of the month
 */
export function convertDay(day: number) {
    console.log(day)
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const specialCases = [11, 12, 13]; // 11th, 12th, 13th are exceptions

    // Check if the day falls in special cases (11, 12, 13)
    if (specialCases.includes(day % 100)) {
        return day + 'th';
    }

    // Otherwise, determine the appropriate suffix based on the last digit
    const lastDigit = day % 10;
    const suffix = suffixes[lastDigit] || 'th';

    return day + suffix;
}

/**
 * Converts a date to a string in the format of "HH:MM".
 *
 * @param date The date to convert
 */
export function convertTime(date: Date) {
    // hh:mm (24hr)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    let minutesString = minutes.toString();
    let hoursString = hours.toString();

    if (minutes < 10) {
        minutesString = `0${minutes}`;
    }

    if (hours < 10) {
        hoursString = `0${hours}`;
    }

    return `${hoursString}:${minutesString}`;
}

/**
 * Converts a duration in milliseconds to a string in the format of "mm:ss".
 *
 * @param duration The duration to convert
 */
export function convertDuration(duration: number) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    let minutesString = minutes.toString();
    let secondsString = seconds.toString();

    // 01m 01s or 49s
    if (minutes < 10) {
        minutesString = `0${minutes}`;
    }

    if (seconds < 10) {
        secondsString = `0${seconds}`;
    }

    return `${minutesString}m ${secondsString}s`;
}