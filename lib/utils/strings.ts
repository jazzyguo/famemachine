export const firstLetterToUppercase = (str = '') => {
    const result = str.charAt(0).toUpperCase() + str.slice(1);
    return result
}
