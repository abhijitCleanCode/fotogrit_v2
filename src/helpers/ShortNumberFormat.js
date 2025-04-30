export const ShortNumberFormat = (number) => {
  const lookup = [
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "M" },
    { value: 1e6, symbol: "Jt" },
    { value: 1e3, symbol: "Rb" }
  ];

  // Handle zero, null, undefined
  if (!number) return "0";

  // Find the appropriate range
  const item = lookup.find(item => Math.abs(number) >= item.value);

  if (!item) return number.toString();

  // Calculate the shortened number
  const shortenedNumber = (number / item.value).toFixed(1);

  // Remove trailing .0
  const formattedNumber = shortenedNumber.replace(/\.0$/, '');

  return `${formattedNumber}${item.symbol}`;
};

// With currency symbol option
export const ShortCurrencyFormat = (number, currencySymbol = 'Rp') => {
  if (!number) return `${currencySymbol} 0`;
  
  const shortNumber = ShortNumberFormat(number);
  return `${currencySymbol} ${shortNumber}`;
}; 