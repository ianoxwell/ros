export const fractionNumber = (value: number | string | undefined): string => {
    if (!value) {
      return '0';
    }
  
    const num = typeof value === 'number' ? value : Number(value);
    const whole = Math.floor(num);
    const decimal = num - whole;
  
    const fractions: Record<number, string> = {
      0.125: '&#8539;', // 1/8
      0.25: '&#188;', // 1/4
      0.375: '&#8540;', // 3/8
      0.5: '&#189;', // 1/2
      0.625: '&#8541;', // 5/8
      0.75: '&#190;', // 3/4
      0.875: '&#8542;' // 7/8
    };
  
    if (decimal === 0) {
      return whole.toString();
    }
  
    if (fractions[decimal]) {
      return whole === 0 ? fractions[decimal] : `${whole} ${fractions[decimal]}`.trim();
    }
  
    return num.toFixed(2);
  };
  
  /** Takes the nutrient values 24.000, 0.1234 and returns '24' or '0.123' */
  export const fixWholeNumber = (value: number | string | undefined, length = 3): string => {
    if (!value || isNaN(Number(value))) {
      return '0';
    }
  
    const num = Number(value);
    return Number.isInteger(num) ? num.toString() : num.toFixed(length);
  };
  