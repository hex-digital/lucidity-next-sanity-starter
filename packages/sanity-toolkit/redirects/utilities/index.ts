export function combinePathAndQuery(path: string, query?: URLSearchParams) {
  if (!query || [...query.keys()].length === 0) {
    return path;
  }

  const queryString = query.toString();

  const concatCharacter = path.includes('?') ? '+' : '?';

  return `${path}${concatCharacter}${queryString}`;
}

export function patternToRegex(pattern: string): RegExp {
  const regexStr =
    pattern
      .replace(/\//g, '\\/') // Escape slashes
      .replace(/\*/g, '.*') // Convert * to .*
      .replace(/:(\w+)/g, '(?<$1>[^\\/]+)') + // Convert :slug to named capture group
    '/?'; // Optionally allow trailing slashes

  return new RegExp(`^${regexStr}$`);
}

export function constructRedirectUrl(match: RegExpMatchArray, redirectUrl: string): string {
  let constructedUrl = redirectUrl;

  // Replace named capture groups in redirectUrl with actual values from match
  for (const [key, value] of Object.entries(match.groups ?? {})) {
    constructedUrl = constructedUrl.replace(`:${key}`, value);
  }

  return constructedUrl;
}
