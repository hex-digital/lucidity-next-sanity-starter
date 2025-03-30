export function pluralise(
  word: string,
  count = 0,
  customPlural?: string,
  customZero?: string,
) {
  if (count === 1) {
    return word;
  }

  if (count === 0 && customZero) {
    return customZero;
  }

  if (customPlural) {
    return customPlural;
  }

  // Handle words ending in 'y'
  if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
    return `${word.slice(0, -1)}ies`;
  }

  // Handle words ending in 's', 'sh', 'ch', 'x', or 'z'
  if (/s$|sh$|ch$|x$|z$/.test(word)) {
    return `${word}es`;
  }

  return `${word}s`;
}
