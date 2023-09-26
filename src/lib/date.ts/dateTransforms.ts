
/**
 * Converts a string in "YYYY-MM-DD" format to a Date object.
 *
 * @param {string} dateString - The input string in "YYYY-MM-DD" format.
 * @returns {Date | null} A Date object representing the parsed date, or null if the input is invalid.
 *
 * @example
 * const dateString = "2023-09-26";
 * const date = stringToDate(dateString);
 * if (date !== null) {
 *   console.log(`Parsed Date: ${date.toDateString()}`);
 * } else {
 *   console.error("Invalid date string.");
 * }
 */
export function stringToDate(dateString: string): Date | null {
    const dateParts = dateString.split('-').map(Number);
  
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      return null;
    }
  
    const [year, month, day] = dateParts;
  
    return new Date(year, month - 1, day + 1);
  }
  