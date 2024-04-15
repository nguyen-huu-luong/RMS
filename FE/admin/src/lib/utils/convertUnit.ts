export const convertUnit = (number: number) => {
    if (number == 0) return 0;
    const units = ['', 'K', 'M', 'B', 'T'];
    const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
    const unitValue = Math.pow(10, unitIndex * 3);
    const shortNumber = number / unitValue;
    const roundedNumber = Math.round(shortNumber * 1000) / 1000;
    return `${roundedNumber}${units[unitIndex]}`
}